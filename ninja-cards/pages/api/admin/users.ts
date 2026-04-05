import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
        const take = Math.min(Number(req.query.limit || 25), 100);

        const users = await prisma.user.findMany({
            where: q
                ? {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { email: { contains: q, mode: 'insensitive' } },
                        { company: { contains: q, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            take,
            orderBy: { updatedAt: 'desc' },
            include: {
                dashboard: {
                    include: {
                        events: {
                            take: 1,
                            orderBy: { timestamp: 'desc' },
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
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        return res.status(200).json({
            users: users.map((user) => ({
                id: user.id,
                name: user.name || 'Unnamed user',
                email: user.email || '',
                company: user.company || '',
                plan: user.subscription?.plan || 'No plan',
                subscriptionStatus: user.subscription?.status || 'none',
                joinedAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                lastSeenAt: user.dashboard?.events[0]?.timestamp?.toISOString() ?? null,
                lastCardAction: user.dashboard?.events[0]?.type ?? null,
                profileVisits: user.dashboard?.profileVisits ?? 0,
                profileShares: user.dashboard?.profileShares ?? 0,
                vcfDownloads: user.dashboard?.vcfDownloads ?? 0,
                leadCount: user.leads.length,
                latestLeadAt: user.leads[0]?.createdAt?.toISOString() ?? null,
                completeness: profileCompleteness(user),
            })),
        });
    } catch (error) {
        console.error('[admin users] error', error);
        return res.status(500).json({ error: 'Failed to load users' });
    }
}
