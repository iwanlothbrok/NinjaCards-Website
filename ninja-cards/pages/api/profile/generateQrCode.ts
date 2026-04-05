import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";
import QRCode from 'qrcode';
import { buildPublicProfileUrl } from "@/utils/constants";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Грешка: Методът не е разрешен. Моля, използвайте POST заявка." });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Грешка: Липсва информация. Моля, предоставете userId." });
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { slug: true } });

        const qrCodeUrl = buildPublicProfileUrl({
            locale: "bg",
            slug: existingUser?.slug ?? undefined,
            userId,
        });

        // Generate the QR code from the URL
        const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

        // Update user with the QR code image
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { qrCode: qrCodeImage },
        });

        res.status(200).json({ message: "Успех: Видеото беше запазено успешно.", user: updatedUser });
    } catch (error) {
        console.error("Грешка при актуализиране на URL на видеото:", error);
        res.status(500).json({ error: "Грешка: Възникна проблем при запазването на видеото. Моля, опитайте отново." });
    }
}
