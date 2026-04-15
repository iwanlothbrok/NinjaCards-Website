import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { buildPublicProfileUrl } from '@/utils/constants';
import {
    buildAdminUserWhere,
    buildFilterSummary,
    getAdminRangeWindow,
    matchesActivityState,
    matchesCompletenessBand,
    parseAdminFilters,
    profileCompleteness,
} from '@/lib/adminDashboard';

function engagementScore(input: {
    profileVisits: number;
    profileShares: number;
    vcfDownloads: number;
    socialLinkClicks: number;
    leadCount: number;
}) {
    return (
        input.profileVisits +
        input.profileShares * 5 +
        input.vcfDownloads * 4 +
        input.socialLinkClicks * 3 +
        input.leadCount * 8
    );
}

function mapUserRecord(user: any, locale: string) {
    const latestEvent = user.dashboard?.events?.[0] ?? null;
    const leadCount = user._count?.leads ?? user.leads?.length ?? 0;

    return {
        id: user.id,
        name: user.name || 'Unnamed user',
        email: user.email || '',
        slug: user.slug || null,
        publicProfileUrl: buildPublicProfileUrl({ locale, slug: user.slug, userId: user.id }),
        hasPassword: Boolean(user.password),
        company: user.company || '',
        plan: user.subscription?.plan || 'No plan',
        subscriptionStatus: user.subscription?.status || 'none',
        joinedAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        lastSeenAt: latestEvent?.timestamp?.toISOString() ?? null,
        lastCardAction: latestEvent?.type ?? null,
        profileVisits: user.dashboard?.profileVisits ?? 0,
        profileShares: user.dashboard?.profileShares ?? 0,
        vcfDownloads: user.dashboard?.vcfDownloads ?? 0,
        socialLinkClicks: user.dashboard?.socialLinkClicks ?? 0,
        leadCount,
        latestLeadAt: user.leads?.[0]?.createdAt?.toISOString() ?? null,
        completeness: profileCompleteness(user),
    };
}

