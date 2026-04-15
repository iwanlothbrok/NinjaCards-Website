import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

function buildInsight(params: {
    visits: number;
    downloads: number;
    shares: number;
    clicks: number;
    leads: number;
    prevVisits: number;
    prevLeads: number;
}) {
    const { visits, downloads, shares, clicks, leads, prevVisits, prevLeads } = params;
    const visitDelta = prevVisits > 0 ? Math.round(((visits - prevVisits) / prevVisits) * 100) : null;
    const leadDelta = prevLeads > 0 ? Math.round(((leads - prevLeads) / prevLeads) * 100) : null;

    if (visits === 0 && leads === 0) {
        return 'През последните две седмици няма отчетена активност. Опитай да споделиш картата по-често, за да вкараш нов трафик.';
    }

    if ((visitDelta ?? 0) > 0 || (leadDelta ?? 0) > 0) {
        return `Има положително движение през последните две седмици${visitDelta !== null ? `, с промяна в посещенията от ${visitDelta > 0 ? '+' : ''}${visitDelta}%` : ''}. Продължавай да насочваш хората към картата си и тествай ясен follow-up след всеки нов контакт.`;
    }

    if ((visitDelta ?? 0) < 0 || (leadDelta ?? 0) < 0) {
        return `Има лек спад спрямо предходния период${visitDelta !== null ? ` (${visitDelta} % посещения)` : ''}. Един бърз начин да върнеш темпото е да споделиш картата в актуален разговор, имейл подпис или социален профил.`;
    }

    return `Имаш стабилна активност през последните две седмици с ${visits} посещения и ${leads} лийда. Следващата добра стъпка е да тестваш едно малко подобрение по картата и да проследиш как влияе на резултатите.`;
}

