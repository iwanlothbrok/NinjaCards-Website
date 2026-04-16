import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import cors from "@/utils/cors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

type CheckoutMode = "subscription" | "payment";

type Body = {
    userId?: string;
    email?: string;
    trialDays?: number;
    checkoutMode?: CheckoutMode;
    metadata?: Record<string, string>;
    items: Array<{ type: string; priceId: string; quantity?: number }>;
};

function cleanOptionalString(v: unknown): string | undefined {
    if (typeof v !== "string") return undefined;
    const s = v.trim();
    return s.length ? s : undefined;
}

function isValidEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res);

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = (req.body || {}) as Body;

    const userId = cleanOptionalString(body.userId);
    const emailRaw = cleanOptionalString(body.email);
    const email = emailRaw && isValidEmail(emailRaw) ? emailRaw : undefined;

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: "Missing items" });
    }

    const items = body.items.map((i) => {
        const type = cleanOptionalString(i.type) ?? "";
        const priceId = cleanOptionalString(i.priceId);
        const quantity = typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1;

        if (!priceId || !priceId.startsWith("price_")) {
            throw new Error(`Invalid priceId: ${i.priceId}`);
        }

        if (!type) {
            throw new Error("Missing item.type");
        }

        return { type, priceId, quantity };
    });

    const subItems = items.filter((i) => i.type === "subscription");
    const oneTimeItems = items.filter((i) => i.type !== "subscription");
    const checkoutMode: CheckoutMode = body.checkoutMode ?? (subItems.length > 0 ? "subscription" : "payment");

    if (checkoutMode === "subscription" && subItems.length !== 1) {
        return res.status(400).json({ error: "Cart must contain exactly 1 subscription item" });
    }

    if (checkoutMode === "payment" && oneTimeItems.length === 0) {
        return res.status(400).json({ error: "Payment checkout requires at least one one-time item" });
    }

    const mergedOneTime = oneTimeItems.reduce((acc: Array<{ price: string; quantity: number }>, cur) => {
        const found = acc.find((x) => x.price === cur.priceId);
        if (found) found.quantity += cur.quantity;
        else acc.push({ price: cur.priceId, quantity: cur.quantity });
        return acc;
    }, []);

    const sessionMetadata: Record<string, string> = {};
    if (userId) sessionMetadata.userId = userId;

    for (const [key, value] of Object.entries(body.metadata ?? {})) {
        const normalized = cleanOptionalString(value);
        if (normalized) sessionMetadata[key] = normalized;
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: checkoutMode,
            allow_promotion_codes: true,
            ...(email ? { customer_email: email } : {}),
            line_items:
                checkoutMode === "subscription"
                    ? [{ price: subItems[0].priceId, quantity: 1 }, ...mergedOneTime]
                    : mergedOneTime,
            ...(checkoutMode === "subscription"
                ? {
                    subscription_data: {
                        ...(!userId ? { trial_period_days: typeof body.trialDays === "number" ? body.trialDays : 30 } : {}),
                        metadata: sessionMetadata,
                    },
                }
                : {}),
            metadata: sessionMetadata,
            success_url:
                checkoutMode === "payment"
                    ? `${process.env.FRONTEND_URL}/profile/billing?cardOrder=success&session_id={CHECKOUT_SESSION_ID}`
                    : `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:
                checkoutMode === "payment"
                    ? `${process.env.FRONTEND_URL}/profile/billing?cardOrder=cancelled`
                    : `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error("[checkout] Stripe session error:", err?.message || err);
        return res.status(500).json({ error: err?.message ?? "Failed to create checkout session" });
    }
}
