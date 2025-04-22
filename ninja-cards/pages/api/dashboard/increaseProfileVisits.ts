import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';
import { getTime } from '@/utils/bgTime';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const dashboard = await prisma.dashboard.upsert({
            where: { userId },
            update: { profileVisits: { increment: 1 } },
            create: { userId, profileVisits: 1 },
        });

        await prisma.dashboardEvent.create({
            data: {
                userId,
                type: 'visit',
                timestamp: getTime(),
            },
        });

        return res.status(200).json({ message: 'Visit tracked', dashboard });
    } catch (error) {
        console.error('Error incrementing profile visits:', error);
        return res.status(500).json({ error: 'Failed to increment profile visits' });
    }
}
