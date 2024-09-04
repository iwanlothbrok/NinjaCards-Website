// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    const { limit = 1, sort = 'desc' } = req.query;

    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: sort === 'desc' ? 'desc' : 'asc',
            },
            take: Number(limit),
        });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    } finally {
        await prisma.$disconnect();
    }
}
