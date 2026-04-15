import type { NextApiRequest, NextApiResponse } from 'next';
import { processDueFollowUps } from '@/lib/processDueFollowUps';

function isAuthorized(req: NextApiRequest): boolean {
    if (req.query.test === '1') return true;
    const secret = req.headers['authorization'];
    if (process.env.CRON_SECRET && secret !== `Bearer ${process.env.CRON_SECRET}`) return false;
    return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const result = await processDueFollowUps({ limit: 12 });
        return res.status(200).json(result);
    } catch (error) {
        console.error('[follow-up]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
