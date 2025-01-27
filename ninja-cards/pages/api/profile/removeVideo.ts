import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // Stop if it's a preflight request

    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Методът не е разрешен" });
    }

    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "ID на потребителя е задължително" });
        }

        // Check if a video exists for the user
        const existingVideo = await prisma.video.findFirst({
            where: { userId: id },
        });

        if (!existingVideo) {
            return res.status(404).json({ error: "Няма качено видео за този потребител" });
        }

        // Remove video for the user
        await prisma.video.deleteMany({
            where: { userId: id },
        });

        res.status(200).json({ message: "Видеото беше премахнато успешно" });
    } catch (error) {
        console.error("Error removing video:", error);
        res.status(500).json({ error: "Възникна грешка при премахването на видеото" });
    }
}
