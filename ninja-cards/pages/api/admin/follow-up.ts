import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { requireAdmin } from '@/lib/adminAuth';
import { processDueFollowUps } from '@/lib/processDueFollowUps';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const result = await processDueFollowUps({ limit: 12 });
        return res.status(200).json({
            ...result,
            message:
                result.checked === 0
                    ? 'No due follow-ups were found.'
                    : `Processed ${result.checked} due follow-up(s): ${result.sent} sent, ${result.failed} failed.`,
        });
    } catch (error) {
        console.error('[admin follow-up]', error);
        return res.status(500).json({ error: 'Failed to send due follow-ups' });
    }
}
