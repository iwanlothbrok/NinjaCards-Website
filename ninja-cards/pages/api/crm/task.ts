import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

function toDate(value: unknown): Date | null {
    if (typeof value !== 'string' || !value.trim()) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { dealId, title, dueAt, reminderAt } = req.body as {
        dealId?: string;
        title?: string;
        dueAt?: string;
        reminderAt?: string;
    };

    if (!dealId || !title?.trim()) {
        return res.status(400).json({ error: 'Missing dealId or title' });
    }

    try {
        const task = await prisma.cRMTask.create({
            data: {
                dealId,
                title: title.trim(),
                dueAt: toDate(dueAt),
                reminderAt: toDate(reminderAt),
            },
        });

        return res.status(201).json(task);
    } catch (error) {
        console.error('[crm task] POST error', error);
        return res.status(500).json({ error: 'Failed to create task' });
    }
}
