// File: /pages/api/dashboard/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const dashboard = await prisma.dashboard.findUnique({
                where: { userId: id as string },
                select: {
                    profileVisits: true,
                    vcfDownloads: true,
                    profileShares: true,
                    socialLinkClicks: true,
                },
            });

            if (!dashboard) return res.status(404).json({ error: "Dashboard not found" });

            res.status(200).json(dashboard);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
