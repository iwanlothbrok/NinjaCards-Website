import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method === 'GET') {
        try {
            // Fetch the last 3 products, assuming `createdAt` column exists for ordering
            const products = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                take: 3,  // Limit the result to the last 3 products
            });

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
