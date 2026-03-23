import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Методът не е разрешен' });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
        return res.status(401).json({ message: 'Неоторизиран' });
    }

    const { slug } = req.body as { slug: string };

    if (!slug) {
        // Allow clearing the slug
        await prisma.user.update({ where: { id: token.sub }, data: { slug: null } });
        return res.status(200).json({ message: 'Slug премахнат' });
    }

    const normalized = slug.trim().toLowerCase();

    if (!SLUG_REGEX.test(normalized)) {
        return res.status(400).json({ message: 'Slug може да съдържа само малки букви, цифри и тирета (3-40 символа)' });
    }

    // Check if taken by another user
    const existing = await prisma.user.findUnique({ where: { slug: normalized } });
    if (existing && existing.id !== token.sub) {
        return res.status(409).json({ message: 'Този slug вече се използва' });
    }

    await prisma.user.update({ where: { id: token.sub }, data: { slug: normalized } });

    return res.status(200).json({ message: 'Slug запазен успешно', slug: normalized });
}
