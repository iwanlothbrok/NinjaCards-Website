
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        method,
    } = req;
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it'

    if (method !== 'GET') {
        return res.status(405).json({ error: 'Методът не е разрешен' });
    }

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Липсващ или невалиден ID' });
    }

    try {
        // Perform DB query
        const data = await prisma.subscribed.findMany({ where: { userId: id } });

        return res.status(200).json({ success: true, leads: data }); // Replace with real data
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Вътрешна грешка на сървъра' });
    }
}
