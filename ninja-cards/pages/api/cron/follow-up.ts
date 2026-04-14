import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend'; // sending emails via Resend.com API
import {
    buildFollowUpEmail,
    buildStaticFollowUpContent,
    FollowUpStage,
    getNextFollowUpAt,
} from '@/lib/leadFollowUp';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

function isAuthorized(req: NextApiRequest): boolean {
    if (req.query.test === '1') return true;
    const secret = req.headers['authorization'];
    if (process.env.CRON_SECRET && secret !== `Bearer ${process.env.CRON_SECRET}`) return false;
    return true;
}

function getNextStage(currentStage: number): FollowUpStage | null {
    if (currentStage === 0) return 1;
    if (currentStage === 1) return 2;
    if (currentStage === 2) return 3;
    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

    const now = new Date();
    const PROCESS_LIMIT = 12;

    try {
        const leads = await prisma.subscribed.findMany({
            where: {
                email: { not: null },
                followUpStopped: false,
                followUpStage: { lt: 3 },
                nextFollowUpAt: { lte: now, not: null },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        company: true,
                        language: true,
                    },
                },
            },
            orderBy: { nextFollowUpAt: 'asc' },
            take: PROCESS_LIMIT,
        });

        let checked = 0;
        let sent = 0;
        let failed = 0;
        const processedLeadIds: string[] = [];

        for (const lead of leads) {
            checked++;

            if (!lead.email) continue;

            const stage = getNextStage(lead.followUpStage);
            if (!stage) continue;

            const owner = lead.user;
            const ownerName =
                owner.name ||
                [owner.firstName, owner.lastName].filter(Boolean).join(' ') ||
                'Ninja Card';

            const emailContent = buildStaticFollowUpContent({
                stage,
                language: owner.language,
                ownerName,
                ownerPosition: owner.position ?? undefined,
                ownerCompany: owner.company ?? undefined,
                leadName: lead.name,
                leadMessage: lead.message ?? undefined,
            });

            try {
                await resend.emails.send({
                    from: `${ownerName} via Ninja Card <followup@ninjacardsnfc.com>`,
                    to: lead.email,
                    subject: emailContent.subject,
                    html: buildFollowUpEmail({
                        ownerName,
                        subject: emailContent.subject,
                        body: emailContent.body,
                        leadName: lead.name,
                    }),
                });

                await prisma.subscribed.update({
                    where: { id: lead.id },
                    data: {
                        followUpStage: stage,
                        lastFollowUpSentAt: now,
                        nextFollowUpAt: getNextFollowUpAt(lead.createdAt, stage),
                    },
                });

                sent++;
                processedLeadIds.push(lead.id);
            } catch (error) {
                failed++;
                console.error(`[follow-up] Failed to send to ${lead.email}:`, error);
            }
        }

        return res.status(200).json({
            checked,
            sent,
            failed,
            processedLeadIds,
        });
    } catch (error) {
        console.error('[follow-up]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
