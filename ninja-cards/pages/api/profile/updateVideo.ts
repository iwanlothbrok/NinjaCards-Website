import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Методът не е разрешен" });
    }

    try {
        const { userId, videoUrl } = req.body;

        if (!userId || !videoUrl) {
            return res.status(400).json({ error: "Необходим е userId и videoUrl" });
        }

        // Save video URL in the user's profile
        await prisma.user.update({
            where: { id: userId },
            data: { videoUrl: videoUrl }, // Save Cloudinary URL
        });

        res.status(200).json({ message: "Видеото беше запазено успешно" });
    } catch (error) {
        console.error("Error updating video URL:", error);
        res.status(500).json({ error: "Възникна грешка при запазването на видеото" });
    }
}
