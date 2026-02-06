// FILE: pages/api/webhooks/stripe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
});

type LocalStatus = "active" | "trialing" | "past_due" | "unpaid" | "paused" | "cancelled";

function mapStripeStatus(s: Stripe.Subscription.Status): LocalStatus {
    switch (s) {
        case "active":
            return "active";
        case "trialing":
            return "trialing";
        case "past_due":
            return "past_due";
        case "unpaid":
            return "unpaid";
        case "paused":
            return "paused";
        case "canceled":
            return "cancelled";
        case "incomplete":
        case "incomplete_expired":
        default:
            return "unpaid";
    }
}

function mapPriceToPlan(priceId?: string | null): "SHINOBI" | "SAMURAI" | "SHOGUN" {
    if (!priceId) return "SHINOBI";
    if (priceId === process.env.STRIPE_PRICE_SHOGUN) return "SHOGUN";
    if (priceId === process.env.STRIPE_PRICE_SAMURAI) return "SAMURAI";
    return "SHINOBI";
}

function getPriceIdFromSubscription(sub: Stripe.Subscription): string | null {
    return sub.items?.data?.[0]?.price?.id ?? null;
}

function getStripeSubIdFromInvoice(inv: any): string | undefined {
    return (
        inv?.subscription ||
        inv?.subscription_details?.subscription ||
        inv?.parent?.subscription_details?.subscription ||
        inv?.lines?.data?.[0]?.subscription ||
        undefined
    );
}

function toDateFromUnix(ts?: number | null): Date | null {
    if (!ts || typeof ts !== "number") return null;
    return new Date(ts * 1000);
}

async function syncLocalSubscriptionFromStripe(stripeSub: Stripe.Subscription) {
    const stripeSubId = stripeSub.id;
    const customerId = stripeSub.customer as string;

    const priceId = getPriceIdFromSubscription(stripeSub);
    const planEnum = mapPriceToPlan(priceId);
    const localStatus = mapStripeStatus(stripeSub.status);

    const startDate =
        toDateFromUnix((stripeSub as any).start_date) ??
        toDateFromUnix(stripeSub.created) ??
        new Date();

    const periodEnd = toDateFromUnix((stripeSub as any).current_period_end);
    const cancelAt = toDateFromUnix((stripeSub as any).cancel_at);
    const canceledAt = toDateFromUnix((stripeSub as any).canceled_at);


    const endDate = periodEnd ?? cancelAt ?? (stripeSub.status === "canceled" ? canceledAt : null);

    const existing =
        (await prisma.subscription.findUnique({ where: { subscription_id: stripeSubId } })) ||
        (await prisma.subscription.findFirst({ where: { stripe_user_id: customerId } }));

    if (!existing) return null;

    return prisma.subscription.update({
        where: { id: existing.id },
        data: {
            subscription_id: stripeSubId,
            stripe_user_id: customerId,
            plan: planEnum,
            status: localStatus,
            start_date: startDate,
            end_date: endDate,
            cancel_date: stripeSub.status === "canceled" ? canceledAt ?? new Date() : null,
        },
    });
}

// ---------------------------
// ✅ ENTERPRISE IDEMPOTENCY
// ---------------------------
async function acquireEventLock(event: Stripe.Event) {
    // 1) Try to create event row as "processing"
    try {
        const row = await prisma.webhookEvent.create({
            data: {
                id: event.id,
                type: event.type,
                status: "processing",
                attempts: 1,
            },
        });
        return { action: "process" as const, row };
    } catch (e: any) {
        // If already exists → decide based on status
        const existing = await prisma.webhookEvent.findUnique({ where: { id: event.id } });
        if (!existing) throw e;

        if (existing.status === "processed") {
            return { action: "skip" as const, reason: "already_processed" as const };
        }

        // If stuck in processing for too long, allow re-process
        // (example: server crashed mid-process)
        const STUCK_MINUTES = 10;
        const stuck =
            existing.status === "processing" &&
            Date.now() - new Date(existing.updatedAt).getTime() > STUCK_MINUTES * 60 * 1000;

        if (stuck || existing.status === "failed") {
            const row = await prisma.webhookEvent.update({
                where: { id: event.id },
                data: {
                    status: "processing",
                    attempts: { increment: 1 },
                    lastError: null,
                },
            });
            return { action: "process" as const, row };
        }

        // processing but not stuck → another instance is processing it
        return { action: "skip" as const, reason: "currently_processing" as const };
    }
}

async function markEventProcessed(eventId: string) {
    await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
            status: "processed",
            processedAt: new Date(),
            lastError: null,
        },
    });
}

async function markEventFailed(eventId: string, err: any) {
    const msg = (err?.message ?? String(err)).slice(0, 5000);
    await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
            status: "failed",
            lastError: msg,
        },
    });
}

