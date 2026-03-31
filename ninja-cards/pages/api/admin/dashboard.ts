import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMStage, SubscriptionStatus } from '@prisma/client';
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
        const now = new Date();
        const days7 = startOfDaysAgo(7);
        const days30 = startOfDaysAgo(30);

        const [
            totalUsers,
            newUsers7d,
            newUsers30d,
            totalLeads,
            activeSubscriptions,
            paidInvoicesAggregate,
            recentRevenueAggregate,
            visitsAggregate,
            meetingsCount,
            wonDealsCount,
            wonDealsAggregate,
            followUpQueue,
            topDashboards,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: days7 } } }),
            prisma.user.count({ where: { createdAt: { gte: days30 } } }),
            prisma.subscribed.count(),
            prisma.subscription.count({
                where: { status: { in: [SubscriptionStatus.active, SubscriptionStatus.trialing] } },
            }),
            prisma.invoice.aggregate({ _sum: { amountPaid: true } }),
            prisma.invoice.aggregate({
                _sum: { amountPaid: true },
                where: { createdAt: { gte: days30 } },
            }),
            prisma.dashboard.aggregate({
                _sum: {
                    profileVisits: true,
                    profileShares: true,
                    vcfDownloads: true,
                    socialLinkClicks: true,
                },
            }),
            prisma.cRMDeal.count({
                where: {
                    OR: [{ stage: CRMStage.MEETING }, { stage: CRMStage.WON }, { meetingAt: { not: null } }],
                },
            }),
            prisma.cRMDeal.count({ where: { stage: CRMStage.WON } }),
            prisma.cRMDeal.aggregate({
                _sum: { value: true },
                where: { stage: CRMStage.WON },
            }),
            prisma.subscribed.count({
                where: {
                    followUpStopped: false,
                    nextFollowUpAt: { lte: now },
                },
            }),
            prisma.dashboard.findMany({
                take: 5,
                orderBy: [{ profileVisits: 'desc' }, { profileShares: 'desc' }],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            company: true,
                        },
                    },
                },
            }),
        ]);

        const totalVisits = visitsAggregate._sum.profileVisits ?? 0;
        const totalShares = visitsAggregate._sum.profileShares ?? 0;
        const totalDownloads = visitsAggregate._sum.vcfDownloads ?? 0;
        const totalSocialClicks = visitsAggregate._sum.socialLinkClicks ?? 0;

        return res.status(200).json({
            adminUser: {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
            },
            overview: {
                totalUsers,
                newUsers7d,
                newUsers30d,
                activeSubscriptions,
                totalLeads,
                totalRevenue: paidInvoicesAggregate._sum.amountPaid ?? 0,
                revenue30d: recentRevenueAggregate._sum.amountPaid ?? 0,
                followUpQueue,
            },
            funnel: {
                visits: totalVisits,
                leads: totalLeads,
                meetings: meetingsCount,
                wonDeals: wonDealsCount,
                wonDealValue: wonDealsAggregate._sum.value ?? 0,
            },
            engagement: {
                totalVisits,
                totalShares,
                totalDownloads,
                totalSocialClicks,
            },
            topUsers: topDashboards.map((item) => ({
                id: item.userId,
                name: item.user?.name || 'Unnamed user',
                email: item.user?.email || '',
                company: item.user?.company || '',
                profileVisits: item.profileVisits,
                profileShares: item.profileShares,
                vcfDownloads: item.vcfDownloads,
                socialLinkClicks: item.socialLinkClicks,
            })),
        });
    } catch (error) {
        console.error('[admin dashboard] error', error);
        return res.status(500).json({ error: 'Failed to load dashboard data' });
    }
}
