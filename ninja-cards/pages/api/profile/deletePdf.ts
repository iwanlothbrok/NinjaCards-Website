import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Методът не е разрешен' });
    }

    try {
        // Extract the `id` from the request body
        const { id } = req.body;
        console.log(id);

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Необходим е идентификатор на потребителя' });
        }

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id },
            select: { pdf: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'Потребителят не е намерен' });
        }

        if (!user.pdf) {
            return res.status(404).json({ error: 'Не е намерен PDF за този потребител' });
        }

        // Update the user's record and remove the PDF
        await prisma.user.update({
            where: { id },
            data: { pdf: null },
        });

        return res.status(200).json({ message: 'PDF успешно изтрит' });
    } catch (error) {
        console.error('Грешка при изтриване на PDF:', error);
        return res.status(500).json({ error: 'Неуспешно изтриване на PDF' });
    }
}