// ---------------------------
// MAIN HANDLER
// ---------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    if (!whsec?.startsWith("whsec_")) return res.status(500).send("Missing/invalid STRIPE_WEBHOOK_SECRET");

    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") return res.status(400).send("Missing stripe-signature");

    const raw = await buffer(req);

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(raw, sig, whsec);
    } catch (e: any) {
        return res.status(400).send(`Webhook Error: ${e.message}`);
    }

    // ✅ Acquire lock BEFORE processing
    const lock = await acquireEventLock(event);
    if (lock.action === "skip") return res.status(200).end();

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.mode !== "subscription") break;

                const userId = session.metadata?.userId;
                const customerId = session.customer as string | null;
                const stripeSubId = session.subscription as string | null;

                if (!userId || !customerId || !stripeSubId) break;

                const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);

                const priceId = getPriceIdFromSubscription(stripeSub);
                const planEnum = mapPriceToPlan(priceId);
                const localStatus = mapStripeStatus(stripeSub.status);

                const startDate =
                    toDateFromUnix((stripeSub as any).start_date) ??
                    toDateFromUnix(stripeSub.created) ??
                    new Date();


                const endDate = toDateFromUnix((stripeSub as any).current_period_end);

                const canceledAt = toDateFromUnix(stripeSub.canceled_at);
                const cancelDate = stripeSub.status === "canceled" ? canceledAt ?? new Date() : null;

                const sub = await prisma.subscription.upsert({
                    where: { userId },
                    create: {
                        userId,
                        subscription_id: stripeSub.id,
                        stripe_user_id: customerId,
                        plan: planEnum,
                        status: localStatus,
                        start_date: startDate,
                        end_date: endDate,
                        cancel_date: cancelDate,
                    },
                    update: {
                        subscription_id: stripeSub.id,
                        stripe_user_id: customerId,
                        plan: planEnum,
                        status: localStatus,
                        start_date: startDate,
                        end_date: endDate,
                        cancel_date: cancelDate,
                    },
                });

                await prisma.user.update({
                    where: { id: userId },
                    data: { subscriptionId: sub.id },
                });

                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const stripeSub = event.data.object as Stripe.Subscription;
                await syncLocalSubscriptionFromStripe(stripeSub);
                break;
            }

            case "customer.subscription.deleted": {
                const stripeSub = event.data.object as Stripe.Subscription;
                const existing = await prisma.subscription.findUnique({ where: { subscription_id: stripeSub.id } });
                if (!existing) break;

                await prisma.subscription.update({
                    where: { id: existing.id },
                    data: {
                        status: "cancelled",
                        cancel_date: new Date(),
                        end_date: new Date(),
                    },
                });

                break;
            }

            case "invoice.payment_succeeded": {
                const inv: any = event.data.object;

                const invoiceId: string | undefined = inv?.id;
                const customerId: string | undefined = inv?.customer;
                const hostedUrl: string | undefined = inv?.hosted_invoice_url ?? inv?.invoice_pdf ?? undefined;

                const amountPaidCents: number = (inv?.amount_paid ?? inv?.total ?? 0) as number;
                const currency: string = (inv?.currency ?? "eur").toString();

                const stripeSubId = getStripeSubIdFromInvoice(inv);

                const sub =
                    (stripeSubId ? await prisma.subscription.findFirst({ where: { subscription_id: stripeSubId } }) : null) ||
                    (customerId ? await prisma.subscription.findFirst({ where: { stripe_user_id: customerId } }) : null);

                let userId = sub?.userId;

                if (!userId) {
                    const emailFromStripe: string | undefined = inv?.customer_email;
                    if (emailFromStripe) {
                        const u = await prisma.user.findUnique({ where: { email: emailFromStripe } });
                        userId = u?.id;
                    }
                }

                if (invoiceId && userId && hostedUrl) {
                    await prisma.invoice.upsert({
                        where: { stripeId: invoiceId },
                        create: {
                            stripeId: invoiceId,
                            userId,
                            amountPaid: amountPaidCents,
                            currency,
                            hostedInvoiceUrl: hostedUrl,
                            stripeSubscriptionId: stripeSubId ?? null,
                            subscriptionId: sub?.id ?? null,
                        },
                        update: {
                            amountPaid: amountPaidCents,
                            currency,
                            hostedInvoiceUrl: hostedUrl,
                            stripeSubscriptionId: stripeSubId ?? null,
                            subscriptionId: sub?.id ?? null,
                        },
                    });
                }

                break;
            }

            case "invoice.payment_failed": {
                const inv: any = event.data.object;
                const customerId: string | undefined = inv?.customer;
                const stripeSubId = getStripeSubIdFromInvoice(inv);

                const sub =
                    (stripeSubId ? await prisma.subscription.findFirst({ where: { subscription_id: stripeSubId } }) : null) ||
                    (customerId ? await prisma.subscription.findFirst({ where: { stripe_user_id: customerId } }) : null);

                if (sub) {
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: "past_due" },
                    });
                }

                break;
            }

            default:
                break;
        }

        // ✅ Mark processed only if everything above succeeded
        await markEventProcessed(event.id);
        return res.status(200).end();
    } catch (err: any) {
        await markEventFailed(event.id, err);
        console.error("❌ Webhook handler failed:", err?.message);
        return res.status(500).send("Webhook handler failed");
    }
}
