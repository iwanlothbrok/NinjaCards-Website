import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin, toSafeAdminUser } from '@/lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res, ['SUPER_ADMIN', 'OPERATIONS']);
    if (!adminUser) return;

    try {
        const adminUsers = await prisma.adminUser.findMany({
            orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
        });

        return res.status(200).json({
            adminUsers: adminUsers.map(toSafeAdminUser),
        });
    } catch (error) {
        console.error('[admin admin-users] error', error);
        return res.status(500).json({ error: 'Failed to load admin users' });
    }
}
