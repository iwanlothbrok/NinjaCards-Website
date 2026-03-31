import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { getAdminUserFromRequest, toSafeAdminUser } from '@/lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await getAdminUserFromRequest(req);
    if (!adminUser) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ adminUser: toSafeAdminUser(adminUser) });
}
