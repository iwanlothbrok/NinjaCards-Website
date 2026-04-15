import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMStage } from '@prisma/client';
import cors from '@/utils/cors';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const now = new Date();
        const [totalLeads, unassignedLeads, meetings, wonDeals, wonValue, followUpQueue, recentLeads, recentDeals] =
            await Promise.all([
                prisma.subscribed.count(),
                prisma.subscribed.count({ where: { crmDeal: null } }),
                prisma.cRMDeal.count({
                    where: {
                        OR: [{ stage: CRMStage.MEETING }, { stage: CRMStage.WON }, { meetingAt: { not: null } }],
                    },
                }),
                prisma.cRMDeal.count({ where: { stage: CRMStage.WON } }),
                prisma.cRMDeal.aggregate({ _sum: { value: true }, where: { stage: CRMStage.WON } }),
                prisma.subscribed.count({
                    where: {
                        followUpStopped: false,
                        followUpStage: { lt: 3 },
                        nextFollowUpAt: { lte: now },
                    },
                }),
                prisma.subscribed.findMany({
                    take: 10,
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
                prisma.cRMDeal.findMany({
                    take: 10,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        lead: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                }),
            ]);

        return res.status(200).json({
            summary: {
                totalLeads,
                unassignedLeads,
                meetings,
                wonDeals,
                wonDealValue: wonValue._sum.value ?? 0,
                followUpQueue,
            },
            recentLeads: recentLeads.map((lead) => ({
                id: lead.id,
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                source: lead.source || 'profile',
                ownerName: lead.user?.name || '',
                ownerEmail: lead.user?.email || '',
                company: lead.user?.company || '',
                createdAt: lead.createdAt.toISOString(),
            })),
            recentDeals: recentDeals.map((deal) => ({
                id: deal.id,
                title: deal.title,
                stage: deal.stage,
                value: deal.value ?? 0,
                ownerName: deal.user?.name || '',
                ownerEmail: deal.user?.email || '',
                leadName: deal.lead?.name || '',
                leadEmail: deal.lead?.email || '',
                updatedAt: deal.updatedAt.toISOString(),
            })),
        });
    } catch (error) {
        console.error('[admin crm] error', error);
        return res.status(500).json({ error: 'Failed to load CRM data' });
    }
}
