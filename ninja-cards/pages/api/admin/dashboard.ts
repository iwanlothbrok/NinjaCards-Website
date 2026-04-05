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
            recentCardEvents,
            recentUsers,
            subscriptionAlerts,
            followUpLeads,
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
            prisma.dashboardEvent.findMany({
                take: 10,
                distinct: ['userId'],
                orderBy: { timestamp: 'desc' },
                include: {
                    dashboard: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    company: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    subscription: {
                                        select: {
                                            plan: true,
                                            status: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            prisma.user.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: {
                    dashboard: {
                        select: {
                            profileVisits: true,
                            profileShares: true,
                            vcfDownloads: true,
                        },
                    },
                    subscription: {
                        select: {
                            plan: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma.subscription.findMany({
                take: 8,
                where: {
                    status: {
                        in: [SubscriptionStatus.past_due, SubscriptionStatus.unpaid, SubscriptionStatus.paused, SubscriptionStatus.cancelled],
                    },
                },
                orderBy: [{ cancel_date: 'desc' }, { end_date: 'asc' }, { start_date: 'desc' }],
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
            prisma.subscribed.findMany({
                take: 8,
                where: {
                    followUpStopped: false,
                    nextFollowUpAt: { lte: now },
                },
                orderBy: { nextFollowUpAt: 'asc' },
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
        const atRiskSubscriptions = subscriptionAlerts.length;
        const visitToLeadRate = totalVisits > 0 ? Number(((totalLeads / totalVisits) * 100).toFixed(1)) : 0;

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
                atRiskSubscriptions,
                visitToLeadRate,
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
            recentCardActivity: recentCardEvents.map((item) => ({
                userId: item.userId,
                type: item.type,
                timestamp: item.timestamp.toISOString(),
                name: item.dashboard.user?.name || 'Unnamed user',
                email: item.dashboard.user?.email || '',
                company: item.dashboard.user?.company || '',
                joinedAt: item.dashboard.user?.createdAt?.toISOString() ?? null,
                plan: item.dashboard.user?.subscription?.plan || 'No plan',
                subscriptionStatus: item.dashboard.user?.subscription?.status || 'none',
                profileVisits: item.dashboard.profileVisits,
                profileShares: item.dashboard.profileShares,
                vcfDownloads: item.dashboard.vcfDownloads,
                socialLinkClicks: item.dashboard.socialLinkClicks,
            })),
            recentUsers: recentUsers.map((user) => ({
                id: user.id,
                name: user.name || 'Unnamed user',
                email: user.email || '',
                company: user.company || '',
                joinedAt: user.createdAt.toISOString(),
                plan: user.subscription?.plan || 'No plan',
                subscriptionStatus: user.subscription?.status || 'none',
                profileVisits: user.dashboard?.profileVisits ?? 0,
                profileShares: user.dashboard?.profileShares ?? 0,
                vcfDownloads: user.dashboard?.vcfDownloads ?? 0,
            })),
            subscriptionAlerts: subscriptionAlerts.map((subscription) => ({
                id: subscription.id,
                userId: subscription.userId,
                name: subscription.user?.name || 'Unknown user',
                email: subscription.user?.email || '',
                company: subscription.user?.company || '',
                plan: subscription.plan,
                status: subscription.status,
                startDate: subscription.start_date.toISOString(),
                endDate: subscription.end_date?.toISOString() ?? null,
                cancelDate: subscription.cancel_date?.toISOString() ?? null,
            })),
            followUpLeads: followUpLeads.map((lead) => ({
                id: lead.id,
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                source: lead.source || 'profile',
                followUpStage: lead.followUpStage,
                nextFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null,
                ownerName: lead.user?.name || '',
                ownerEmail: lead.user?.email || '',
                company: lead.user?.company || '',
            })),
        });
    } catch (error) {
        console.error('[admin dashboard] error', error);
        return res.status(500).json({ error: 'Failed to load dashboard data' });
    }
}
