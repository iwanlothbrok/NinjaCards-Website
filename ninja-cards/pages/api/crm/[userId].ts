import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMStage, PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

function toDate(value: unknown): Date | null {
    if (typeof value !== 'string' || !value.trim()) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;

    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Missing userId' });
    }

    if (req.method === 'GET') {
        try {
            const [deals, leads, dashboard] = await Promise.all([
                prisma.cRMDeal.findMany({
                    where: { userId },
                    include: {
                        lead: true,
                        notes: { orderBy: { createdAt: 'desc' } },
                        tasks: { orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }] },
                    },
                    orderBy: [{ stage: 'asc' }, { updatedAt: 'desc' }],
                }),
                prisma.subscribed.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.dashboard.findUnique({ where: { userId } }),
            ]);

            const totalLeads = leads.length;
            const meetings = deals.filter((deal) => deal.stage === CRMStage.MEETING || deal.meetingAt).length;
            const wonDeals = deals.filter((deal) => deal.stage === CRMStage.WON).length;
            const totalDealValue = deals
                .filter((deal) => deal.stage === CRMStage.WON)
                .reduce((sum, deal) => sum + (deal.value ?? 0), 0);

            return res.status(200).json({
                deals,
                unassignedLeads: leads.filter((lead) => !deals.some((deal) => deal.leadId === lead.id)),
                report: {
                    taps: dashboard?.profileVisits ?? 0,
                    leads: totalLeads,
                    meetings,
                    deals: wonDeals,
                    totalDealValue,
                    tapToLeadRate: totalLeads > 0 && (dashboard?.profileVisits ?? 0) > 0
                        ? Number(((totalLeads / (dashboard?.profileVisits ?? 1)) * 100).toFixed(1))
                        : 0,
                    leadToMeetingRate: totalLeads > 0 ? Number(((meetings / totalLeads) * 100).toFixed(1)) : 0,
                    meetingToDealRate: meetings > 0 ? Number(((wonDeals / meetings) * 100).toFixed(1)) : 0,
                },
            });
        } catch (error) {
            console.error('[crm] GET error', error);
            return res.status(500).json({ error: 'Failed to load CRM data' });
        }
    }

    if (req.method === 'POST') {
        const { leadId, title, value, source, sourceDetail, nextReminderAt } = req.body as {
            leadId?: string;
            title?: string;
            value?: number;
            source?: string;
            sourceDetail?: string;
            nextReminderAt?: string;
        };

        try {
            const lead = leadId
                ? await prisma.subscribed.findFirst({ where: { id: leadId, userId } })
                : null;

            const deal = await prisma.cRMDeal.create({
                data: {
                    userId,
                    leadId: lead?.id ?? null,
                    title: title?.trim() || lead?.name || 'New deal',
                    stage: CRMStage.NEW,
                    value: typeof value === 'number' ? value : null,
                    source: source?.trim() || lead?.source || 'profile',
                    sourceDetail: sourceDetail?.trim() || lead?.sourceDetail || null,
                    taps: lead?.tapsBeforeLead ?? 0,
                    leadCapturedAt: lead?.createdAt ?? null,
                    nextReminderAt: toDate(nextReminderAt),
                },
                include: {
                    lead: true,
                    notes: true,
                    tasks: true,
                },
            });

            return res.status(201).json(deal);
        } catch (error) {
            console.error('[crm] POST error', error);
            return res.status(500).json({ error: 'Failed to create deal' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
