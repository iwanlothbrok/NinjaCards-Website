import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'User ID and selected color are required' });
        }

        try {

            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
                data: { image: null },
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error removing user image:', error);
            res.status(500).json({ error: 'Failed to remove user image' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
