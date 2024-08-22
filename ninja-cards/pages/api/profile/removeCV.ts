import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'User ID and selected color are required' });
        }

        try {

            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
                data: { cv: null },
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error removing users CV:', error);
            res.status(500).json({ error: 'Failed to remove users CV' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
