import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function isActive(status?: string | null) {
    return status === "active" || status === "trialing";
}

/** Throws if no active sub. Use inside server code before privileged actions. */
export async function requireActiveSubscription(userId: string) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub || !isActive(sub.status)) {
        const err: any = new Error("Subscription required");
        err.code = "SUBSCRIPTION_REQUIRED";
        throw err;
    }
}

/** Create a Stripe Billing Portal session for a user. */
export async function createBillingPortalSession(userId: string, returnUrl: string) {
    // We need the user's Stripe customer id: subscription.stripe_user_id
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub?.stripe_user_id) {
        throw new Error("No Stripe customer id for user.");
    }
    const session = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_user_id,
        return_url: returnUrl,
    });
    return session.url;
}

export function formatMinor(minor: number, currency: string) {
    // Keep it simple; Stripe amounts are minor units (e.g., 500 => 5.00)
    const amount = (minor / 100).toFixed(2);
    return `${amount} ${currency.toUpperCase()}`;
}


/** Get current user's subscription (+ next renew date if we want to display). */
export async function getUserSubscription(userId: string) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    return sub; // has: status, plan_id, start_date, end_date
}

/** List invoices for user ordered by newest first. */
export async function listUserInvoices(userId: string) {
    const invoices = await prisma.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            stripeId: true,
            amountPaid: true,
            currency: true,
            hostedInvoiceUrl: true,
            createdAt: true,
            stripeSubscriptionId: true,
            subscriptionId: true,
        },
    });
    return invoices;
}
