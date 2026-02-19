import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

type Body = {
    userId?: string;
    email?: string;

    // subscription plan price (monthly)
    subscriptionPriceId?: string;

    // one-time design price
    designPriceId?: string;

    // optional quantities
    subscriptionQty?: number;
    designQty?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const {
        userId,
        email,
        subscriptionPriceId,
        designPriceId,
        subscriptionQty = 1,
        designQty = 1,
    } = (req.body || {}) as Body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });
    if (!subscriptionPriceId) return res.status(400).json({ error: "Missing subscriptionPriceId" });

    // basic validation to avoid passing product ids etc.
    if (!subscriptionPriceId.startsWith("price_")) {
        return res.status(400).json({ error: "subscriptionPriceId must be a price_..." });
    }
    if (designPriceId && !designPriceId.startsWith("price_")) {
        return res.status(400).json({ error: "designPriceId must be a price_..." });
    }

    try {
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            { price: subscriptionPriceId, quantity: subscriptionQty },
        ];

        // add one-time design to the same subscription checkout
        if (designPriceId) {
            line_items.push({ price: designPriceId, quantity: designQty });
        }

        const metadata = {
            userId,
            subscriptionPriceId,
            designPriceId: designPriceId ?? "",
        };

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                { price: subscriptionPriceId, quantity: 1 },
                { price: designPriceId, quantity: 1 }, // €20 ще е due today
            ],
            subscription_data: {
                trial_period_days: 30, // ✅ първият месец free (ориентировъчно 30 дни)
                metadata: { userId },
            },

            metadata: { userId },
            customer_email: email ?? undefined,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });


        return res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error("Stripe session error:", err);
        return res.status(400).json({ error: err.message ?? "Failed to create checkout session" });
    }
}
