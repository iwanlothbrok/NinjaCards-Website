import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMStage, PrismaClient } from '@prisma/client';
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
        return res.status(400).json({ error: 'Missing deal id' });
    }

    if (req.method === 'PATCH') {
        const { title, stage, value, nextReminderAt } = req.body as {
            title?: string;
            stage?: CRMStage;
            value?: number | null;
            nextReminderAt?: string | null;
        };

        try {
            const current = await prisma.cRMDeal.findUnique({ where: { id } });
            if (!current) return res.status(404).json({ error: 'Deal not found' });

            const now = new Date();
            const data: Record<string, unknown> = {};

            if (typeof title === 'string') data.title = title.trim() || current.title;
            if (typeof value === 'number') data.value = value;
            if (value === null) data.value = null;
            if (typeof nextReminderAt === 'string') data.nextReminderAt = toDate(nextReminderAt);
            if (nextReminderAt === null) data.nextReminderAt = null;

            if (stage && Object.values(CRMStage).includes(stage)) {
                data.stage = stage;
                if (stage === CRMStage.CONTACTED && !current.contactedAt) data.contactedAt = now;
                if (stage === CRMStage.MEETING && !current.meetingAt) data.meetingAt = now;
                if ((stage === CRMStage.WON || stage === CRMStage.LOST) && !current.closedAt) data.closedAt = now;
            }

            const updated = await prisma.cRMDeal.update({
                where: { id },
                data,
                include: {
                    lead: true,
                    notes: { orderBy: { createdAt: 'desc' } },
                    tasks: { orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }] },
                },
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error('[crm deal] PATCH error', error);
            return res.status(500).json({ error: 'Failed to update deal' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.cRMDeal.delete({ where: { id } });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[crm deal] DELETE error', error);
            return res.status(500).json({ error: 'Failed to delete deal' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
