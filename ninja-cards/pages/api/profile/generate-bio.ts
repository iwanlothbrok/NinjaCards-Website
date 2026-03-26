// /pages/api/profile/generate-bio.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, position, company, links } = req.body as {
        name?: string;
        position?: string;
        company?: string;
        links?: Record<string, string>;
    };

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const linkContext = links
        ? Object.entries(links)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')
        : '';

    const prompt = `You are a professional bio writer. Analyze the person's profile and write 3 bio variants.

Person details:
- Name: ${name}
- Position: ${position || 'Not specified'}
- Company: ${company || 'Not specified'}
${linkContext ? `- Social/Professional links:\n${linkContext}` : ''}

Instructions:
1. Analyze what kind of professional this person likely is based on their position, company, and links
2. Write 3 bio variants for EACH language (Bulgarian and English) — total 6 bios
3. Each variant should have a different tone:
   - Variant 1: Professional & formal (LinkedIn style)
   - Variant 2: Warm & approachable (personal brand style)
   - Variant 3: Bold & punchy (modern personal brand, 1-2 sentences max)
4. Each bio should be 1-3 sentences. No hashtags. No emojis.
5. Include subtle insights from the links if provided (e.g. if they have GitHub — mention tech, if Instagram — mention creativity, etc.)

Respond ONLY with valid JSON in this exact format, no other text:
{
  "analysis": "2-3 sentence insight about who this person is professionally",
  "bg": [
    { "tone": "Професионален", "text": "..." },
    { "tone": "Приятелски", "text": "..." },
    { "tone": "Кратък и силен", "text": "..." }
  ],
  "en": [
    { "tone": "Professional", "text": "..." },
    { "tone": "Approachable", "text": "..." },
    { "tone": "Bold", "text": "..." }
  ]
}`;

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
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('[generate-bio] Claude API error:', err);
            return res.status(500).json({ error: 'AI generation failed' });
        }

        const data = await response.json();
        const rawText = data.content?.[0]?.text ?? '';

        const cleaned = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return res.status(200).json(parsed);
    } catch (err) {
        console.error('[generate-bio]', err);
        return res.status(500).json({ error: 'Failed to generate bio' });
    }
}