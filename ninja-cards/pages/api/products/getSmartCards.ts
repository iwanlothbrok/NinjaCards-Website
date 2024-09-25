import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method === 'GET') {
        try {
            const smartCards = await prisma.product.findMany({
                where: {
                    type: 'cards',
                },
            });
            res.status(200).json(smartCards);
        } catch (error) {
            console.error('Error fetching smart cards:', error);
            res.status(500).json({ error: 'Error fetching smart cards' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
