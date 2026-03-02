import { PlanType } from "@prisma/client";

export function canAddNewLink(
    plan: PlanType,
    usedLinks: number
): boolean {
    const limits: Record<string, number> = {
        SHINOBI: 3,
        SAMURAI: 20,
        SHOGUN: 999,
    };

    return usedLinks < (limits[plan] ?? 3);
}