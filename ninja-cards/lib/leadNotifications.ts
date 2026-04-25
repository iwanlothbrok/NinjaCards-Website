import { Resend } from 'resend';
import { buildPublicProfileUrl, buildPublicUrl } from '@/utils/constants';
import { sendEmail } from '@/pages/api/auth/mailgun';
import { createLeadVcfToken } from '@/lib/leadVcf';

type LeadNotificationOwner = {
    id: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    slug?: string | null;
    language?: string | null;
};

type LeadNotificationLead = {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
    createdAt: Date;
    source?: string | null;
    sourceDetail?: string | null;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function ownerDisplayName(owner: LeadNotificationOwner) {
    return owner.name || [owner.firstName, owner.lastName].filter(Boolean).join(' ') || 'NinjaCards user';
}

export async function sendNewLeadNotificationEmail(owner: LeadNotificationOwner, lead: LeadNotificationLead) {
    if (!owner.email) {
        return;
    }

    const locale = owner.language || 'bg';
    const vcfToken = createLeadVcfToken(lead.id, owner.id);
    const vcfUrl = buildPublicUrl(`/api/subscribed/vcf/${lead.id}?token=${encodeURIComponent(vcfToken)}`);
    const profileUrl = buildPublicProfileUrl({ locale, slug: owner.slug ?? undefined, userId: owner.id });
    const sourceLabel = [lead.source, lead.sourceDetail].filter(Boolean).join(' / ') || 'profile';

    const subject = `Нов лийд: ${lead.name}`;
    const text = [
        `Имаш нов лийд в NinjaCards.`,
        '',
        `Име: ${lead.name}`,
        `Телефон: ${lead.phone || 'няма'}`,
        `Имейл: ${lead.email || 'няма'}`,
        `Източник: ${sourceLabel}`,
        `Съобщение: ${lead.message || 'няма'}`,
        `Профил: ${profileUrl}`,
        `VCF: ${vcfUrl}`,
    ].join('\n');

    if (resend) {
        const html = `<!DOCTYPE html>
<html lang="bg">
  <body style="margin:0;padding:24px;background:#0b0f16;font-family:Arial,sans-serif;color:#f8fafc;">
    <div style="max-width:640px;margin:0 auto;background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;">
      <div style="height:4px;background:linear-gradient(90deg,#f59e0b,#fbbf24);"></div>
      <div style="padding:32px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#fbbf24;">NinjaCards</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">Имаш нов лийд</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#cbd5e1;">${ownerDisplayName(owner)}, току-що получи нов контакт през профила си.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0f172a;border-radius:14px;overflow:hidden;">
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;">Име</td><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:700;">${lead.name}</td></tr>
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;">Телефон</td><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">${lead.phone || 'няма'}</td></tr>
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;">Имейл</td><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">${lead.email || 'няма'}</td></tr>
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;">Източник</td><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">${sourceLabel}</td></tr>
          <tr><td style="padding:14px 18px;color:#94a3b8;vertical-align:top;">Съобщение</td><td style="padding:14px 18px;">${lead.message || 'няма'}</td></tr>
        </table>
        <div style="margin-top:28px;">
          <a href="${vcfUrl}" style="display:inline-block;padding:12px 20px;background:#f59e0b;color:#111827;text-decoration:none;border-radius:10px;font-weight:700;margin-right:12px;">Изтегли VCF</a>
          <a href="${profileUrl}" style="display:inline-block;padding:12px 20px;border:1px solid rgba(255,255,255,0.16);color:#f8fafc;text-decoration:none;border-radius:10px;font-weight:700;">Отвори профила</a>
        </div>
      </div>
    </div>
  </body>
</html>`;

        const result = await resend.emails.send({
            from: process.env.LEAD_NOTIFICATION_FROM_EMAIL || process.env.BILLING_FROM_EMAIL || 'NinjaCards <notifications@ninjacardsnfc.com>',
            to: owner.email,
            subject,
            text,
            html,
        });

        if (result.error) {
            throw new Error(`Resend error: ${result.error.message}`);
        }

        return;
    }

    await sendEmail(owner.email, subject, text);
}
