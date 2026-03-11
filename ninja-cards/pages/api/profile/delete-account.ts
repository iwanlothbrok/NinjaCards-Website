// /pages/api/user/delete-account.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.body as { userId?: string };

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        // Изтриваме в правилния ред — от деца към родители
        // за да не гърми foreign key constraint-а

        // 1. DashboardEvent (refs Dashboard.userId)
        await prisma.dashboardEvent.deleteMany({ where: { userId } });

        // 2. Dashboard (refs User.id)
        await prisma.dashboard.deleteMany({ where: { userId } });

        // 3. Лийдове / Subscribed (refs User.id)
        await prisma.subscribed.deleteMany({ where: { userId } });

        // 4. Invoices (refs User.id и Subscription.id)
        await prisma.invoice.deleteMany({ where: { userId } });

        // 5. Subscription (refs User.id — @unique, само 1)
        await prisma.subscription.deleteMany({ where: { userId } });

        // 6. Накрая самия User
        await prisma.user.delete({ where: { id: userId } });

        return res.status(200).json({ message: 'Акаунтът е изтрит успешно' });
    } catch (error: any) {
        console.error('[delete-account]', error);

        if (error?.code === 'P2025') {
            return res.status(404).json({ error: 'Потребителят не е намерен' });
        }

        return res.status(500).json({ error: 'Грешка при изтриване на акаунта' });
    }
}