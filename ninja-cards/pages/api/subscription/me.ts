// POST /api/subscription/me
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSubscription } from "@/lib/billing";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

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

        return res.status(200).json({
            userId,
            email: user?.email ?? null,
            subscription: sub,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
