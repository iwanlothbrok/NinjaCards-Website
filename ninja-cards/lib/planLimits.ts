import { PlanType } from "@prisma/client";
import { getMaxLinksForPlan } from "./planCatalog";

export function canAddNewLink(
    plan: PlanType,
    usedLinks: number
): boolean {
    return usedLinks < getMaxLinksForPlan(plan);
}
