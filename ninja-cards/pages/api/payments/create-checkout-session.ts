// pages/api/payments/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import cors from "@/utils/cors"; // Assuming a custom CORS handler is present
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
    await cors(req, res); // Call it without returning prematurely


    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = (req.body || {}) as Body;

    const userId = cleanOptionalString(body.userId);
    const emailRaw = cleanOptionalString(body.email);
    const email = emailRaw && isValidEmail(emailRaw) ? emailRaw : undefined;

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: "Missing items" });
    }

    // Validate + normalize
    const items = body.items.map((i) => {
        const type = cleanOptionalString(i.type) ?? "";
        const priceId = cleanOptionalString(i.priceId);
        const quantity = typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1;

        if (!priceId || !priceId.startsWith("price_")) throw new Error(`Invalid priceId: ${i.priceId}`);
        if (!type) throw new Error("Missing item.type");

        return { type, priceId, quantity };
    });

    // 1) subscription (recurring)
    const subItems = items.filter((i) => i.type === "subscription");
    if (subItems.length !== 1) {
        return res.status(400).json({ error: "Cart must contain exactly 1 subscription item" });
    }
    const subscriptionPriceId = subItems[0].priceId;

    // 2) one-time items → add_invoice_items (design, nfc_card, etc.)
    const oneTimeItems = items.filter((i) => i.type !== "subscription");

    // Optional: merge duplicates by priceId
    const mergedOneTime = oneTimeItems.reduce((acc: Array<{ price: string; quantity: number }>, cur) => {
        const found = acc.find((x) => x.price === cur.priceId);
        if (found) found.quantity += cur.quantity;
        else acc.push({ price: cur.priceId, quantity: cur.quantity });
        return acc;
    }, []);

    const isLoggedIn = !!userId;

    const metadata: Record<string, string> = {
        userId: userId ?? "",
        isLoggedIn: isLoggedIn ? "1" : "0",
    };

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            allow_promotion_codes: true,
            customer_email: email,

            // ✅ recurring + one-time items in line_items
            line_items: [
                { price: subscriptionPriceId, quantity: 1 },
                ...mergedOneTime,
            ],

            // ✅ subscription metadata and trial
            subscription_data: {
                ...(isLoggedIn ? {} : { trial_period_days: typeof body.trialDays === "number" ? body.trialDays : 30 }),
                metadata,
            },

            metadata,

            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error("Stripe session error:", err?.message || err);
        return res.status(500).json({ error: err?.message ?? "Failed to create checkout session" });
    }
}