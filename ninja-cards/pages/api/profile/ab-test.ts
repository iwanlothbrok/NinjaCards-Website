// /pages/api/profile/ab-test.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { profile, stats } = req.body as {
        profile?: Record<string, any>;
        stats?: {
            visits: number;
            leads: number;
            downloads: number;
            shares: number;
            clicks: number;
        };
    };

    if (!profile) return res.status(400).json({ error: 'profile is required' });

    const safe = (val: any, max = 100) =>
        !val ? '' : String(val).replace(/[\r\n"\\]/g, ' ').trim().substring(0, max);

    const name = safe(profile.name || [profile.firstName, profile.lastName].filter(Boolean).join(' '));
    const position = safe(profile.position);
    const company = safe(profile.company);
    const bio = safe(profile.bio, 200);

    const convRate = stats && stats.visits > 0
        ? ((stats.leads / stats.visits) * 100).toFixed(1)
        : '0';

    const prompt = `You are an expert in personal branding and digital business card optimization. 
Analyze this person's profile and suggest specific A/B test variants to improve their conversion rate.

Current profile:
- Name displayed: ${name}
- Position/Title: ${position || 'not set'}
- Company: ${company || 'not set'}  
- Bio: ${bio || 'not set'}

Performance stats (last 30 days):
- Profile visits: ${stats?.visits ?? 0}
- Leads generated: ${stats?.leads ?? 0}
- Conversion rate: ${convRate}%
- Downloads: ${stats?.downloads ?? 0}
- Social clicks: ${stats?.clicks ?? 0}

Generate exactly 3 A/B test suggestions. Each must have a "before" (current) and "after" (improved) version.
Focus on: job title wording, bio tone, call-to-action language.
Be specific — use their actual data. Write in Bulgarian.

Respond ONLY with valid JSON:
{
  "overallInsight": "one sentence about the biggest conversion opportunity",
  "tests": [
    {
      "id": "title",
      "field": "Позиция",
      "hypothesis": "why this change should improve conversions",
      "expectedImpact": "+15% повече контакти",
      "before": { "label": "Текуща версия", "value": "current title text" },
      "after":  { "label": "Тест версия",   "value": "improved title text" }
    }
  ]
}

Fields to test (pick the 3 most impactful based on their data):
- title: job title / position wording
- bio: bio text rewrite
- cta: call-to-action / tagline under name
Keep all values under 120 characters. No markdown in JSON values.`;

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
                max_tokens: 900,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            console.error('[ab-test] Claude error:', await response.json().catch(() => ({})));
            return res.status(500).json({ error: 'AI generation failed' });
        }

        const data = await response.json();
        const raw = data.content?.[0]?.text ?? '';

        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start === -1 || end === -1) return res.status(500).json({ error: 'Failed to parse response' });

        const parsed = JSON.parse(raw.slice(start, end + 1));
        return res.status(200).json(parsed);
    } catch (err) {
        console.error('[ab-test]', err);
        return res.status(500).json({ error: 'Failed to generate A/B tests' });
    }
}