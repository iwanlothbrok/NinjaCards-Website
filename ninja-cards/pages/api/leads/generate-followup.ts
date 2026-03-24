import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';
import {
    buildFollowUpPrompt,
    normalizeFollowUpStage,
    parseFollowUpResponse,
} from '@/lib/leadFollowUp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ownerName, ownerPosition, ownerCompany, leadName, leadEmail, leadMessage, stage } = req.body as {
        ownerName?: string;
        ownerPosition?: string;
        ownerCompany?: string;
        leadName?: string;
        leadEmail?: string;
        leadMessage?: string;
        stage?: number;
    };

    if (!leadName || !leadEmail) {
        return res.status(400).json({ error: 'leadName and leadEmail are required' });
    }

    const prompt = buildFollowUpPrompt({
        stage: normalizeFollowUpStage(stage),
        ownerName,
        ownerPosition,
        ownerCompany,
        leadName,
        leadEmail,
        leadMessage,
    });

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
                max_tokens: 512,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            console.error('[generate-followup] Claude API error:', await response.json().catch(() => ({})));
            return res.status(500).json({ error: 'AI generation failed' });
        }

        const data = await response.json();
        const rawText = data.content?.[0]?.text ?? '';
        const parsed = parseFollowUpResponse(rawText);

        return res.status(200).json(parsed);
    } catch (err) {
        console.error('[generate-followup]', err);
        return res.status(500).json({ error: 'Failed to generate follow-up' });
    }
}
