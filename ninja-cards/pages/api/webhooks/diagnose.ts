// FILE: pages/api/webhooks/diagnose.ts
// ─────────────────────────────────────────────────────────────────────────────
// Diagnostic tool — cross-references your 3 checkout events against the DB
// to show exactly what was/wasn't created for each payment.
//
// Usage:
//   GET /api/webhooks/diagnose
//
// It reads the 3 checkout.session.completed events from your logs, fetches
// the actual Stripe session data for each, then checks your DB for matching
// users, subscriptions, and invoices.
//
// DELETE THIS FILE after diagnosis.
// ─────────────────────────────────────────────────────────────────────────────
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
});

// The 3 checkout event IDs from your debug-logs response
const CHECKOUT_EVENT_IDS = [
    "evt_1T2p3CBMFJ6zM7JJCF5F3Uho", // 2026-02-20
    "evt_1T2TPABMFJ6zM7JJA1KYNXYa", // 2026-02-19
    "evt_1T2T8wBMFJ6zM7JJRs8n52hX", // 2026-02-19
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

    const results = [];

    for (const eventId of CHECKOUT_EVENT_IDS) {
        const entry: any = { eventId, stripeSession: null, dbUser: null, dbSubscription: null, dbInvoice: null, diagnosis: [] };

        try {
            // 1. Fetch the actual session from Stripe so we can see metadata + email
            const stripeEvent = await stripe.events.retrieve(eventId);
            const session = stripeEvent.data.object as Stripe.Checkout.Session;

            const email = session.customer_email ?? (session.customer_details as any)?.email ?? null;
            const customerId = session.customer as string | null;
            const subId = session.subscription as string | null;
            const metaUserId = session.metadata?.userId ?? null;

            entry.stripeSession = {
                email,
                customerId,
                subscriptionId: subId,
                metadataUserId: metaUserId,
                mode: session.mode,
                createdAt: new Date((stripeEvent as any).created * 1000).toISOString(),
            };

            // 2. Check if a user exists for this email
            if (email) {
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        subscriptionId: true,
                        createdAt: true,
                    },
                });
                if (user) {
                    entry.dbUser = {
                        id: user.id,
                        email: user.email,
                        hasPassword: user.password !== null,
                        subscriptionId: user.subscriptionId,
                        createdAt: user.createdAt,
                    };
                } else {
                    entry.dbUser = null;
                    entry.diagnosis.push("NO USER FOUND for this email in the database");
                }
            } else {
                entry.diagnosis.push("NO EMAIL on the Stripe session — Stripe did not provide customer email");
            }

            // 3. Check subscription by stripeSubId or customerId
            if (subId) {
                const sub = await prisma.subscription.findFirst({
                    where: { subscription_id: subId },
                    select: {
                        id: true,
                        userId: true,
                        plan: true,
                        status: true,
                        subscription_id: true,
                        stripe_user_id: true,
                        start_date: true,
                        end_date: true,
                        createdAt: true,
                    },
                });
                if (sub) {
                    entry.dbSubscription = sub;
                } else {
                    entry.dbSubscription = null;
                    entry.diagnosis.push("NO SUBSCRIPTION found matching stripeSubId — subscription was NOT created");
                }
            }

            // Also try by customerId in case subscription_id didn't match
            if (!entry.dbSubscription && customerId) {
                const subByCust = await prisma.subscription.findFirst({
                    where: { stripe_user_id: customerId },
                    select: { id: true, userId: true, plan: true, status: true, subscription_id: true },
                });
                if (subByCust) {
                    entry.dbSubscription = { ...subByCust, foundBy: "customerId" };
                }
            }

            // 4. Check if metaUserId matches anything
            if (metaUserId) {
                const userByMeta = await prisma.user.findUnique({
                    where: { id: metaUserId },
                    select: { id: true, email: true, subscriptionId: true },
                });
                entry.metadataUserLookup = userByMeta
                    ? { found: true, ...userByMeta }
                    : { found: false, note: "metadata.userId does not match any user in DB" };
            }

            // 5. Summarise what went wrong
            if (!entry.dbUser && !metaUserId) {
                entry.diagnosis.push("LIKELY CAUSE: No userId in metadata AND no user found by email → user creation was skipped or failed");
            }
            if (entry.dbUser && !entry.dbSubscription) {
                entry.diagnosis.push("LIKELY CAUSE: User exists but subscription was NOT saved → subscription create/update failed");
            }
            if (entry.dbUser && entry.dbSubscription && !entry.dbUser.subscriptionId) {
                entry.diagnosis.push("LIKELY CAUSE: Subscription exists but User.subscriptionId was not updated → the user.update step failed");
            }
            if (entry.dbUser && entry.dbSubscription && entry.dbUser.subscriptionId) {
                entry.diagnosis.push("Everything looks correctly linked in the DB for this event");
            }

        } catch (err: any) {
            entry.error = err?.message;
            entry.diagnosis.push(`Exception while diagnosing: ${err?.message}`);
        }

        results.push(entry);
    }

    // 6. Global stats
    const totalUsers = await prisma.user.count();
    const totalSubs = await prisma.subscription.count();

    return res.status(200).json({
        summary: { totalUsersInDB: totalUsers, totalSubscriptionsInDB: totalSubs },
        results,
    });
}