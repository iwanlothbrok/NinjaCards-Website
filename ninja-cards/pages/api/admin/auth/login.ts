import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import {
    serializeAdminCookie,
    signAdminToken,
    toSafeAdminUser,
} from '@/lib/adminAuth';
import { AdminStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const adminUser = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });

        if (!adminUser || adminUser.status !== AdminStatus.ACTIVE) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await compare(password, adminUser.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const updatedAdmin = await prisma.adminUser.update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() },
        });

        const token = signAdminToken(updatedAdmin);
        res.setHeader('Set-Cookie', serializeAdminCookie(token));

        return res.status(200).json({ adminUser: toSafeAdminUser(updatedAdmin) });
    } catch (error) {
        console.error('[admin auth login] error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
