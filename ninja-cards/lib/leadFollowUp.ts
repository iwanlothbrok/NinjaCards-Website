export type FollowUpStage = 1 | 2 | 3;

type BuildPromptParams = {
    stage: FollowUpStage;
    ownerName?: string;
    ownerPosition?: string;
    ownerCompany?: string;
    leadName: string;
    leadEmail: string;
    leadMessage?: string;
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

Stage instruction:
${stageInstruction}

Instructions:
1. Write a warm, professional follow-up email
2. If the lead left a message, reference it naturally — show you actually read it
3. If no message, write a genuine "great to meet you" style opening
4. The body must include: greeting (e.g. "Здравей, Иван," or "Hi John,"), 3-5 sentences of content, and a sign-off (e.g. "С уважение,\n${senderName}" or "Best,\n${senderName}")
5. End with one clear, soft, non-pushy call-to-action
6. Write in the same language the lead's message is in. If no message, default to Bulgarian.
7. Do NOT use placeholders like [Your Name] — use the actual data provided
8. Do not mention internal timing like "2 hours" or "7 days"
9. Sound like a real human, not a template. Vary sentence structure.

Respond ONLY with valid JSON, no other text:
{
  "subject": "email subject line",
  "body": "full email body including greeting and sign-off"
}`;
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
}): string {
    const { ownerName, body, leadName, accent = '#f59e0b' } = params;
    const firstName = leadName.split(' ')[0];

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