function buildEmail(params: {
    name: string;
    weekLabel: string;
    visits: number;
    downloads: number;
    shares: number;
    clicks: number;
    leads: number;
    prevVisits: number;
    prevLeads: number;
    insight: string;
    profileUrl: string;
}) {
    const { name, weekLabel, visits, downloads, shares, clicks, leads, prevVisits, prevLeads, insight, profileUrl } = params;
    const firstName = name.split(' ')[0];

    const delta = (curr: number, prev: number) => {
        if (prev === 0) return '';
        const pct = Math.round(((curr - prev) / prev) * 100);
        if (pct === 0) return '';
        const color = pct > 0 ? '#22c55e' : '#ef4444';
        const sign = pct > 0 ? '▲' : '▼';
        return `<span style="color:${color};font-size:11px;font-weight:700;margin-left:6px">${sign} ${Math.abs(pct)}%</span>`;
    };

    const stat = (icon: string, label: string, value: number, prev = 0) => `
        <td style="padding:0 8px;text-align:center">
            <div style="background:#111318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 12px;min-width:90px">
                <div style="font-size:22px;margin-bottom:4px">${icon}</div>
                <div style="font-size:24px;font-weight:800;color:#ffffff;font-family:'Helvetica Neue',sans-serif">
                    ${value}${delta(value, prev)}
                </div>
                <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-top:4px">${label}</div>
            </div>
        </td>`;

    return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Двуседмичен отчет — Ninja Card</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#0e1017,#080a0f);border:1px solid rgba(255,255,255,0.07);border-radius:20px 20px 0 0;padding:36px 40px 28px;text-align:center">
          <div style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f59e0bcc);border-radius:12px;padding:10px 18px;margin-bottom:20px">
            <span style="font-size:13px;font-weight:900;color:#000;letter-spacing:0.15em;text-transform:uppercase">⚡ Ninja Card</span>
          </div>
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.02em">Двуседмичен отчет</h1>
          <p style="margin:8px 0 0;font-size:13px;color:#555;font-weight:500">${weekLabel}</p>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#f59e0b,transparent)"></td></tr>
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:32px 40px 8px">
          <p style="margin:0;font-size:16px;color:#e0e0e0;font-weight:600">Здравей, ${firstName} 👋</p>
          <p style="margin:10px 0 0;font-size:13px;color:#666;line-height:1.6">Ето как се представи визитката ти през последните две седмици.</p>
        </td></tr>
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:24px 40px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            ${stat('👁️', 'Посещения', visits, prevVisits)}
            ${stat('🎯', 'Лийдове', leads, prevLeads)}
            ${stat('⬇️', 'Изтегляния', downloads)}
            ${stat('🔗', 'Кликове', clicks + shares)}
          </tr></table>
        </td></tr>
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:0 40px 28px">
          <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:20px 22px">
            <p style="margin:0 0 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;color:rgba(245,158,11,0.7)">✦ Insight</p>
            <p style="margin:0;font-size:14px;color:#d4a94a;line-height:1.7;font-style:italic">${insight}</p>
          </div>
        </td></tr>
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:8px 40px 36px;text-align:center">
          <a href="${profileUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f59e0bcc);color:#000;font-weight:800;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.02em">
            Виж dashboard-а →
          </a>
        </td></tr>
        <tr><td style="background:#080a0f;border:1px solid rgba(255,255,255,0.07);border-top:none;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#333;line-height:1.6">Ninja Card · Дигитални визитки</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function processWeeklyDigest(params?: { limit?: number }) {
    const prisma = new PrismaClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const limit = params?.limit ?? 100;
    const fmt = (d: Date) => d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' });
    const weekLabel = `${fmt(twoWeeksAgo)} – ${fmt(now)} ${now.getFullYear()}`;

    try {
        const users = await prisma.user.findMany({
            where: { email: { not: null } },
            select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                position: true,
                leads: { select: { createdAt: true } },
            },
            take: limit,
        });

        const events = await prisma.dashboardEvent.findMany({
            where: { timestamp: { gte: fourWeeksAgo } },
            select: { userId: true, type: true, timestamp: true },
        });

        let checked = 0;
        let sent = 0;
        let failed = 0;
        const processedUserIds: string[] = [];

        for (const user of users) {
            if (!user.email) continue;

            checked++;
            const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Приятел';
            const thisPeriodEvents = events.filter((e) => e.userId === user.id && new Date(e.timestamp) >= twoWeeksAgo);
            const previousPeriodEvents = events.filter((e) => e.userId === user.id && new Date(e.timestamp) < twoWeeksAgo);
            const count = (evts: typeof events, type: string) => evts.filter((e) => e.type === type).length;

            const visits = count(thisPeriodEvents, 'visit');
            const downloads = count(thisPeriodEvents, 'download');
            const shares = count(thisPeriodEvents, 'share');
            const clicks = count(thisPeriodEvents, 'socialClick');
            const leads = user.leads.filter((l) => new Date(l.createdAt) >= twoWeeksAgo).length;
            const prevVisits = count(previousPeriodEvents, 'visit');
            const prevLeads = user.leads.filter((l) => new Date(l.createdAt) >= fourWeeksAgo && new Date(l.createdAt) < twoWeeksAgo).length;

            if (visits === 0 && leads === 0 && downloads === 0 && shares === 0 && clicks === 0) {
                continue;
            }

            const insight = buildInsight({ visits, downloads, shares, clicks, leads, prevVisits, prevLeads });
            const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || process.env.FRONTEND_URL || 'https://app.ninjacardsnfc.com'}/profile`;
            const html = buildEmail({
                name,
                weekLabel,
                visits,
                downloads,
                shares,
                clicks,
                leads,
                prevVisits,
                prevLeads,
                insight,
                profileUrl,
            });

            try {
                await resend.emails.send({
                    from: 'Ninja Card <reports@ninjacardsnfc.com>',
                    to: user.email,
                    subject: `📊 Двуседмичен отчет — ${visits} посещения, ${leads} лийда`,
                    html,
                });
                sent++;
                processedUserIds.push(user.id);
            } catch (error) {
                failed++;
                console.error(`[weekly-digest] Failed to send to ${user.email}:`, error);
            }
        }

        return { checked, sent, failed, processedUserIds, weekLabel };
    } finally {
        await prisma.$disconnect();
    }
}
