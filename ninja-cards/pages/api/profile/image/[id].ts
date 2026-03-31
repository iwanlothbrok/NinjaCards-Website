import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) {
        return res.status(400).end('Missing id');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { image: true },
        });

        if (!user?.image) {
            return res.status(404).end('Image not found');
        }

        let contentType = 'image/jpeg';
        let base64 = user.image;

        if (user.image.startsWith('data:')) {
            const match = user.image.match(/^data:(.+?);base64,(.+)$/);
            if (!match) {
                return res.status(400).end('Invalid image');
            }
            contentType = match[1] || contentType;
            base64 = match[2];
        }

        const buffer = Buffer.from(base64, 'base64');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
        return res.status(200).send(buffer);
    } catch (error) {
        console.error('[profile image] failed to serve image', error);
        return res.status(500).end('Server error');
    }
}
