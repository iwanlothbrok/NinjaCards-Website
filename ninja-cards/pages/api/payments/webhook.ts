import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const sig = req.headers['stripe-signature']!;
    const buf = await buffer(req);

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error('❌ Invalid webhook signature:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            const stripeSubscriptionId = session.subscription as string;
            const stripeCustomerId = session.customer as string;
            const email = session.customer_email!;
            const priceId = session.metadata?.priceId || "unknown";

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) break;

            // Create new Subscription record
            const sub = await prisma.subscription.create({
                data: {
                    stripe_user_id: stripeCustomerId,
                    plan_id: priceId,
                    subscription_id: stripeSubscriptionId,
                    user: { connect: { id: user.id } },
                    status: 'active',
                    start_date: new Date(),
                },
            });

            // Update User to link to this subscription
            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionId: sub.id },
            });

            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            const stripeUserId = invoice.customer as string;

            const sub = await prisma.subscription.findFirst({
                where: { stripe_user_id: stripeUserId },
                include: { user: true },
            });

            if (!sub) break;

            await prisma.invoice.create({
                data: {
                    stripeId: invoice.id ?? 'unknown',
                    userId: sub.user.id,
                    amountPaid: invoice.amount_paid,
                    currency: invoice.currency,
                    hostedInvoiceUrl: invoice.hosted_invoice_url!,
                },
            });

            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeUserId = subscription.customer as string;

            const sub = await prisma.subscription.findFirst({
                where: { stripe_user_id: stripeUserId },
            });

            if (!sub) break;

            await prisma.subscription.update({
                where: { id: sub.id },
                data: { status: 'cancelled', end_date: new Date() },
            });

            break;
        }

        default:
            console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    res.status(200).end();
}
