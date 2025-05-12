import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { PrismaClient } from '@prisma/client';

export const config = { api: { bodyParser: false } };
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method not allowed");

    const sig = req.headers["stripe-signature"]!;
    const buf = await buffer(req);
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err}`);
    }

    const subscriptionEvent = event.data.object as Stripe.Subscription;

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
        await prisma.subscription.upsert({
            where: { subscription_id: subscriptionEvent.id },
            update: {
                status: subscriptionEvent.status,
                plan_id: subscriptionEvent.items.data[0].price.id,
                start_date: new Date(subscriptionEvent.start_date * 1000),
                end_date: subscriptionEvent.ended_at ? new Date(subscriptionEvent.ended_at * 1000) : null,
            },
            create: {
                subscription_id: subscriptionEvent.id,
                stripe_user_id: subscriptionEvent.customer as string,
                // email field removed as it does not exist in the Subscription model
                userId: subscriptionEvent.metadata.userId,
                status: subscriptionEvent.status,
                plan_id: subscriptionEvent.items.data[0].price.id,
                start_date: new Date(subscriptionEvent.start_date * 1000),
            },
        });
    }

    res.status(200).json({ received: true });
}
