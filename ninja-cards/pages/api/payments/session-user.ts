// pages/api/payments/session-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       await cors(req, res); // Call it without returning prematurely
   
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
    if (!sessionId.startsWith("cs_")) return res.status(400).json({ error: "Missing/invalid session_id" });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // 1) ако е логнат – имаме userId в metadata
        const metaUserId = session.metadata?.userId?.trim();
        if (metaUserId) return res.status(200).json({ userId: metaUserId });

        // 2) guest – намираме по email (най-лесно)
        const email =
            session.customer_email ??
            (session.customer_details as any)?.email ??
            null;

        if (email) {
            const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
            if (user) return res.status(200).json({ userId: user.id });
        }

        // 3) fallback: по Stripe customer id (ако пазиш stripe_user_id в subscription)
        const customerId = (session.customer as string) ?? null;
        if (customerId) {
            const sub = await prisma.subscription.findFirst({ where: { stripe_user_id: customerId } });
            if (sub?.userId) return res.status(200).json({ userId: sub.userId });
        }

        return res.status(404).json({ error: "User not found for this session" });
    } catch (e: any) {
        return res.status(500).json({ error: e?.message ?? "Failed" });
    }
}
