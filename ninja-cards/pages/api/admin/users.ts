import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { buildPublicProfileUrl } from '@/utils/constants';

function profileCompleteness(user: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    position: string | null;
    phone1: string | null;
    bio: string | null;
    image: string | null;
    slug: string | null;
    website: string | null;
    linkedin: string | null;
}) {
    const fields = [
        user.firstName,
        user.lastName,
        user.company,
        user.position,
        user.phone1,
        user.bio,
        user.image,
        user.slug,
        user.website,
        user.linkedin,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
}

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
        const days30 = new Date();
        days30.setDate(days30.getDate() - 30);

        const userInclude = {
            dashboard: {
                include: {
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
            subscription: true,
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
        };

        const [users, activeUsers30d, loginTrackedCount, recentlyActiveUsersRaw, mostEngagedUsersRaw, noRecentActivityUsersRaw] = await Promise.all([
            prisma.user.findMany({
                where: q
                    ? {
                          OR: [
                              { name: { contains: q, mode: 'insensitive' } },
                              { firstName: { contains: q, mode: 'insensitive' } },
                              { lastName: { contains: q, mode: 'insensitive' } },
                              { email: { contains: q, mode: 'insensitive' } },
                          ],
                      }
                    : undefined,
                take,
                orderBy: { createdAt: 'desc' },
                include: userInclude,
            }),
            prisma.dashboardEvent.findMany({
                where: { timestamp: { gte: days30 } },
                distinct: ['userId'],
                select: { userId: true },
            }),
            prisma.user.count({
                where: { lastLoginAt: { not: null } },
            }),
            prisma.user.findMany({
                take: 8,
                where: {
                    dashboard: {
                        is: {
                            events: {
                                some: {},
                            },
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                include: userInclude,
            }),
            prisma.user.findMany({
                take: 12,
                where: {
                    dashboard: {
                        isNot: null,
                    },
                },
                orderBy: [
                    { dashboard: { profileVisits: 'desc' } },
                    { dashboard: { profileShares: 'desc' } },
                ],
                include: userInclude,
            }),
            prisma.user.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: userInclude,
            }),
        ]);

        const mappedUsers = users.map((user) => mapUserRecord(user, locale));
        const recentlyActiveUsers = recentlyActiveUsersRaw
            .map((user) => mapUserRecord(user, locale))
            .sort((a, b) => {
                if (!a.lastSeenAt && !b.lastSeenAt) return 0;
                if (!a.lastSeenAt) return 1;
                if (!b.lastSeenAt) return -1;
                return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
            })
            .slice(0, 6);
        const mostEngagedUsers = mostEngagedUsersRaw
            .map((user) => mapUserRecord(user, locale))
            .sort(
                (a, b) =>
                    engagementScore(b) - engagementScore(a) ||
                    new Date(b.lastSeenAt || b.joinedAt).getTime() - new Date(a.lastSeenAt || a.joinedAt).getTime(),
            )
            .slice(0, 6);
        const noRecentActivityUsers = noRecentActivityUsersRaw
            .map((user) => mapUserRecord(user, locale))
            .filter((user) => !user.lastSeenAt || new Date(user.lastSeenAt).getTime() < days30.getTime())
            .slice(0, 6);

        return res.status(200).json({
            summary: {
                totalShown: mappedUsers.length,
                activeUsers30d: activeUsers30d.length,
                loginTrackedCount,
                noRecentActivityCount: noRecentActivityUsers.length,
            },
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
