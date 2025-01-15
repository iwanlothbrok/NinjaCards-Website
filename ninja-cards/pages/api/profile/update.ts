import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        const corsHandled = cors(req, res);
        if (corsHandled) return; // If it's a preflight request, stop further execution
    
    if (req.method !== "PUT") return res.status(405).json({ error: "Методът не е разрешен" });

    try {
        const { userId, email, password, confirmPassword } = req.body;

        if (!userId || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Всички полета са задължителни" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Паролите не съвпадат" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, password: true },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Потребителят не съществува" });
        }

        if (existingUser.email || existingUser.password) {
            return res.status(403).json({ error: "Акаунтът вече има зададени имейл и парола" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, password: hashedPassword },
        });

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Грешка при обновяване на акаунта:", error);
        return res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}
