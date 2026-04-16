// POST /api/subscription/me
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSubscription } from "@/lib/billing";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";
import { getPlanEntitlements, getLeadUsageSnapshot } from "@/lib/entitlements";
import Stripe from "stripe";
import { getBillingCycleFromStripePriceId } from "@/lib/planCatalog";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       await cors(req, res); // Call it without returning prematurely
   
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { userId } = req.body || {};
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const sub = await getUserSubscription(userId);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        const entitlements = getPlanEntitlements(sub?.plan);
        const leadUsage = await getLeadUsageSnapshot(prisma, userId, sub?.plan);
        let billingCycle: "monthly" | "quarterly" | "annual" | null = null;

        if (sub?.subscription_id) {
            try {
                const stripeSub = await stripe.subscriptions.retrieve(sub.subscription_id);
                const priceId = stripeSub.items?.data?.[0]?.price?.id ?? null;
                billingCycle = getBillingCycleFromStripePriceId(priceId);
            } catch (stripeError) {
                console.error("[subscription/me] failed to resolve billing cycle", stripeError);
            }
        }

        return res.status(200).json({
            userId,
            email: user?.email ?? null,
            subscription: sub,
            canonicalPlan: entitlements.canonicalPlan,
            entitlements,
            leadUsage,
            billingCycle,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
