// File: /pages/api/subscribed/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cors from '@/utils/cors';

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        method,
    } = req
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it'

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Липсващ или невалиден ID' })
    }

    if (method === 'DELETE') {
        try {
            await prisma.subscribed.delete({
                where: { id },
            })
            return res.status(200).json({ success: true })
        } catch (error) {
            console.error('Грешка при изтриване:', error)
            return res.status(500).json({ error: 'Вътрешна грешка при изтриване' })
        }
    }

    return res.status(405).json({ error: 'Методът не е разрешен' })
}