import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const slug = typeof req.query.slug === 'string' ? req.query.slug.trim().toLowerCase() : '';
    const excludeId = typeof req.query.excludeId === 'string' ? req.query.excludeId : undefined;

    if (!SLUG_REGEX.test(slug)) {
        return res.status(200).json({ available: false, reason: 'invalid' });
    }

    const existing = await prisma.user.findUnique({ where: { slug }, select: { id: true } });

    if (existing && existing.id !== excludeId) {
        return res.status(200).json({ available: false, reason: 'taken' });
    }

    return res.status(200).json({ available: true });
}
