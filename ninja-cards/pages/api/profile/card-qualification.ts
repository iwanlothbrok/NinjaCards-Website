import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/utils/cors";
import { prisma } from "@/lib/prisma";
import { getPlanEntitlements, getGenericCardQualification, getLeadUsageSnapshot } from "@/lib/entitlements";
import Stripe from "stripe";
import { CARD_ADDON_PRICE_IDS, getBillingCycleFromStripePriceId } from "@/lib/planCatalog";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

function getRequestedUserId(req: NextApiRequest) {
  const bodyUserId = typeof req.body?.userId === "string" ? req.body.userId : null;
  const queryUserId = typeof req.query.userId === "string" ? req.query.userId : null;
  const headerUserId = typeof req.headers["x-user-id"] === "string" ? req.headers["x-user-id"] : null;

  return bodyUserId || queryUserId || headerUserId;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsHandled = cors(req, res);
  if (corsHandled) return;

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = getRequestedUserId(req);
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [genericRequest, personalizedRequest] = await Promise.all([
      prisma.contact.findFirst({
        where: {
          email: user.email ?? "",
          subject: {
            startsWith: `CARD_REQUEST|generic|user:${user.id}`,
          },
        },
        orderBy: { sendedOn: "desc" },
      }),
      prisma.contact.findFirst({
        where: {
          email: user.email ?? "",
          subject: {
            startsWith: `CARD_REQUEST|personalized|user:${user.id}`,
          },
        },
        orderBy: { sendedOn: "desc" },
      }),
    ]);

    const qualification = getGenericCardQualification({
      profile: user,
      email: user.email,
      hasShippingPayment: false,
      hasExistingRequest: Boolean(genericRequest),
      isFulfilled: false,
    });

    const entitlements = getPlanEntitlements(user.subscription?.plan);
    const leadUsage = await getLeadUsageSnapshot(prisma, user.id, user.subscription?.plan);
    let billingCycle: "monthly" | "quarterly" | "annual" | null = null;

    if (user.subscription?.subscription_id) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(user.subscription.subscription_id);
        const priceId = stripeSub.items?.data?.[0]?.price?.id ?? null;
        billingCycle = getBillingCycleFromStripePriceId(priceId);
      } catch (stripeError) {
        console.error("[profile/card-qualification] failed to resolve billing cycle", stripeError);
      }
    }

    return res.status(200).json({
      userId: user.id,
      email: user.email ?? null,
      canonicalPlan: entitlements.canonicalPlan,
      billingCycle,
      entitlements,
      leadUsage,
      genericCard: {
        unlockRequirements: {
          minProfileScoreExclusive: 50,
          verifiedEmailRequired: true,
          shippingPaymentRequired: true,
          onePerAccount: true,
        },
        score: qualification.score,
        completionPct: qualification.completionPct,
        qualifiesByScore: qualification.qualifiesByScore,
        hasVerifiedEmail: qualification.hasVerifiedEmail,
        eligible: qualification.genericCardEligible,
        state: qualification.state,
        blockers: qualification.blockers,
        missing: qualification.missing,
        requestedAt: genericRequest?.sendedOn ?? null,
      },
      personalizedCard: {
        availableOnPaidPlans: entitlements.canonicalPlan !== "FREE",
        checkoutReady: Boolean(
          entitlements.canonicalPlan === "PRO" &&
          billingCycle === "monthly" &&
          CARD_ADDON_PRICE_IDS.personalized
        ),
        requestState: personalizedRequest ? "requested" : "idle",
        requestedAt: personalizedRequest?.sendedOn ?? null,
      },
    });
  } catch (error) {
    console.error("[profile/card-qualification]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
