import type { PrismaClient } from "@prisma/client";

import {
  AnyPlanId,
  getCanonicalPlanId,
  getStoredLeadLimit,
  hasAnalyticsAccess,
  hasBrandingAccess,
  hasTeamFeatures,
} from "@/lib/planCatalog";
import { calculateProfileScore } from "@/lib/profileScore";

export type CardEligibilityState =
  | "ineligible"
  | "eligible"
  | "shipping_unpaid"
  | "requested"
  | "fulfilled";

export function getPlanEntitlements(plan: AnyPlanId) {
  const canonicalPlan = getCanonicalPlanId(plan);

  return {
    canonicalPlan,
    storedLeadLimit: getStoredLeadLimit(plan),
    canExportLeads: canonicalPlan !== "FREE",
    canUseAiTools: canonicalPlan !== "FREE",
    canRemoveBranding: hasBrandingAccess(plan),
    hasAdvancedAnalytics: hasAnalyticsAccess(plan),
    hasTeamFeatures: hasTeamFeatures(plan),
    supportsMonthlyPersonalizedCardAddon: canonicalPlan === "PRO",
    includesAnnualPersonalizedCard: canonicalPlan === "PRO",
  };
}

export async function getCurrentMonthStoredLeadCount(prisma: PrismaClient, userId: string) {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));

  return prisma.subscribed.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });
}

export async function getLeadUsageSnapshot(prisma: PrismaClient, userId: string, plan: AnyPlanId) {
  const canonicalPlan = getCanonicalPlanId(plan);
  const storedLeadLimit = getStoredLeadLimit(plan);
  const currentMonthLeadCount = await getCurrentMonthStoredLeadCount(prisma, userId);

  return {
    canonicalPlan,
    storedLeadLimit,
    currentMonthLeadCount,
    canStoreAnotherLead:
      storedLeadLimit === null ? true : currentMonthLeadCount < storedLeadLimit,
  };
}

export function getGenericCardQualification(params: {
  profile: Record<string, any>;
  email?: string | null;
  hasShippingPayment?: boolean;
  hasExistingRequest?: boolean;
  isFulfilled?: boolean;
}) {
  const { score, completionPct, missing } = calculateProfileScore(params.profile);
  const hasVerifiedEmail = Boolean(params.email);
  const qualifiesByScore = score > 50;

  let state: CardEligibilityState = "ineligible";
  if (params.isFulfilled) state = "fulfilled";
  else if (params.hasExistingRequest) state = "requested";
  else if (qualifiesByScore && hasVerifiedEmail && params.hasShippingPayment) state = "eligible";
  else if (qualifiesByScore && hasVerifiedEmail) state = "shipping_unpaid";

  const blockers = [
    ...(qualifiesByScore ? [] : ["Raise your profile score above 50"]),
    ...(hasVerifiedEmail ? [] : ["Verify your email"]),
    ...(params.hasShippingPayment || !qualifiesByScore || !hasVerifiedEmail ? [] : ["Pay shipping"]),
  ];

  return {
    score,
    completionPct,
    missing,
    hasVerifiedEmail,
    qualifiesByScore,
    genericCardEligible: state === "eligible",
    state,
    blockers,
  };
}
