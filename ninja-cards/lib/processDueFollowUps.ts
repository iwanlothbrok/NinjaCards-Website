import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import {
    buildFollowUpEmail,
    buildFollowUpProfileUrl,
    buildStaticFollowUpContent,
    FollowUpStage,
    getNextFollowUpAt,
} from '@/lib/leadFollowUp';

function getNextStage(currentStage: number): FollowUpStage | null {
    if (currentStage === 0) return 1;
    if (currentStage === 1) return 2;
    if (currentStage === 2) return 3;
    return null;
}

export async function processDueFollowUps(params?: { limit?: number }) {
    const prisma = new PrismaClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const now = new Date();
    const limit = params?.limit ?? 12;

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
                        id: true,
                        slug: true,
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
            take: limit,
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
            const profileUrl = buildFollowUpProfileUrl({
                language: owner.language,
                slug: owner.slug ?? undefined,
                userId: owner.id,
            });
            const ctaLabel = owner.language === 'en' ? 'View my profile' : 'Разгледай профила ми';

            const emailContent = buildStaticFollowUpContent({
                stage,
                language: owner.language,
                ownerName,
                ownerPosition: owner.position ?? undefined,
                ownerCompany: owner.company ?? undefined,
                leadName: lead.name,
                leadMessage: lead.message ?? undefined,
                profileUrl,
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
                        ctaUrl: profileUrl,
                        ctaLabel,
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

        return {
            checked,
            sent,
            failed,
            processedLeadIds,
        };
    } finally {
        await prisma.$disconnect();
    }
}
