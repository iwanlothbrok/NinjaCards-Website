import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'PUT') {
        const { userId, selectedColor } = req.body;

        if (!userId || !selectedColor) {
            return res.status(400).json({ error: 'User ID and selected color are required' });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: Number(userId) },
                data: { selectedColor },
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update user color' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
