import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    // Extract `id` from query and ensure it's a string
    const { id } = req.query;
    const userId = Array.isArray(id) ? id[0] : id; // If `id` is an array, take the first element

    if (!userId) {
        return res.status(400).json({ message: 'Необходим е ключ на потребителя' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Методът не е разрешен' });
    }

    try {
        // Query the user by UUID
        const user = await prisma.user.findUnique({
            where: {
                id: userId, // Now `userId` is safely a string
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Потребителят не е намерен' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Вътрешна грешка в сървъра' });
    }
}
