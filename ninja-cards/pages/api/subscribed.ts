// File: /pages/api/leads.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';
import { getNextFollowUpAt } from '@/lib/leadFollowUp';
import { sendNewLeadNotificationEmail } from '@/lib/leadNotifications';

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const {
        userId,
        name,
        email,
        phone,
        message,
        isAccepted = true,
        source,
        sourceDetail,
        tapsBeforeLead,
    } = req.body

    if (!userId || !name) {
        return res.status(400).json({ error: 'Missing required fields: userId and name' })
    }

    try {
        const owner = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                firstName: true,
                lastName: true,
                slug: true,
                language: true,
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        });

        if (!owner) {
            return res.status(404).json({ error: 'User not found' });
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
        const userAgent = req.headers['user-agent'] || ''
        const createdAt = new Date();

        try {
            const lead = await prisma.subscribed.create({
                data: {
                    userId,
                    name,
                    email,
                    phone,
                    message,
                    isAccepted,
                    createdAt,
                    source: typeof source === 'string' ? source : 'profile',
                    sourceDetail: typeof sourceDetail === 'string' ? sourceDetail : null,
                    tapsBeforeLead: typeof tapsBeforeLead === 'number' && tapsBeforeLead > 0 ? tapsBeforeLead : 1,
                    ipAddress: Array.isArray(ip) ? ip[0] : ip,
                    userAgent,
                    followUpStage: 0,
                    nextFollowUpAt: getNextFollowUpAt(createdAt, 0),
                },
            });

            try {
                await sendNewLeadNotificationEmail(owner, lead);
            } catch (notificationError) {
                console.error('Failed to send new lead notification:', notificationError);
            }

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
