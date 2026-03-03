// pages/api/payments/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import cors from "@/utils/cors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

type Body = {
    userId?: string;
    email?: string;
    trialDays?: number;
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

    const userId = cleanOptionalString(body.userId);   // undefined when not logged in
    const emailRaw = cleanOptionalString(body.email);
    const email = emailRaw && isValidEmail(emailRaw) ? emailRaw : undefined;

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: "Missing items" });
    }

    const items = body.items.map((i) => {
        const type = cleanOptionalString(i.type) ?? "";
        const priceId = cleanOptionalString(i.priceId);
        const quantity = typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1;
        if (!priceId || !priceId.startsWith("price_")) throw new Error(`Invalid priceId: ${i.priceId}`);
        if (!type) throw new Error("Missing item.type");
        return { type, priceId, quantity };
    });

    const subItems = items.filter((i) => i.type === "subscription");
    if (subItems.length !== 1) {
        return res.status(400).json({ error: "Cart must contain exactly 1 subscription item" });
    }

    const oneTimeItems = items.filter((i) => i.type !== "subscription");
    const mergedOneTime = oneTimeItems.reduce((acc: Array<{ price: string; quantity: number }>, cur) => {
        const found = acc.find((x) => x.price === cur.priceId);
        if (found) found.quantity += cur.quantity;
        else acc.push({ price: cur.priceId, quantity: cur.quantity });
        return acc;
    }, []);

    // ── FIX 1: Only include userId in metadata when it actually has a value ──
    // An empty string "" is falsy after trim() but Stripe stores it as a string.
    // The webhook does: session.metadata?.userId?.trim() || null
    // If userId is "" that evaluates to null and falls through to email lookup.
    // Solution: only put userId in metadata when it's a real non-empty value.
    const sessionMetadata: Record<string, string> = {};
    if (userId) sessionMetadata.userId = userId;

    // ── FIX 2: Always collect email during checkout ──────────────────────────
    // If the user isn't logged in and no email was passed, Stripe will collect
    // it during the checkout flow and expose it on session.customer_details.email.
    // Do NOT pass customer_email: undefined — just omit it entirely and let
    // Stripe collect it. The webhook reads customer_details.email as fallback.

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            allow_promotion_codes: true,

            // Only set customer_email when we actually have one.
            // If absent, Stripe shows an email field in the checkout form
            // and populates session.customer_details.email — which our webhook reads.
            ...(email ? { customer_email: email } : {}),

            line_items: [
                { price: subItems[0].priceId, quantity: 1 },
                ...mergedOneTime,
            ],

            subscription_data: {
                // Only give a trial to guests (no userId = not logged in)
                ...(!userId ? { trial_period_days: typeof body.trialDays === "number" ? body.trialDays : 30 } : {}),
                // ── FIX 3: metadata on subscription_data is what the webhook reads ──
                // session.metadata and subscription_data.metadata are separate objects.
                // The webhook reads session.metadata, so put userId there.
                // We set both so downstream subscription events also carry the userId.
                metadata: sessionMetadata,
            },

            // This is what the webhook reads via session.metadata.userId
            metadata: sessionMetadata,

            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error("[checkout] Stripe session error:", err?.message || err);
        return res.status(500).json({ error: err?.message ?? "Failed to create checkout session" });
    }
}