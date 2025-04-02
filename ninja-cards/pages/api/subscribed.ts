// File: /pages/api/leads.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { userId, name, email, phone, message, isAccepted = true } = req.body

    if (!userId || !name) {
        return res.status(400).json({ error: 'Missing required fields: userId and name' })
    }

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
        const userAgent = req.headers['user-agent'] || ''

        try {
            const lead = await prisma.subscribed.create({
                data: {
                    userId,
                    name,
                    email,
                    phone,
                    message,
                    isAccepted,
                    ipAddress: Array.isArray(ip) ? ip[0] : ip,
                    userAgent,
                },
            });
            return res.status(200).json({ success: true, lead });
        } catch (prismaError) {
            console.error('Failed to create lead in Prisma:', prismaError);
            return res.status(500).json({ error: 'Вътрешна грешка в сървъра: Неуспешно създаване на запис.' });
        }
    } catch (error) {
        console.error('Failed to store lead:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}