const userSelect = {
    id: true,
    name: true,
    email: true,
    slug: true,
    password: true,
    company: true,
    firstName: true,
    lastName: true,
    position: true,
    phone1: true,
    bio: true,
    image: true,
    website: true,
    linkedin: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
    dashboard: {
        select: {
            profileVisits: true,
            profileShares: true,
            vcfDownloads: true,
            socialLinkClicks: true,
            events: {
                take: 1,
                orderBy: { timestamp: 'desc' as const },
                select: {
                    type: true,
                    timestamp: true,
                },
            },
        },
    },
    subscription: {
        select: {
            plan: true,
            status: true,
        },
    },
    leads: {
        select: {
            id: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' as const },
        take: 1,
    },
    _count: {
        select: {
            leads: true,
        },
    },
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (!['GET', 'PATCH'].includes(req.method || '')) {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        if (req.method === 'PATCH') {
            const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
            const action = typeof req.body?.action === 'string' ? req.body.action : '';

            if (!userId) {
                return res.status(400).json({ error: 'User id is required' });
            }

            if (action !== 'clear-password') {
                return res.status(400).json({ error: 'Unsupported action' });
            }

            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, password: true, name: true, email: true },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            await prisma.user.update({
                where: { id: userId },
                data: { password: null },
            });

            return res.status(200).json({
                ok: true,
                userId,
                name: existingUser.name || 'Unnamed user',
                email: existingUser.email || '',
                hadPassword: Boolean(existingUser.password),
                hasPassword: false,
            });
        }

        const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
        const locale = typeof req.query.locale === 'string' && req.query.locale ? req.query.locale : 'bg';
        const take = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
        const filters = parseAdminFilters(req.query);
        const rangeWindow = getAdminRangeWindow(filters.range);

        const userWhere = buildAdminUserWhere(filters, q);
        const mainQueryTake = Math.min(Math.max(take * 4, 40), 120);
        const sideQueryTake = Math.min(Math.max(take * 2, 12), 36);

        const [users, activeUsersInRange, loginTrackedCount, recentlyActiveResult, mostEngagedResult, noRecentResult] = await Promise.all([
            prisma.user.findMany({
                where: userWhere,
                orderBy: { createdAt: 'desc' },
                take: mainQueryTake,
                select: userSelect,
            }),
            prisma.dashboardEvent.findMany({
                where: { timestamp: { gte: rangeWindow.start } },
                distinct: ['userId'],
                select: { userId: true },
            }),
            prisma.user.count({
                where: { ...userWhere, lastLoginAt: { not: null } },
            }),
            prisma.dashboardEvent
                .findMany({
                    where: { timestamp: { gte: rangeWindow.start } },
                    orderBy: { timestamp: 'desc' },
                    distinct: ['userId'],
                    take: sideQueryTake,
                    select: { userId: true },
                })
                .then(async (events) => {
                    const ids = events.map((event) => event.userId);
                    if (ids.length === 0) return [];

                    return prisma.user.findMany({
                        where: {
                            ...userWhere,
                            id: { in: ids },
                        },
                        select: userSelect,
                    });
                })
                .catch((error) => {
                    console.error('[admin users] recently active query failed', error);
                    return [];
                }),
            prisma.dashboard
                .findMany({
                    where: {
                        user: userWhere,
                    },
                    orderBy: [{ profileVisits: 'desc' }, { profileShares: 'desc' }],
                    take: sideQueryTake,
                    select: {
                        user: {
                            select: userSelect,
                        },
                    },
                })
                .then((rows) => rows.map((row) => row.user).filter(Boolean))
                .catch((error) => {
                    console.error('[admin users] most engaged query failed', error);
                    return [];
                }),
            prisma.user
                .findMany({
                    where: userWhere,
                    orderBy: { createdAt: 'desc' },
                    take: sideQueryTake,
                    select: userSelect,
                })
                .catch((error) => {
                    console.error('[admin users] no recent activity query failed', error);
                    return [];
                }),
        ]);

        const activeIdsInRange = new Set(activeUsersInRange.map((item) => item.userId));
        const filterMappedUsers = (records: any[]) =>
            records
                .map((user) => mapUserRecord(user, locale))
                .filter((user) => matchesCompletenessBand(user.completeness, filters.completenessBand))
                .filter((user) => matchesActivityState(user.lastSeenAt, filters, rangeWindow.start));

        const mappedUsers = filterMappedUsers(users)
            .slice(0, take);
        const recentlyActiveUsers = recentlyActiveResult
            .map((user) => mapUserRecord(user, locale))
            .filter((user) => activeIdsInRange.has(user.id))
            .filter((user) => matchesCompletenessBand(user.completeness, filters.completenessBand))
            .sort((a, b) => {
                if (!a.lastSeenAt && !b.lastSeenAt) return 0;
                if (!a.lastSeenAt) return 1;
                if (!b.lastSeenAt) return -1;
                return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
            })
            .slice(0, 6);
        const mostEngagedUsers = mostEngagedResult
            .map((user) => mapUserRecord(user, locale))
            .filter((user) => matchesCompletenessBand(user.completeness, filters.completenessBand))
            .filter((user) => matchesActivityState(user.lastSeenAt, filters, rangeWindow.start))
            .sort(
                (a, b) =>
                    engagementScore(b) - engagementScore(a) ||
                    new Date(b.lastSeenAt || b.joinedAt).getTime() - new Date(a.lastSeenAt || a.joinedAt).getTime(),
            )
            .slice(0, 6);
        const noRecentActivityUsers = noRecentResult
            .map((user) => mapUserRecord(user, locale))
            .filter((user) => !user.lastSeenAt || new Date(user.lastSeenAt).getTime() < rangeWindow.start.getTime())
            .filter((user) => matchesCompletenessBand(user.completeness, filters.completenessBand))
            .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
            .slice(0, 6);

        return res.status(200).json({
            summary: {
                totalShown: mappedUsers.length,
                activeUsers30d: mappedUsers.filter((user) => activeIdsInRange.has(user.id)).length,
                loginTrackedCount,
                noRecentActivityCount: noRecentActivityUsers.length,
                rangeLabel: rangeWindow.label,
                appliedFilters: buildFilterSummary(filters),
            },
            filters,
            users: mappedUsers,
            recentlyActiveUsers,
            mostEngagedUsers,
            noRecentActivityUsers,
        });
    } catch (error) {
        console.error('[admin users] error', error);
        return res.status(500).json({ error: 'Failed to load users' });
    }
}
