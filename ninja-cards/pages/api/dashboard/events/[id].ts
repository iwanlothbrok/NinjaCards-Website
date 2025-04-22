import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    const {
        query: { id },
    } = req;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const now = new Date();
        const results = [];

        for (let i = 5; i >= 0; i--) {
            const monthStart = startOfMonth(subMonths(now, i));
            const monthEnd = endOfMonth(subMonths(now, i));

            const events = await prisma.dashboardEvent.findMany({
                where: {
                    userId: id,
                    timestamp: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
            });

            const counts = {
                visit: 0,
                download: 0,
                share: 0,
                socialClick: 0,
            };

            for (const e of events) {
                if (e.type in counts) counts[e.type as keyof typeof counts]++;
            }

            results.push({
                date: monthStart,
                visit: counts.visit,
                download: counts.download,
                share: counts.share,
                socialClick: counts.socialClick,
            });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Failed to fetch event history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
