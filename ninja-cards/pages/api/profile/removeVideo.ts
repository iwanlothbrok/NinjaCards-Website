import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // Handle CORS preflight

    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Грешка: Методът DELETE е единственият разрешен за този крайна точка." });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Грешка: Липсва потребителско ID. Моля, предоставете валидно ID." });
        }

        // Check if the user has a video saved
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Грешка: Потребителят с предоставеното ID не съществува." });
        }

        if (!user.videoUrl) {
            return res.status(404).json({ error: "Грешка: Няма налично видео за премахване за този потребител." });
        }

        // Remove video URL from the database
        await prisma.user.update({
            where: { id: userId },
            data: { videoUrl: null }, // Ensure this matches your Prisma schema
        });

        return res.status(200).json({ success: true, message: "Видеото беше премахнато успешно!" });
    } catch (error) {
        console.error("❌ Грешка при премахването на видеото:", error);
        return res.status(500).json({ error: "Грешка: Възникна проблем при премахването на видеото. Моля, опитайте отново." });
    }
}
