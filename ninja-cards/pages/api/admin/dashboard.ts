import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMStage, SubscriptionStatus } from '@prisma/client';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { buildPublicProfileUrl } from '@/utils/constants';

function startOfDaysAgo(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, delta: number) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function makeMonthBuckets(monthCount: number) {
    const current = startOfMonth(new Date());
    return Array.from({ length: monthCount }, (_, index) => {
        const start = shiftMonth(current, -(monthCount - index - 1));
        const end = shiftMonth(start, 1);
        return {
            key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
            label: start.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
            start,
            end,
        };
    });
}

function createMonthlySeries(monthCount: number) {
    return makeMonthBuckets(monthCount).map((bucket) => ({
        monthKey: bucket.key,
        label: bucket.label,
        visits: 0,
        shares: 0,
        downloads: 0,
        socialClicks: 0,
        leads: 0,
        activeUsers: 0,
        interactions: 0,
        visitToLeadRate: 0,
        _activeUserIds: new Set<string>(),
    }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const locale = typeof req.query.locale === 'string' && req.query.locale ? req.query.locale : 'bg';
        const now = new Date();
        const days7 = startOfDaysAgo(7);
        const days30 = startOfDaysAgo(30);
        const months = makeMonthBuckets(6);
        const firstMonthStart = months[0].start;

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
            latestCardEvents,
            recentUsers,
            subscriptionAlerts,
            followUpLeads,
            monthlyEvents,
            monthlyLeads,
            activeUsers7d,
            activeUsers30d,
            inactiveUsersRaw,
            highTrafficLowLeadUsersRaw,
            topActiveUsersThisMonthRaw,
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
                take: 8,
                orderBy: [{ profileVisits: 'desc' }, { profileShares: 'desc' }],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            company: true,
                            slug: true,
                            _count: {
                                select: {
                                    leads: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.dashboardEvent.findMany({
                take: 12,
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
                                    slug: true,
                                    createdAt: true,
                                    lastLoginAt: true,
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
                            socialLinkClicks: true,
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
            prisma.dashboardEvent.findMany({
                where: {
                    timestamp: { gte: firstMonthStart },
                },
                select: {
                    userId: true,
                    type: true,
                    timestamp: true,
                },
            }),
            prisma.subscribed.findMany({
                where: {
                    createdAt: { gte: firstMonthStart },
                },
                select: {
                    userId: true,
                    createdAt: true,
                },
            }),
            prisma.dashboardEvent.findMany({
                where: { timestamp: { gte: days7 } },
                distinct: ['userId'],
                select: { userId: true },
            }),
            prisma.dashboardEvent.findMany({
                where: { timestamp: { gte: days30 } },
                distinct: ['userId'],
                select: { userId: true },
            }),
            prisma.user.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: {
                    dashboard: {
                        include: {
                            events: {
                                take: 1,
                                orderBy: { timestamp: 'desc' },
                                select: { timestamp: true, type: true },
                            },
                        },
                    },
                },
            }),
            prisma.dashboard.findMany({
                take: 12,
                orderBy: [{ profileVisits: 'desc' }, { profileShares: 'desc' }],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            company: true,
                            slug: true,
                            _count: {
                                select: {
                                    leads: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.dashboardEvent.findMany({
                where: { timestamp: { gte: startOfMonth(now) } },
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
                                    slug: true,
                                },
                            },
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

        const monthlySeries = createMonthlySeries(6);
        const monthlyIndex = new Map(monthlySeries.map((item) => [item.monthKey, item]));

        for (const event of monthlyEvents) {
            const key = `${event.timestamp.getFullYear()}-${String(event.timestamp.getMonth() + 1).padStart(2, '0')}`;
            const month = monthlyIndex.get(key);
            if (!month) continue;

            if (event.type === 'visit') month.visits += 1;
            if (event.type === 'share') month.shares += 1;
            if (event.type === 'download') month.downloads += 1;
            if (event.type === 'socialClick') month.socialClicks += 1;

            month._activeUserIds.add(event.userId);
        }

        for (const lead of monthlyLeads) {
            const key = `${lead.createdAt.getFullYear()}-${String(lead.createdAt.getMonth() + 1).padStart(2, '0')}`;
            const month = monthlyIndex.get(key);
            if (!month) continue;
            month.leads += 1;
        }

        const finalizedMonthlySeries = monthlySeries.map(({ _activeUserIds, ...month }) => {
            const interactions = month.visits + month.shares + month.downloads + month.socialClicks;
            return {
                ...month,
                activeUsers: _activeUserIds.size,
                interactions,
                visitToLeadRate: month.visits > 0 ? Number(((month.leads / month.visits) * 100).toFixed(1)) : 0,
            };
        });

        const inactiveUsers = inactiveUsersRaw
            .map((user) => {
                const latestEvent = user.dashboard?.events?.[0] ?? null;
                return {
                    id: user.id,
                    name: user.name || 'Unnamed user',
                    email: user.email || '',
                    company: user.company || '',
                    lastSeenAt: latestEvent?.timestamp?.toISOString() ?? null,
                    lastCardAction: latestEvent?.type ?? null,
                    publicProfileUrl: buildPublicProfileUrl({ locale, slug: user.slug, userId: user.id }),
                };
            })
            .filter((user) => !user.lastSeenAt || new Date(user.lastSeenAt).getTime() < days30.getTime())
            .slice(0, 6);

        const highTrafficLowLeadUsers = highTrafficLowLeadUsersRaw
            .filter((item) => (item.user?._count?.leads ?? 0) === 0 && item.profileVisits >= 10)
            .slice(0, 6)
            .map((item) => ({
                id: item.userId,
                name: item.user?.name || 'Unnamed user',
                email: item.user?.email || '',
                company: item.user?.company || '',
                profileVisits: item.profileVisits,
                profileShares: item.profileShares,
                vcfDownloads: item.vcfDownloads,
                socialLinkClicks: item.socialLinkClicks,
                leadCount: item.user?._count?.leads ?? 0,
                publicProfileUrl: buildPublicProfileUrl({ locale, slug: item.user?.slug, userId: item.userId }),
            }));

        const topActiveUsersThisMonth = topActiveUsersThisMonthRaw
            .slice(0, 8)
            .map((item) => ({
                id: item.userId,
                name: item.dashboard.user?.name || 'Unnamed user',
                email: item.dashboard.user?.email || '',
                company: item.dashboard.user?.company || '',
                lastSeenAt: item.timestamp.toISOString(),
                profileVisits: item.dashboard.profileVisits,
                profileShares: item.dashboard.profileShares,
                vcfDownloads: item.dashboard.vcfDownloads,
                socialLinkClicks: item.dashboard.socialLinkClicks,
                publicProfileUrl: buildPublicProfileUrl({
                    locale,
                    slug: item.dashboard.user?.slug,
                    userId: item.userId,
                }),
            }));

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
                activeUsers7d: activeUsers7d.length,
                activeUsers30d: activeUsers30d.length,
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
            monthlyAnalytics: finalizedMonthlySeries,
            topUsers: topDashboards.map((item) => ({
                id: item.userId,
                name: item.user?.name || 'Unnamed user',
                email: item.user?.email || '',
                company: item.user?.company || '',
                publicProfileUrl: buildPublicProfileUrl({ locale, slug: item.user?.slug, userId: item.userId }),
                leadCount: item.user?._count?.leads ?? 0,
                profileVisits: item.profileVisits,
                profileShares: item.profileShares,
                vcfDownloads: item.vcfDownloads,
                socialLinkClicks: item.socialLinkClicks,
            })),
            recentCardActivity: latestCardEvents.map((item) => ({
                userId: item.userId,
                type: item.type,
                timestamp: item.timestamp.toISOString(),
                name: item.dashboard.user?.name || 'Unnamed user',
                email: item.dashboard.user?.email || '',
                company: item.dashboard.user?.company || '',
                publicProfileUrl: buildPublicProfileUrl({
                    locale,
                    slug: item.dashboard.user?.slug,
                    userId: item.userId,
                }),
                joinedAt: item.dashboard.user?.createdAt?.toISOString() ?? null,
                lastLoginAt: item.dashboard.user?.lastLoginAt?.toISOString() ?? null,
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
                socialLinkClicks: user.dashboard?.socialLinkClicks ?? 0,
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
            insights: {
                topActiveUsersThisMonth,
                inactiveUsers,
                highTrafficLowLeadUsers,
            },
        });
    } catch (error) {
        console.error('[admin dashboard] error', error);
        return res.status(500).json({ error: 'Failed to load dashboard data' });
    }
}
