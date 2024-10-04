import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            const card = await prisma.cardDesign.delete({
                where: {
                    id: Number(id),
                },
            });
            return res.status(200).json({ message: 'Card design deleted successfully', card });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete card design' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
