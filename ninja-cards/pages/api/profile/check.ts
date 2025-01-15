import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        const corsHandled = cors(req, res);
        if (corsHandled) return; // If it's a preflight request, stop further execution
    
    
    if (req.method !== "GET") return res.status(405).json({ error: "Методът не е разрешен" });

    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Невалиден потребителски ID" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, password: true }
        });

        if (!user) return res.status(404).json({ error: "Потребителят не съществува" });

        const needsSetup = !user.email || !user.password;
        res.status(200).json({ needsSetup });

    } catch (error) {
        console.error("Грешка при проверка на акаунт:", error);
        res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}
