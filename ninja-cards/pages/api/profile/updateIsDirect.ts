import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Методът не е разрешен.' });
    }

    try {
        const { userId, isDirect } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'ID на потребителя е задължително.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isDirect },
        });

        res.status(200).json({ message: 'Настройката е успешно актуализирана.', user: updatedUser });
    } catch (error: any) {
        console.error('Грешка при актуализиране на настройката:', error);
        res.status(500).json({ error: 'Неуспешно актуализиране на настройката.', details: error.message });
    }
}
