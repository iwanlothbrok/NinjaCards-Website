import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Грешка: Методът не е разрешен. Моля, използвайте POST заявка." });
    }

    try {
        const { userId, videoUrl } = req.body;

        if (!userId || !videoUrl) {
            return res.status(400).json({ error: "Грешка: Липсва информация. Моля, предоставете userId и videoUrl." });
        }

        // Запазване на URL на видеото в профила на потребителя
        await prisma.user.update({
            where: { id: userId },
            data: { videoUrl: videoUrl }, // Запазване на Cloudinary URL
        });

        res.status(200).json({ message: "Успех: Видеото беше запазено успешно." });
    } catch (error) {
        console.error("Грешка при актуализиране на URL на видеото:", error);
        res.status(500).json({ error: "Грешка: Възникна проблем при запазването на видеото. Моля, опитайте отново." });
    }
}
