import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { buildPublicProfileUrl } from '@/utils/constants';
import { getAdminRangeWindow, parseAdminFilters, profileCompleteness } from '@/lib/adminDashboard';

type TimelineItem = {
    type: string;
    timestamp: string;
    title: string;
    detail: string;
    source: string;
};

function pushEvent(target: TimelineItem[], item: TimelineItem | null) {
    if (item) target.push(item);
}

function mapDashboardEventType(type: string) {
    const labels: Record<string, { title: string; source: string }> = {
        visit: { title: 'Card visit', source: 'DashboardEvent' },
        share: { title: 'Card share', source: 'DashboardEvent' },
        download: { title: 'VCF download', source: 'DashboardEvent' },
        socialClick: { title: 'Social click', source: 'DashboardEvent' },
    };

    return labels[type] || { title: type, source: 'DashboardEvent' };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
        const locale = typeof req.query.locale === 'string' && req.query.locale ? req.query.locale : 'bg';
        const filters = parseAdminFilters(req.query);
        const rangeWindow = getAdminRangeWindow(filters.range);

        if (!userId) {
            return res.status(400).json({ error: 'User id is required' });
        }

        const [user, events, leads, deals, subscription, invoices] = await prisma.$transaction([
            prisma.user.findUnique({
                where: { id: userId },
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
                    _count: {
                        select: { leads: true },
                    },
                },
            }),
            prisma.dashboardEvent.findMany({
                where: {
                    userId,
                    timestamp: { gte: rangeWindow.start, lte: rangeWindow.end },
                },
                orderBy: { timestamp: 'desc' },
            }),
            prisma.subscribed.findMany({
                where: {
                    userId,
                    createdAt: { gte: rangeWindow.start, lte: rangeWindow.end },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.cRMDeal.findMany({
                where: {
                    userId,
                    OR: [
                        { createdAt: { gte: rangeWindow.start, lte: rangeWindow.end } },
                        { contactedAt: { gte: rangeWindow.start, lte: rangeWindow.end } },
                        { meetingAt: { gte: rangeWindow.start, lte: rangeWindow.end } },
                        { closedAt: { gte: rangeWindow.start, lte: rangeWindow.end } },
                    ],
                },
                orderBy: { updatedAt: 'desc' },
                include: {
                    lead: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.subscription.findUnique({
                where: { userId },
            }),
            prisma.invoice.findMany({
                where: {
                    userId,
                    createdAt: { gte: rangeWindow.start, lte: rangeWindow.end },
                },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
        ]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const timeline: TimelineItem[] = [];

        pushEvent(timeline, {
            type: 'signup',
            timestamp: user.createdAt.toISOString(),
            title: 'Signed up',
            detail: `${user.name || 'User'} joined NinjaCards`,
            source: 'User',
        });

        if (user.lastLoginAt) {
            pushEvent(timeline, {
                type: 'lastLogin',
                timestamp: user.lastLoginAt.toISOString(),
                title: 'Last login',
                detail: 'User completed a password login',
                source: 'User',
            });
        }

        for (const event of events) {
            const label = mapDashboardEventType(event.type);
            pushEvent(timeline, {
                type: event.type,
                timestamp: event.timestamp.toISOString(),
                title: label.title,
                detail: `${user.name || 'User'} triggered ${label.title.toLowerCase()}`,
                source: label.source,
            });
        }

        for (const lead of leads) {
            pushEvent(timeline, {
                type: 'leadCreated',
                timestamp: lead.createdAt.toISOString(),
                title: 'Lead created',
                detail: `${lead.name}${lead.source ? ` via ${lead.source}` : ''}`,
                source: 'Subscribed',
            });
        }

        for (const deal of deals) {
            pushEvent(timeline, {
                type: 'dealCreated',
                timestamp: deal.createdAt.toISOString(),
                title: 'CRM deal created',
                detail: `${deal.title} (${deal.stage})`,
                source: 'CRMDeal',
            });

            if (deal.contactedAt) {
                pushEvent(timeline, {
                    type: 'dealContacted',
                    timestamp: deal.contactedAt.toISOString(),
                    title: 'Lead contacted',
                    detail: deal.title,
                    source: 'CRMDeal',
                });
            }

            if (deal.meetingAt) {
                pushEvent(timeline, {
                    type: 'dealMeeting',
                    timestamp: deal.meetingAt.toISOString(),
                    title: 'Meeting scheduled',
                    detail: deal.title,
                    source: 'CRMDeal',
                });
            }

            if (deal.closedAt) {
                pushEvent(timeline, {
                    type: deal.stage === 'WON' ? 'dealWon' : 'dealClosed',
                    timestamp: deal.closedAt.toISOString(),
                    title: deal.stage === 'WON' ? 'Deal won' : 'Deal closed',
                    detail: deal.title,
                    source: 'CRMDeal',
                });
            }
        }

        if (subscription) {
            pushEvent(timeline, {
                type: 'subscriptionStarted',
                timestamp: subscription.start_date.toISOString(),
                title: 'Subscription started',
                detail: `${subscription.plan} / ${subscription.status}`,
                source: 'Subscription',
            });

            if (subscription.cancel_date) {
                pushEvent(timeline, {
                    type: 'subscriptionCancelled',
                    timestamp: subscription.cancel_date.toISOString(),
                    title: 'Subscription cancelled',
                    detail: `${subscription.plan} / ${subscription.status}`,
                    source: 'Subscription',
                });
            }

            if (subscription.end_date) {
                pushEvent(timeline, {
                    type: 'subscriptionEnded',
                    timestamp: subscription.end_date.toISOString(),
                    title: 'Subscription end date',
                    detail: `${subscription.plan} / ${subscription.status}`,
                    source: 'Subscription',
                });
            }
        }

        for (const invoice of invoices) {
            pushEvent(timeline, {
                type: 'invoicePaid',
                timestamp: invoice.createdAt.toISOString(),
                title: 'Invoice recorded',
                detail: `${invoice.amountPaid / 100} ${invoice.currency.toUpperCase()}`,
                source: 'Invoice',
            });
        }

        timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name || 'Unnamed user',
                email: user.email || '',
                company: user.company || '',
                publicProfileUrl: buildPublicProfileUrl({ locale, slug: user.slug, userId: user.id }),
                joinedAt: user.createdAt.toISOString(),
                lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
                lastSeenAt: user.dashboard?.events?.[0]?.timestamp?.toISOString() ?? null,
                completeness: profileCompleteness(user),
                leadCount: user._count.leads,
            },
            range: {
                key: rangeWindow.key,
                label: rangeWindow.label,
                start: rangeWindow.start.toISOString(),
                end: rangeWindow.end.toISOString(),
            },
            timeline,
        });
    } catch (error) {
        console.error('[admin user timeline] error', error);
        return res.status(500).json({ error: 'Failed to load user timeline' });
    }
}
