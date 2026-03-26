import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { dealId, body } = req.body as { dealId?: string; body?: string };
    if (!dealId || !body?.trim()) {
        return res.status(400).json({ error: 'Missing dealId or note body' });
    }

    try {
        const note = await prisma.cRMNote.create({
            data: {
                dealId,
                body: body.trim(),
            },
        });

        return res.status(201).json(note);
    } catch (error) {
        console.error('[crm note] POST error', error);
        return res.status(500).json({ error: 'Failed to create note' });
    }
}
