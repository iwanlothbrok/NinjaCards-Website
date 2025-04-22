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
        // Use upsert to ensure the dashboard exists
        const dashboard = await prisma.dashboard.upsert({
            where: { userId },
            update: { socialLinkClicks: { increment: 1 } }, // Increment vcfDownloads
            create: { userId, socialLinkClicks: 1 }, // Create with vcfDownloads initialized to 1
        });

        await prisma.dashboardEvent.create({
            data: {
                userId, type: 'socialClick',
                timestamp: getTime(),
            },
        });


        return res.status(200).json({
            message: 'Social Links incremented successfully',
            dashboard,
        });
    } catch (error) {
        console.error('Error incrementing Social Links count:', error);
        return res.status(500).json({ error: 'Failed to increment Social Links count' });
    }
}
