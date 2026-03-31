import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend'; // sending emails via Resend.com API
import {
    buildFollowUpEmail,
    buildFollowUpPrompt,
    FollowUpStage,
    getNextFollowUpAt,
    parseFollowUpResponse,
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

async function generateFollowUp(params: {
    stage: FollowUpStage;
    ownerName: string;
    ownerPosition?: string;
    ownerCompany?: string;
    leadName: string;
    leadEmail: string;
    leadMessage?: string;
}): Promise<{ subject: string; body: string } | null> {
    const prompt = buildFollowUpPrompt(params);

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY!,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 600,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            console.error('[follow-up] Claude API error:', await response.json().catch(() => ({})));
            return null;
        }

        const data = await response.json();
        const rawText = data.content?.[0]?.text ?? '';
        return parseFollowUpResponse(rawText);
    } catch (error) {
        console.error('[follow-up] Failed to generate AI copy:', error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

    const now = new Date();

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
                    },
                },
            },
            orderBy: { nextFollowUpAt: 'asc' },
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

            const emailContent = await generateFollowUp({
                stage,
                ownerName,
                ownerPosition: owner.position ?? undefined,
                ownerCompany: owner.company ?? undefined,
                leadName: lead.name,
                leadEmail: lead.email,
                leadMessage: lead.message ?? undefined,
            });

            if (!emailContent) {
                failed++;
                continue;
            }

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

            await new Promise((resolve) => setTimeout(resolve, 300));
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
