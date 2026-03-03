// FILE: pages/api/webhooks/stripe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
});

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG LOGGER
// Writes each step into `lastError` on the WebhookEvent row so you can read
// exactly where execution stopped via GET /api/webhooks/debug-logs
// ─────────────────────────────────────────────────────────────────────────────
async function dbLog(eventId: string, step: string, data: unknown) {
    const line = `[${new Date().toISOString()}] ${step}: ${JSON.stringify(data)}`;
    console.log("[webhook]", line);
    try {
        // Append to lastError so we accumulate a trace
        const current = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
        const prev = current?.lastError ?? "";
        await prisma.webhookEvent.update({
            where: { id: eventId },
            data: { lastError: `${prev}\n${line}`.slice(-5000) },
        });
    } catch (_) { }
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL
// ─────────────────────────────────────────────────────────────────────────────
async function sendPaymentSuccessEmail(opts: {
    to: string;
    plan: string;
    amountMinor: number;
    currency: string;
    invoiceUrl?: string;
    isNewUser: boolean;
}) {
    const from = process.env.BILLING_FROM_EMAIL ?? "billing@ninjacards.com";
    const amount = (opts.amountMinor / 100).toFixed(2);
    const cur = (opts.currency || "eur").toUpperCase();

    const subject = opts.isNewUser
        ? `Welcome to NinjaCards — your ${opts.plan} plan is active`
        : `Payment confirmed — ${amount} ${cur}`;

    const newUserBlock = opts.isNewUser ? `
      <div style="background:#000;padding:20px;border-left:4px solid #f59e0b;margin:20px 0;border-radius:0 6px 6px 0;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#f59e0b;">Account Created</p>
        <p style="margin:0;font-size:14px;color:#d1d5db;">
          We created an account using this email address.<br/>
          Set your password via <strong>Forgot Password</strong> on the login page.
        </p>
      </div>` : "";

    const invoiceBtn = opts.invoiceUrl ? `
      <p style="margin:24px 0 0;">
        <a href="${opts.invoiceUrl}" target="_blank"
           style="display:inline-block;background:transparent;border:1px solid #374151;color:#9ca3af;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:13px;">
          View Invoice
        </a>
      </p>` : "";

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#080a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080a0f;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#f59e0b,transparent);border-radius:2px 2px 0 0;"></td></tr>
        <tr><td style="background:#0e1117;border:1px solid rgba(255,255,255,.07);border-top:none;border-radius:0 0 16px 16px;padding:40px 32px;">
          <p style="margin:0 0 28px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:rgba(245,158,11,.7);">NinjaCards</p>
          <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#f9fafb;letter-spacing:-.02em;">Payment confirmed</p>
          <p style="margin:0 0 28px;font-size:15px;color:#6b7280;">Your <strong style="color:#f9fafb;">${opts.plan}</strong> subscription is now active.</p>
          <div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:12px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.05);">
                <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;">Plan</span>
                <span style="float:right;font-size:14px;font-weight:700;color:#f59e0b;">${opts.plan}</span>
              </td></tr>
              <tr><td style="padding-top:10px;">
                <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;">Amount</span>
                <span style="float:right;font-size:14px;font-weight:700;color:#f9fafb;">${amount} ${cur}</span>
              </td></tr>
            </table>
          </div>
          ${newUserBlock}
          <p style="margin:28px 0 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://ninjacards.com"}/dashboard"
               style="display:inline-block;padding:12px 28px;background:#f59e0b;border-radius:10px;color:#000;font-weight:700;font-size:14px;text-decoration:none;">
              Go to Dashboard
            </a>
          </p>
          ${invoiceBtn}
          <p style="margin:32px 0 0;font-size:12px;color:#4b5563;line-height:1.6;border-top:1px solid rgba(255,255,255,.05);padding-top:24px;">
            Questions? Reply to this email or contact support.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const result = await resend.emails.send({ from, to: opts.to, subject, html });
    if (result.error) throw new Error(`Resend error: ${result.error.message}`);
    return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
type LocalStatus = "active" | "trialing" | "past_due" | "unpaid" | "paused" | "cancelled";

