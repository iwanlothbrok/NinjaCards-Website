export type CanonicalPlanId = "FREE" | "PRO" | "TEAMS" | "ENTERPRISE";
export type LegacyPlanId = "SHINOBI" | "SAMURAI" | "SHOGUN";
export type AnyPlanId = CanonicalPlanId | LegacyPlanId | string | null | undefined;

export type BillingCycle = "monthly" | "quarterly" | "annual";

type CanonicalPlanMeta = {
  id: CanonicalPlanId;
  label: string;
  shortLabel: string;
  maxLinks: number;
  storedLeadsPerMonth: number | null;
  hasAnalytics: boolean;
  hasBranding: boolean;
  hasTeamFeatures: boolean;
};

const CANONICAL_PLANS: Record<CanonicalPlanId, CanonicalPlanMeta> = {
  FREE: {
    id: "FREE",
    label: "Free",
    shortLabel: "Free",
    maxLinks: 3,
    storedLeadsPerMonth: 1,
    hasAnalytics: false,
    hasBranding: false,
    hasTeamFeatures: false,
  },
  PRO: {
    id: "PRO",
    label: "Pro",
    shortLabel: "Pro",
    maxLinks: 20,
    storedLeadsPerMonth: 10,
    hasAnalytics: true,
    hasBranding: true,
    hasTeamFeatures: false,
  },
  TEAMS: {
    id: "TEAMS",
    label: "Teams",
    shortLabel: "Teams",
    maxLinks: 999,
    storedLeadsPerMonth: null,
    hasAnalytics: true,
    hasBranding: true,
    hasTeamFeatures: true,
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    label: "Enterprise / Bulk",
    shortLabel: "Enterprise",
    maxLinks: 999,
    storedLeadsPerMonth: null,
    hasAnalytics: true,
    hasBranding: true,
    hasTeamFeatures: true,
  },
};

const LEGACY_TO_CANONICAL: Record<LegacyPlanId, CanonicalPlanId> = {
  SHINOBI: "FREE",
  SAMURAI: "PRO",
  SHOGUN: "TEAMS",
};

const CANONICAL_TO_LEGACY: Record<Exclude<CanonicalPlanId, "ENTERPRISE">, LegacyPlanId> = {
  FREE: "SHINOBI",
  PRO: "SAMURAI",
  TEAMS: "SHOGUN",
};

export function getCanonicalPlanId(plan: AnyPlanId): CanonicalPlanId {
  if (!plan) return "FREE";

  const normalized = String(plan).toUpperCase();
  if (normalized in CANONICAL_PLANS) {
    return normalized as CanonicalPlanId;
  }

  if (normalized in LEGACY_TO_CANONICAL) {
    return LEGACY_TO_CANONICAL[normalized as LegacyPlanId];
  }

  return "FREE";
}

export function getCanonicalPlanMeta(plan: AnyPlanId): CanonicalPlanMeta {
  return CANONICAL_PLANS[getCanonicalPlanId(plan)];
}

export function getLegacyPlanId(plan: AnyPlanId): LegacyPlanId {
  const canonicalPlan = getCanonicalPlanId(plan);
  if (canonicalPlan === "ENTERPRISE") return "SHOGUN";
  return CANONICAL_TO_LEGACY[canonicalPlan];
}

export function getPlanDisplayName(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).label;
}

export function getPlanShortLabel(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).shortLabel;
}

export function getMaxLinksForPlan(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).maxLinks;
}

export function hasAnalyticsAccess(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).hasAnalytics;
}

export function hasBrandingAccess(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).hasBranding;
}

export function hasTeamFeatures(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).hasTeamFeatures;
}

export function getStoredLeadLimit(plan: AnyPlanId) {
  return getCanonicalPlanMeta(plan).storedLeadsPerMonth;
}

export const SALES_PRICE_IDS: Record<Exclude<CanonicalPlanId, "FREE" | "ENTERPRISE">, Partial<Record<BillingCycle, string>>> = {
  PRO: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    quarterly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY,
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL,
  },
  TEAMS: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAMS_MONTHLY,
    quarterly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAMS_QUARTERLY,
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAMS_ANNUAL,
  },
};

export const CARD_ADDON_PRICE_IDS = {
  personalized: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONALIZED_CARD ?? process.env.STRIPE_PRICE_PERSONALIZED_CARD,
  shipping: process.env.NEXT_PUBLIC_STRIPE_PRICE_CARD_SHIPPING ?? process.env.STRIPE_PRICE_CARD_SHIPPING,
} as const;

const LEGACY_PRICE_IDS: Partial<Record<LegacyPlanId, string | undefined>> = {
  SHINOBI: process.env.STRIPE_PRICE_SHINOBI,
  SAMURAI: process.env.STRIPE_PRICE_SAMURAI,
  SHOGUN: process.env.STRIPE_PRICE_SHOGUN,
};

export function getCanonicalPlanFromStripePriceId(priceId?: string | null): CanonicalPlanId {
  if (!priceId) return "FREE";

  for (const [canonicalPlan, cycles] of Object.entries(SALES_PRICE_IDS) as Array<
    [Exclude<CanonicalPlanId, "FREE" | "ENTERPRISE">, Partial<Record<BillingCycle, string>>]
  >) {
    if (Object.values(cycles).some((cyclePriceId) => cyclePriceId === priceId)) {
      return canonicalPlan;
    }
  }

  for (const [legacyPlan, legacyPriceId] of Object.entries(LEGACY_PRICE_IDS) as Array<[LegacyPlanId, string | undefined]>) {
    if (legacyPriceId && legacyPriceId === priceId) {
      return LEGACY_TO_CANONICAL[legacyPlan];
    }
  }

  return "FREE";
}

export function mapStripePriceIdToLegacyPlan(priceId?: string | null): LegacyPlanId {
  return getLegacyPlanId(getCanonicalPlanFromStripePriceId(priceId));
}

export function getBillingCycleFromStripePriceId(priceId?: string | null): BillingCycle | null {
  if (!priceId) return null;

  for (const cycles of Object.values(SALES_PRICE_IDS)) {
    for (const [billingCycle, mappedPriceId] of Object.entries(cycles) as Array<[BillingCycle, string | undefined]>) {
      if (mappedPriceId === priceId) {
        return billingCycle;
      }
    }
  }

  return null;
}
