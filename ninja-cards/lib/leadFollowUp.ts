import { buildPublicProfileUrl } from '@/utils/constants';

export type FollowUpStage = 1 | 2 | 3;
export type FollowUpLanguage = 'bg' | 'en';

type BuildPromptParams = {
    stage: FollowUpStage;
    ownerName?: string;
    ownerPosition?: string;
    ownerCompany?: string;
    leadName: string;
    leadEmail: string;
    leadMessage?: string;
    profileUrl?: string;
};

export function normalizeFollowUpStage(value: unknown): FollowUpStage {
    return value === 2 || value === 3 ? value : 1;
}

export function getNextFollowUpAt(createdAt: Date, completedStage: number): Date | null {
    switch (completedStage) {
        case 0:
            return new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
        case 1:
            return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
        case 2:
            return new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        default:
            return null;
    }
}

export function buildFollowUpProfileUrl(params: {
    language?: string | null;
    slug?: string | null;
    userId?: string | null;
}): string | undefined {
    if (!params.userId && !params.slug) return undefined;

    return buildPublicProfileUrl({
        locale: params.language === 'en' ? 'en' : 'bg',
        slug: params.slug ?? undefined,
        userId: params.userId ?? undefined,
    });
}

function getStageInstruction(stage: FollowUpStage): string {
    switch (stage) {
        case 1:
            return 'This is the first follow-up, sent about 2 hours after the lead was captured. Keep it warm, human and easy to reply to.';
        case 2:
            return 'This is the second follow-up, sent about 24 hours after the lead was captured. Add value and mention one useful next step or resource.';
        case 3:
            return 'This is the third follow-up, sent about 7 days after the lead was captured. Re-open the conversation politely and make one concrete low-pressure offer.';
        default:
            return 'Write a professional follow-up email.';
    }
}

export function buildFollowUpPrompt({
    stage,
    ownerName,
    ownerPosition,
    ownerCompany,
    leadName,
    leadEmail,
    leadMessage,
    profileUrl,
}: BuildPromptParams): string {
    const senderName = ownerName || 'Not specified';
    const senderPosition = ownerPosition || 'Not specified';
    const senderCompany = ownerCompany || 'Not specified';
    const cleanLeadMessage = typeof leadMessage === 'string' ? leadMessage.trim() : '';
    const stageInstruction = getStageInstruction(stage);

    return `You are an expert at writing professional follow-up emails that convert leads into clients.

The email sender's details:
- Name: ${senderName}
- Position: ${senderPosition}
- Company: ${senderCompany}

The lead's details:
- Name: ${leadName}
- Email: ${leadEmail}
${cleanLeadMessage ? `- Message they left: "${cleanLeadMessage}"` : '- No message left (they scanned the card and left their contact)'}
${profileUrl ? `- Sender profile URL: ${profileUrl}` : ''}

Stage instruction:
${stageInstruction}

Instructions:
1. Write a warm, professional follow-up email.
2. If the lead left a message, reference it naturally and show you actually read it.
3. If no message, write a genuine "great to meet you" style opening.
4. The body must include a greeting, 3-5 sentences of content, and a sign-off.
5. End with one clear, soft, non-pushy call-to-action.
6. If a sender profile URL is provided, naturally include it as the CTA destination when it fits.
7. Write in the same language as the lead's message. If no message, default to Bulgarian.
8. Do not use placeholders like [Your Name]; use the actual data provided.
9. Do not mention internal timing like "2 hours" or "7 days".
10. Sound like a real human, not a template. Vary sentence structure.

Respond ONLY with valid JSON, no other text:
{
  "subject": "email subject line",
  "body": "full email body including greeting and sign-off"
}`;
}

function resolveLeadGreetingName(leadName: string) {
    return leadName.trim().split(/\s+/)[0] || leadName;
}

function resolveOwnerSignature(ownerName: string, ownerPosition?: string, ownerCompany?: string) {
    const details = [ownerPosition, ownerCompany].filter(Boolean).join(', ');
    return details ? `${ownerName}\n${details}` : ownerName;
}