function mapStripeStatus(s: Stripe.Subscription.Status): LocalStatus {
    switch (s) {
        case "active": return "active";
        case "trialing": return "trialing";
        case "past_due": return "past_due";
        case "unpaid": return "unpaid";
        case "paused": return "paused";
        case "canceled": return "cancelled";
        default: return "unpaid";
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

    const startDate = (() => {
        const utcDate =
            toDateFromUnix((stripeSub as any).start_date) ??
            toDateFromUnix(stripeSub.created) ??
            new Date();
        return new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);
    })();

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

async function acquireEventLock(event: Stripe.Event) {
    try {
        const row = await prisma.webhookEvent.create({
            data: { id: event.id, type: event.type, status: "processing", attempts: 1 },
        });
        return { action: "process" as const, row };
    } catch (e: any) {
        const existing = await prisma.webhookEvent.findUnique({ where: { id: event.id } });
        if (!existing) throw e;

        if (existing.status === "processed") return { action: "skip" as const };

        const STUCK_MINUTES = 10;
        const stuck =
            existing.status === "processing" &&
            Date.now() - new Date(existing.updatedAt).getTime() > STUCK_MINUTES * 60 * 1000;

        if (stuck || existing.status === "failed") {
            const row = await prisma.webhookEvent.update({
                where: { id: event.id },
                data: { status: "processing", attempts: { increment: 1 }, lastError: null },
            });
            return { action: "process" as const, row };
        }

        return { action: "skip" as const };
    }
}

async function markEventProcessed(eventId: string) {
    await prisma.webhookEvent.update({
        where: { id: eventId },
        data: { status: "processed", processedAt: new Date(), lastError: null },
    });
}

async function markEventFailed(eventId: string, err: any) {
    const msg = (err?.message ?? String(err)).slice(0, 5000);
    await prisma.webhookEvent.update({
        where: { id: eventId },
        data: { status: "failed", lastError: msg },
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────
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
        console.error("[webhook] Signature verification failed:", e.message);
        return res.status(400).send(`Webhook Error: ${e.message}`);
    }

    console.log(`[webhook] Received: ${event.type} / ${event.id}`);

    const lock = await acquireEventLock(event);
    if (lock.action === "skip") {
        console.log(`[webhook] Skip duplicate: ${event.id}`);
        return res.status(200).end();
    }

    try {
        switch (event.type) {

            // ─────────────────────────────────────────────────────────────────
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                await dbLog(event.id, "STEP_1_SESSION", {
                    mode: session.mode,
                    customerId: session.customer,
                    subId: session.subscription,
                    email: session.customer_email ?? (session.customer_details as any)?.email,
                    metaUserId: session.metadata?.userId,
                });

                if (session.mode !== "subscription") {
                    await dbLog(event.id, "SKIP_NOT_SUBSCRIPTION", { mode: session.mode });
                    break;
                }

                const customerId = session.customer as string | null;
                const stripeSubId = session.subscription as string | null;

                if (!customerId || !stripeSubId) {
                    await dbLog(event.id, "SKIP_MISSING_IDS", { customerId, stripeSubId });
                    break;
                }

                const emailFromStripe: string | null =
                    session.customer_email ??
                    (session.customer_details as any)?.email ??
                    null;

                let userId = session.metadata?.userId?.trim() || null;
                let isNewUser = false;

                await dbLog(event.id, "STEP_2_USER_RESOLVE", { userId, emailFromStripe });

                if (!userId) {
                    if (!emailFromStripe) {
                        await dbLog(event.id, "ERROR_NO_EMAIL_AND_NO_USERID", {});
                        break;
                    }

                    const existingUser = await prisma.user.findUnique({ where: { email: emailFromStripe } });
                    await dbLog(event.id, "STEP_2a_USER_LOOKUP", { found: !!existingUser, existingId: existingUser?.id });

                    if (existingUser) {
                        userId = existingUser.id;
                    } else {
                        const newUser = await prisma.user.create({
                            data: { email: emailFromStripe, password: null },
                        });
                        userId = newUser.id;
                        isNewUser = true;
                        await dbLog(event.id, "STEP_2b_USER_CREATED", { userId, email: emailFromStripe });
                    }
                }

                const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
                await dbLog(event.id, "STEP_3_STRIPE_SUB", { subId: stripeSub.id, status: stripeSub.status, priceId: getPriceIdFromSubscription(stripeSub) });

                const priceId = getPriceIdFromSubscription(stripeSub);
                const planEnum = mapPriceToPlan(priceId);
                const localStatus = mapStripeStatus(stripeSub.status);

                const startDate = (() => {
                    const utcDate =
                        toDateFromUnix((stripeSub as any).start_date) ??
                        toDateFromUnix(stripeSub.created) ??
                        new Date();
                    return new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);
                })();

                const endDate = toDateFromUnix((stripeSub as any).current_period_end);
                const canceledAt = toDateFromUnix(stripeSub.canceled_at);
                const cancelDate = stripeSub.status === "canceled" ? canceledAt ?? new Date() : null;

                const existingSub = await prisma.subscription.findFirst({ where: { userId } });
                await dbLog(event.id, "STEP_4_SUB_LOOKUP", { found: !!existingSub, existingSubId: existingSub?.id });

                let sub: any;
                if (existingSub) {
                    sub = await prisma.subscription.update({
                        where: { id: existingSub.id },
                        data: {
                            subscription_id: stripeSub.id,
                            stripe_user_id: customerId,
                            plan: planEnum,
                            status: localStatus,
                            start_date: startDate,
                            end_date: endDate,
                            cancel_date: cancelDate,
                        },
                    });
                    await dbLog(event.id, "STEP_4a_SUB_UPDATED", { subId: sub.id });
                } else {
                    sub = await prisma.subscription.create({
                        data: {
                            userId,
                            subscription_id: stripeSub.id,
                            stripe_user_id: customerId,
                            plan: planEnum,
                            status: localStatus,
                            start_date: startDate,
                            end_date: endDate,
                            cancel_date: cancelDate,
                        },
                    });
                    await dbLog(event.id, "STEP_4b_SUB_CREATED", { subId: sub.id });
                }

                await prisma.user.update({
                    where: { id: userId! },
                    data: { subscriptionId: sub.id },
                });
                await dbLog(event.id, "STEP_5_USER_LINKED", { userId, subId: sub.id });

                if (emailFromStripe) {
                    try {
                        await sendPaymentSuccessEmail({
                            to: emailFromStripe,
                            plan: planEnum,
                            amountMinor: 0,
                            currency: "eur",
                            isNewUser,
                        });
                        await dbLog(event.id, "STEP_6_EMAIL_SENT", { to: emailFromStripe, isNewUser });
                    } catch (mailErr: any) {
                        await dbLog(event.id, "STEP_6_EMAIL_FAILED", { error: mailErr?.message });
                        // Non-fatal — do not rethrow
                    }
                } else {
                    await dbLog(event.id, "STEP_6_EMAIL_SKIPPED", { reason: "no email address" });
                }

                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const stripeSub = event.data.object as Stripe.Subscription;
                await dbLog(event.id, event.type, { subId: stripeSub.id, status: stripeSub.status });
                await syncLocalSubscriptionFromStripe(stripeSub);
                break;
            }

            case "customer.subscription.deleted": {
                const stripeSub = event.data.object as Stripe.Subscription;
                await dbLog(event.id, "subscription.deleted", { subId: stripeSub.id });
                const existing = await prisma.subscription.findUnique({ where: { subscription_id: stripeSub.id } });
                if (!existing) break;
                await prisma.subscription.update({
                    where: { id: existing.id },
                    data: { status: "cancelled", cancel_date: new Date(), end_date: new Date() },
                });
                break;
            }

            case "invoice.payment_succeeded": {
                const inv: any = event.data.object;

                await dbLog(event.id, "invoice.payment_succeeded", {
                    invoiceId: inv?.id,
                    customerId: inv?.customer,
                    customerEmail: inv?.customer_email,
                    billingReason: inv?.billing_reason,
                    amount: inv?.amount_paid,
                    currency: inv?.currency,
                    stripeSubId: getStripeSubIdFromInvoice(inv),
                });

                const invoiceId: string | undefined = inv?.id;
                const customerId: string | undefined = inv?.customer;
                const hostedUrl: string | undefined = inv?.hosted_invoice_url ?? inv?.invoice_pdf ?? undefined;
                const amountPaidCents: number = (inv?.amount_paid ?? inv?.total ?? 0) as number;
                const currency: string = (inv?.currency ?? "eur").toString();
                const stripeSubId = getStripeSubIdFromInvoice(inv);
                const userEmail: string | undefined = inv?.customer_email;

                const sub =
                    (stripeSubId ? await prisma.subscription.findFirst({ where: { subscription_id: stripeSubId } }) : null) ||
                    (customerId ? await prisma.subscription.findFirst({ where: { stripe_user_id: customerId } }) : null);

                let userId = sub?.userId;
                if (!userId && userEmail) {
                    const u = await prisma.user.findUnique({ where: { email: userEmail } });
                    userId = u?.id;
                }

                if (invoiceId && userId && hostedUrl) {
                    await prisma.invoice.upsert({
                        where: { stripeId: invoiceId },
                        create: {
                            stripeId: invoiceId, userId,
                            amountPaid: amountPaidCents, currency,
                            hostedInvoiceUrl: hostedUrl,
                            stripeSubscriptionId: stripeSubId ?? null,
                            subscriptionId: sub?.id ?? null,
                        },
                        update: {
                            amountPaid: amountPaidCents, currency,
                            hostedInvoiceUrl: hostedUrl,
                            stripeSubscriptionId: stripeSubId ?? null,
                            subscriptionId: sub?.id ?? null,
                        },
                    });
                }

                const isRenewal = inv?.billing_reason === "subscription_cycle";
                if (isRenewal && userEmail && sub) {
                    try {
                        await sendPaymentSuccessEmail({
                            to: userEmail, plan: sub.plan,
                            amountMinor: amountPaidCents, currency,
                            invoiceUrl: hostedUrl, isNewUser: false,
                        });
                    } catch (mailErr: any) {
                        await dbLog(event.id, "RENEWAL_EMAIL_FAILED", { error: mailErr?.message });
                    }
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
                    await prisma.subscription.update({ where: { id: sub.id }, data: { status: "past_due" } });
                }
                break;
            }

            default:
                await dbLog(event.id, "UNHANDLED_EVENT_TYPE", { type: event.type });
                break;
        }

        await markEventProcessed(event.id);
        return res.status(200).end();

    } catch (err: any) {
        // markEventFailed writes the error message to lastError —
        // but we also want the full stack so we append it here
        const fullMsg = `${err?.message}\n${err?.stack ?? ""}`.slice(0, 5000);
        console.error("[webhook] FATAL ERROR:", fullMsg);
        await prisma.webhookEvent.update({
            where: { id: event.id },
            data: { status: "failed", lastError: fullMsg },
        }).catch(() => { });
        return res.status(500).send("Webhook handler failed");
    }
}