// /pages/api/cron/weekly-digest.ts
// Vercel Cron: runs every Monday at 08:00 Sofia time
// vercel.json: { "crons": [{ "path": "/api/cron/weekly-digest", "schedule": "0 6 * * 1" }] }

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Protect cron endpoint ────────────────────────────────────────────────────
// function isAuthorized(req: NextApiRequest): boolean {
//     // Vercel sets this header automatically for cron jobs
//     const cronSecret = req.headers['authorization'];
//     if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
//         return false;
//     }
//     return true;
// }
function isAuthorized(req: NextApiRequest): boolean {
    // Test mode — винаги пуска без secret
    if (req.query.test === '1') return true;
    const cronSecret = req.headers['authorization'];
    if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) return false;
    return true;
}


// ─── Generate AI insight via Claude ──────────────────────────────────────────
async function generateInsight(params: {
    name: string;
    position?: string | null;
    visits: number;
    downloads: number;
    shares: number;
    clicks: number;
    leads: number;
    prevVisits: number;
    prevLeads: number;
}): Promise<string> {
    const { name, position, visits, downloads, shares, clicks, leads, prevVisits, prevLeads } = params;

    const visitDelta = prevVisits > 0 ? Math.round(((visits - prevVisits) / prevVisits) * 100) : null;
    const leadDelta = prevLeads > 0 ? Math.round(((leads - prevLeads) / prevLeads) * 100) : null;

    const prompt = `You are a personal business coach. Write a short, motivating weekly insight for a professional based on their digital business card stats.

Person: ${name}${position ? `, ${position}` : ''}
This week: ${visits} profile visits, ${leads} leads, ${downloads} downloads, ${shares} shares, ${clicks} social clicks
Last week: ${prevVisits} visits, ${prevLeads} leads
${visitDelta !== null ? `Visit change: ${visitDelta > 0 ? '+' : ''}${visitDelta}%` : ''}
${leadDelta !== null ? `Lead change:  ${leadDelta > 0 ? '+' : ''}${leadDelta}%` : ''}

Write 2-3 sentences in Bulgarian. Be specific about their numbers. If things improved — celebrate it. If things dropped — give one actionable tip. End with a motivating sentence. No greeting, no sign-off. Just the insight text.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY!,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 200,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) return '';
        const data = await response.json();
        return data.content?.[0]?.text?.trim() ?? '';
    } catch {
        return '';
    }
}

// ─── Build HTML email ─────────────────────────────────────────────────────────
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
}): string {
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
  <title>Седмичен отчет — Ninja Card</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0e1017,#080a0f);border:1px solid rgba(255,255,255,0.07);border-radius:20px 20px 0 0;padding:36px 40px 28px;text-align:center">
          <div style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f59e0bcc);border-radius:12px;padding:10px 18px;margin-bottom:20px">
            <span style="font-size:13px;font-weight:900;color:#000;letter-spacing:0.15em;text-transform:uppercase">⚡ Ninja Card</span>
          </div>
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.02em">Седмичен отчет</h1>
          <p style="margin:8px 0 0;font-size:13px;color:#555;font-weight:500">${weekLabel}</p>
        </td></tr>

        <!-- Amber accent line -->
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#f59e0b,transparent)"></td></tr>

        <!-- Greeting -->
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:32px 40px 8px">
          <p style="margin:0;font-size:16px;color:#e0e0e0;font-weight:600">Здравей, ${firstName} 👋</p>
          <p style="margin:10px 0 0;font-size:13px;color:#666;line-height:1.6">Ето как се представи визитката ти тази седмица.</p>
        </td></tr>

        <!-- Stats -->
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:24px 40px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            ${stat('👁️', 'Посещения', visits, prevVisits)}
            ${stat('🎯', 'Лийдове', leads, prevLeads)}
            ${stat('⬇️', 'Изтегляния', downloads)}
            ${stat('🔗', 'Кликове', clicks)}
          </tr></table>
        </td></tr>

        <!-- AI Insight -->
        ${insight ? `
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:0 40px 28px">
          <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:20px 22px">
            <p style="margin:0 0 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;color:rgba(245,158,11,0.7)">✦ AI Анализ</p>
            <p style="margin:0;font-size:14px;color:#d4a94a;line-height:1.7;font-style:italic">${insight}</p>
          </div>
        </td></tr>` : ''}

        <!-- CTA -->
        <tr><td style="background:#0e1017;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:8px 40px 36px;text-align:center">
          <a href="${profileUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f59e0bcc);color:#000;font-weight:800;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.02em">
            Виж пълния Dashboard →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#080a0f;border:1px solid rgba(255,255,255,0.07);border-top:none;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#333;line-height:1.6">
            Ninja Card · Дигитални визитки<br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/settings" style="color:#555;text-decoration:underline">Спри седмичния отчет</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Week label e.g. "10 - 17 март 2026"
    const fmt = (d: Date) => d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' });
    const weekLabel = `${fmt(weekAgo)} – ${fmt(now)} ${now.getFullYear()}`;

    try {
        // Fetch all users with email + dashboard + events + leads
        const users = await prisma.user.findMany({
            where: { email: { not: null } },
            select: {
                id: true, name: true, firstName: true, lastName: true,
                email: true, position: true,
                dashboard: { select: { userId: true } },
                leads: {
                    select: { createdAt: true },
                },
            },
        });

        // Fetch events in bulk for this week and last week
        const events = await prisma.dashboardEvent.findMany({
            where: { timestamp: { gte: twoWeeks } },
            select: { userId: true, type: true, timestamp: true },
        });

        let sent = 0;
        let failed = 0;

        for (const user of users) {
            if (!user.email) continue;

            const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Приятел';

            // This week events
            const thisWeekEvents = events.filter(e => e.userId === user.id && new Date(e.timestamp) >= weekAgo);
            const lastWeekEvents = events.filter(e => e.userId === user.id && new Date(e.timestamp) < weekAgo);

            const count = (evts: typeof events, type: string) => evts.filter(e => e.type === type).length;

            const visits = count(thisWeekEvents, 'visit');
            const downloads = count(thisWeekEvents, 'download');
            const shares = count(thisWeekEvents, 'share');
            const clicks = count(thisWeekEvents, 'socialClick');
            const leads = user.leads.filter(l => new Date(l.createdAt) >= weekAgo).length;

            const prevVisits = count(lastWeekEvents, 'visit');
            const prevLeads = user.leads.filter(l => new Date(l.createdAt) >= twoWeeks && new Date(l.createdAt) < weekAgo).length;

            // Skip users with zero activity this week
            if (visits === 0 && leads === 0 && downloads === 0) continue;

            // Generate AI insight
            const insight = await generateInsight({ name, position: user.position, visits, downloads, shares, clicks, leads, prevVisits, prevLeads });

            const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/profile`;

            const html = buildEmail({ name, weekLabel, visits, downloads, shares, clicks, leads, prevVisits, prevLeads, insight, profileUrl });

            try {
                await resend.emails.send({
                    from: 'Ninja Card <reports@ninjacardsnfc.com>',
                    to: user.email,
                    subject: `📊 Седмичен отчет — ${visits} посещения, ${leads} лийда`,
                    html,
                });
                sent++;
            } catch (emailErr) {
                console.error(`[weekly-digest] Failed to send to ${user.email}:`, emailErr);
                failed++;
            }

            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        }

        console.log(`[weekly-digest] Done: ${sent} sent, ${failed} failed`);
        return res.status(200).json({ sent, failed, weekLabel });
    } catch (err) {
        console.error('[weekly-digest]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}