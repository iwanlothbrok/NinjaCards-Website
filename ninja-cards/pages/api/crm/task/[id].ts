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

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing task id' });
    }

    if (req.method === 'PATCH') {
        const { completed, title, dueAt, reminderAt } = req.body as {
            completed?: boolean;
            title?: string;
            dueAt?: string | null;
            reminderAt?: string | null;
        };

        try {
            const updated = await prisma.cRMTask.update({
                where: { id },
                data: {
                    ...(typeof completed === 'boolean' ? { completed } : {}),
                    ...(typeof title === 'string' ? { title: title.trim() || undefined } : {}),
                    ...(typeof dueAt === 'string' ? { dueAt: toDate(dueAt) } : {}),
                    ...(dueAt === null ? { dueAt: null } : {}),
                    ...(typeof reminderAt === 'string' ? { reminderAt: toDate(reminderAt) } : {}),
                    ...(reminderAt === null ? { reminderAt: null } : {}),
                },
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error('[crm task] PATCH error', error);
            return res.status(500).json({ error: 'Failed to update task' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.cRMTask.delete({ where: { id } });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[crm task] DELETE error', error);
            return res.status(500).json({ error: 'Failed to delete task' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
