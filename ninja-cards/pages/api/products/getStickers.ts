import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method === 'GET') {
        try {
            const stickers = await prisma.product.findMany({
                where: {
                    type: 'stickers',
                },
            });
            res.status(200).json(stickers);
        } catch (error) {
            console.error('Error fetching stickers:', error);
            res.status(500).json({ error: 'Error fetching stickers' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
