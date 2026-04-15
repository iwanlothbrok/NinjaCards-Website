import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { requireAdmin } from '@/lib/adminAuth';
import { processWeeklyDigest } from '@/lib/processWeeklyDigest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const result = await processWeeklyDigest({ limit: 100 });
        return res.status(200).json({
            ...result,
            message:
                result.sent === 0
                    ? 'No active users were found for the last 2 weeks.'
                    : `Sent ${result.sent} analytics email(s) for ${result.periodLabel}.`,
        });
    } catch (error) {
        console.error('[admin weekly-digest]', error);
        return res.status(500).json({ error: 'Failed to send biweekly analytics emails' });
    }
}
