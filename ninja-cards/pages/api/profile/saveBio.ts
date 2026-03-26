// /pages/api/profile/saveBio.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, bio } = req.body as { userId?: string; bio?: string };

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId is required' });
    }

    if (typeof bio !== 'string') {
        return res.status(400).json({ error: 'bio must be a string' });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { bio },
        });

        return res.status(200).json({ message: 'Bio saved successfully' });
    } catch (error: any) {
        console.error('[saveBio]', error);

        if (error?.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(500).json({ error: 'Failed to save bio' });
    }
}