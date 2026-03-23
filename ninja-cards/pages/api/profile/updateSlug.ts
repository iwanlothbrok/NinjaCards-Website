import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Методът не е разрешен' });
    }

    const { userId, slug } = req.body as { userId: string; slug?: string };

    if (!userId) {
        return res.status(400).json({ message: 'Липсва userId' });
    }

    if (!slug) {
        await prisma.user.update({ where: { id: userId }, data: { slug: null } });
        return res.status(200).json({ message: 'Slug премахнат' });
    }

    const normalized = slug.trim().toLowerCase();

    if (!SLUG_REGEX.test(normalized)) {
        return res.status(400).json({ message: 'Slug може да съдържа само малки букви, цифри и тирета (3-40 символа)' });
    }

    const existing = await prisma.user.findUnique({ where: { slug: normalized }, select: { id: true } });
    if (existing && existing.id !== userId) {
        return res.status(409).json({ message: 'Този slug вече се използва' });
    }

    await prisma.user.update({ where: { id: userId }, data: { slug: normalized } });

    return res.status(200).json({ message: 'Slug запазен успешно', slug: normalized });
}
