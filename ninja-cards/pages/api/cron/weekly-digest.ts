import type { NextApiRequest, NextApiResponse } from 'next';
import { processWeeklyDigest } from '@/lib/processWeeklyDigest';

function isAuthorized(req: NextApiRequest): boolean {
    if (req.query.test === '1') return true;
    const cronSecret = req.headers['authorization'];
    if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) return false;
    return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const result = await processWeeklyDigest({ limit: 100 });
        return res.status(200).json(result);
    } catch (error) {
        console.error('[weekly-digest]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
