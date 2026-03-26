// /pages/api/leads/categorize.ts
// Categorizes a lead message with AI and triggers auto follow-up scheduling
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { leadName, message, ownerPosition, ownerCompany, leadId } = req.body as {
        leadName?: string;
        message?: string;
        ownerPosition?: string;
        ownerCompany?: string;
        leadId?: string;
    };

    const prompt = `Categorize this lead for a professional's digital business card.

Owner context:
- Position: ${ownerPosition || 'not specified'}
- Company: ${ownerCompany || 'not specified'}

Lead:
- Name: ${leadName || 'unknown'}
- Message: "${message || 'no message'}"

Pick ONE category:
- hot: ready to buy/hire, mentions budget, urgent need, specific project
- warm: interested but exploring, asking about services/prices
- cold: just networking, no clear need
- partnership: wants to collaborate or partner
- job: looking for work or hiring
- other: unclear or unrelated

Respond ONLY with JSON: {"category":"hot","reason":"one sentence why"}`;

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
                max_tokens: 100,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            return res.status(200).json({ category: 'other' }); // fallback
        }

        const data = await response.json();
        const raw = data.content?.[0]?.text ?? '';
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        const parsed = JSON.parse(raw.slice(start, end + 1));

        return res.status(200).json({ category: parsed.category ?? 'other', reason: parsed.reason });
    } catch {
        return res.status(200).json({ category: 'other' }); // always return something
    }
}