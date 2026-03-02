export const PLAN_LIMITS = {
    SHINOBI: {
        maxLinks: 3,
        analytics: false,
        leadForm: false,
        branding: false,
        team: false,
    },
    SAMURAI: {
        maxLinks: 20,
        analytics: true,
        leadForm: true,
        branding: true,
        team: false,
    },
    SHOGUN: {
        maxLinks: 999,
        analytics: true,
        leadForm: true,
        branding: true,
        team: true,
    },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
