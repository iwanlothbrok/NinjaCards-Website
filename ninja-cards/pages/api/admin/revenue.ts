import type { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionStatus } from '@prisma/client';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

function startOfDaysAgo(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const days30 = startOfDaysAgo(30);

        const [subscriptions, invoicesAggregate, invoicesAggregate30d, recentInvoices, alerts] = await Promise.all([
            prisma.subscription.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            prisma.invoice.aggregate({ _sum: { amountPaid: true } }),
            prisma.invoice.aggregate({
                _sum: { amountPaid: true },
                where: { createdAt: { gte: days30 } },
            }),
            prisma.invoice.findMany({
                take: 15,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            company: true,
                        },
                    },
                },
            }),
            prisma.subscription.findMany({
                take: 10,
                where: {
                    status: { in: [SubscriptionStatus.past_due, SubscriptionStatus.unpaid, SubscriptionStatus.paused, SubscriptionStatus.cancelled] },
                },
                orderBy: [{ cancel_date: 'desc' }, { end_date: 'asc' }, { start_date: 'desc' }],
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            company: true,
                        },
                    },
                },
            }),
        ]);

        const summary = {
            active: 0,
            trialing: 0,
            past_due: 0,
            unpaid: 0,
            paused: 0,
            cancelled: 0,
        };

        subscriptions.forEach((row) => {
            summary[row.status] = row._count.status;
        });

        return res.status(200).json({
            summary: {
                ...summary,
                totalRevenue: invoicesAggregate._sum.amountPaid ?? 0,
                revenue30d: invoicesAggregate30d._sum.amountPaid ?? 0,
            },
            invoices: recentInvoices.map((invoice) => ({
                id: invoice.id,
                stripeId: invoice.stripeId,
                amountPaid: invoice.amountPaid,
                currency: invoice.currency,
                createdAt: invoice.createdAt.toISOString(),
                hostedInvoiceUrl: invoice.hostedInvoiceUrl,
                userName: invoice.user?.name || 'Unknown user',
                userEmail: invoice.user?.email || '',
                company: invoice.user?.company || '',
            })),
            alerts: alerts.map((subscription) => ({
                id: subscription.id,
                status: subscription.status,
                plan: subscription.plan,
                startDate: subscription.start_date.toISOString(),
                endDate: subscription.end_date?.toISOString() ?? null,
                cancelDate: subscription.cancel_date?.toISOString() ?? null,
                userName: subscription.user?.name || 'Unknown user',
                userEmail: subscription.user?.email || '',
                company: subscription.user?.company || '',
            })),
        });
    } catch (error) {
        console.error('[admin revenue] error', error);
        return res.status(500).json({ error: 'Failed to load revenue data' });
    }
}
