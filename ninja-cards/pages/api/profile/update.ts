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
        const { userId, email, password, confirmPassword, slug } = req.body;

        if (!userId || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Всички полета са задължителни" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Паролите не съвпадат" });
        }

        let existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, password: true },
        });

        if (!existingUser) {
            existingUser = await prisma.user.findUnique({
                where: { slug: userId },
                select: { id: true, email: true, password: true },
            });
        }

        if (!existingUser) {
            return res.status(404).json({ error: "Потребителят не съществува" });
        }

        // Use the real DB id for subsequent operations
        const resolvedId = existingUser.id;

        // Validate and check slug if provided
        const normalizedSlug = slug?.trim().toLowerCase() || null;
        if (normalizedSlug) {
            if (!/^[a-z0-9-]{3,40}$/.test(normalizedSlug)) {
                return res.status(400).json({ error: "Невалиден slug формат" });
            }
            const slugTaken = await prisma.user.findUnique({
                where: { slug: normalizedSlug },
                select: { id: true },
            });
            if (slugTaken && slugTaken.id !== resolvedId) {
                return res.status(409).json({ error: "Slug вече се използва" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: resolvedId },
            data: {
                email,
                password: hashedPassword,
                ...(normalizedSlug ? { slug: normalizedSlug } : {}),
            },
        });

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Грешка при обновяване на акаунта:", error);
        return res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}