export function buildStaticFollowUpContent(params: {
    stage: FollowUpStage;
    language?: string | null;
    ownerName: string;
    ownerPosition?: string;
    ownerCompany?: string;
    leadName: string;
    leadMessage?: string;
    profileUrl?: string;
}): { subject: string; body: string } {
    const language: FollowUpLanguage = params.language === 'en' ? 'en' : 'bg';
    const firstName = resolveLeadGreetingName(params.leadName);
    const signature = resolveOwnerSignature(params.ownerName, params.ownerPosition, params.ownerCompany);
    const hasLeadMessage = Boolean(params.leadMessage?.trim());
    const companyRef = params.ownerCompany ? ` at ${params.ownerCompany}` : '';
    const companyRefBg = params.ownerCompany ? ` в ${params.ownerCompany}` : '';
    const profileCtaEn = params.profileUrl
        ? `You can view my profile here and get a quick overview before we continue: ${params.profileUrl}`
        : 'If you want, just reply here and I will gladly continue the conversation.';
    const profileCtaBg = params.profileUrl
        ? `Можеш да разгледаш профила ми тук и да видиш повече за мен, преди да продължим разговора: ${params.profileUrl}`
        : 'Ако е удобно, просто ми отговори тук и с радост ще продължим разговора.';

    if (language === 'en') {
        switch (params.stage) {
            case 1:
                return {
                    subject: `Great connecting, ${firstName}`,
                    body: `Hi ${firstName},\n\nThank you for sharing your details with me${companyRef}. I wanted to follow up in case you have any questions or if there is anything I can help you with right away.\n\n${profileCtaEn}\n\nBest,\n${signature}`,
                };
            case 2:
                return {
                    subject: `Quick follow-up from ${params.ownerName}`,
                    body: `Hi ${firstName},\n\nI wanted to check back in after we connected${companyRef}.${hasLeadMessage ? ' I also kept your message in mind and would be happy to help with the next step.' : ' If this is still relevant for you, I would be happy to point you in the right direction.'}\n\n${profileCtaEn}\n\nBest,\n${signature}`,
                };
            case 3:
            default:
                return {
                    subject: `Still open to connect, ${firstName}?`,
                    body: `Hi ${firstName},\n\nJust one last gentle follow-up from my side. If this is still something you would like to discuss, I would be happy to continue whenever the timing is right for you.\n\n${profileCtaEn}\n\nBest,\n${signature}`,
                };
        }
    }

    switch (params.stage) {
        case 1:
            return {
                subject: `Приятно ми беше да се свържем, ${firstName}`,
                body: `Здравей, ${firstName},\n\nБлагодаря ти, че остави контактите си${companyRefBg}. Пиша ти с кратко последващо съобщение, в случай че имаш въпроси или има нещо, с което мога да помогна още сега.\n\n${profileCtaBg}\n\nПоздрави,\n${signature}`,
            };
        case 2:
            return {
                subject: `Кратък follow-up от ${params.ownerName}`,
                body: `Здравей, ${firstName},\n\nИсках да се върна с кратко последващо съобщение след контакта ни${companyRefBg}.${hasLeadMessage ? ' Видях и това, което сподели, и с удоволствие бих помогнал с конкретна следваща стъпка.' : ' Ако темата все още е актуална за теб, мога да дам насока или повече информация.'}\n\n${profileCtaBg}\n\nПоздрави,\n${signature}`,
            };
        case 3:
        default:
            return {
                subject: `Да останем ли във връзка, ${firstName}?`,
                body: `Здравей, ${firstName},\n\nИзпращам едно последно ненатрапчиво последващо съобщение от моя страна. Ако темата все още е актуална, с удоволствие ще продължим разговора, когато е удобно за теб.\n\n${profileCtaBg}\n\nПоздрави,\n${signature}`,
            };
    }
}

export function parseFollowUpResponse(rawText: string): { subject: string; body: string } {
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    const jsonText = start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned;
    return JSON.parse(jsonText);
}

export function buildFollowUpEmail(params: {
    ownerName: string;
    subject: string;
    body: string;
    leadName: string;
    accent?: string;
    ctaUrl?: string;
    ctaLabel?: string;
}): string {
    const { body, accent = '#f59e0b', ctaUrl, ctaLabel } = params;
    const ctaHtml = ctaUrl
        ? `<div style="margin:24px 0 0;text-align:center">
            <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,${accent},${accent}cc);color:#111;text-decoration:none;font-size:13px;font-weight:900;letter-spacing:0.04em;padding:14px 22px;border-radius:999px">
              ${ctaLabel || 'View Profile'}
            </a>
          </div>`
        : '';

    return `<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td style="background:#0e1017;border:1px solid rgba(255,255,255,0.07);border-radius:20px 20px 0 0;padding:28px 36px 20px;text-align:center">
          <div style="display:inline-block;background:linear-gradient(135deg,${accent},${accent}cc);border-radius:10px;padding:8px 16px">
            <span style="font-size:12px;font-weight:900;color:#000;letter-spacing:0.15em;text-transform:uppercase">Ninja Card</span>
          </div>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,${accent},transparent)"></td></tr>
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:32px 36px">
          <p style="margin:0;font-size:14px;color:#ccc;line-height:1.9;white-space:pre-line">${body}</p>
          ${ctaHtml}
        </td></tr>
        <tr><td style="background:#080a0f;border:1px solid rgba(255,255,255,0.07);border-top:none;border-radius:0 0 20px 20px;padding:18px 36px;text-align:center">
          <p style="margin:0;font-size:10px;color:#333">Sent via Ninja Card</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
