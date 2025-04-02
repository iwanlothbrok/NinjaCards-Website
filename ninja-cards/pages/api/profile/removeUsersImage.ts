import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'DELETE') {
        const { id } = req.query;

        // Check if `id` is provided and if it's a string or array, ensure it's a string
        const userId = Array.isArray(id) ? id[0] : id;

        if (!userId) {
            return res.status(400).json({ error: 'Не е предоставен потребителски идентификатор' });
        }

        try {
            await prisma.user.update({
                where: { id: userId }, // Ensure `userId` is a string
                data: { image: null },
            });

            const updatedUser = await prisma.user.findUnique({
                where: { id: userId },
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Грешка при премахване на изображението на потребителя:', error);
            res.status(500).json({ error: 'Неуспешно премахване на изображението на потребителя' });
        }
    } else {
        res.status(405).json({ error: 'Методът не е разрешен' });
    }
}
