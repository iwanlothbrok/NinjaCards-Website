// /pages/api/profile/optimize.ts
import type { NextApiRequest, NextApiResponse } from 'next';

import cors from '@/utils/cors';
import { calculateProfileScore } from '@/lib/profileScore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { profile } = req.body as { profile?: Record<string, any> };
    if (!profile) return res.status(400).json({ error: 'profile is required' });

    const safe = (val: any, maxLen = 150): string => {
        if (!val) return '';
        return String(val).replace(/[\r\n\t]+/g, ' ').replace(/"/g, "'").replace(/\\/g, '').trim().substring(0, maxLen);
    };

    const { score, completionPct, scoring, missing } = calculateProfileScore(profile);

    const filledSocial = [profile.linkedin, profile.instagram, profile.facebook, profile.website, profile.youtube, profile.tiktok, profile.twitter].filter(Boolean).length;
    const filledMessaging = [profile.whatsapp, profile.viber, profile.telegram, profile.discord].filter(Boolean).length;
    const filledBusiness = [profile.calendly, profile.googleReview, profile.revolut, profile.paypal].filter(Boolean).length;

    const name = safe(profile.name || [profile.firstName, profile.lastName].filter(Boolean).join(' '));
    const position = safe(profile.position);
    const company = safe(profile.company);
    const bio = safe(profile.bio, 200);

    const scoreBreakdown = `
- Identity (photo+cover+info): ${scoring.profilePhoto + scoring.coverImage + scoring.name + scoring.position + scoring.company + scoring.bio}/40 pts
  -> Profile photo: ${scoring.profilePhoto}/15, Cover image: ${scoring.coverImage}/10, Name/Position/Company/Bio: ${scoring.name + scoring.position + scoring.company + scoring.bio}/15
- Contact info: ${scoring.phone + scoring.email + scoring.whatsapp + scoring.phone2 + scoring.email2}/20 pts
- Social links: ${scoring.linkedin + scoring.website + scoring.instagram + scoring.facebook + scoring.youtube + scoring.tiktok + scoring.twitter}/25 pts
- Business tools: ${scoring.calendly + scoring.googleReview + scoring.videoUrl}/10 pts
- Extras: ${scoring.viber + scoring.telegram + scoring.revolut + scoring.trustpilot + scoring.pdf}/5 pts`;

    const prompt = `You are a digital business card expert helping professionals get more leads and clients.

This profile scored ${score}/100. Here is the exact breakdown:
${scoreBreakdown}

Profile:
- Name: ${name || 'NOT SET'}
- Position: ${position || 'NOT SET'}
- Company: ${company || 'NOT SET'}
- Bio: ${bio || 'NOT SET'}
- Profile photo: ${profile.image ? 'YES' : 'MISSING'}
- Cover image: ${profile.coverImage ? 'YES' : 'MISSING'}
- Phone: ${profile.phone1 ? 'YES' : 'MISSING'}
- WhatsApp: ${profile.whatsapp ? 'YES' : 'MISSING'}
- Social links: ${filledSocial}/7 (LinkedIn: ${profile.linkedin ? 'YES' : 'NO'}, Website: ${profile.website ? 'YES' : 'NO'}, Instagram: ${profile.instagram ? 'YES' : 'NO'})
- Messaging: ${filledMessaging}/4
- Business tools: ${filledBusiness}/4 (Calendly: ${profile.calendly ? 'YES' : 'NO'}, Google Review: ${profile.googleReview ? 'YES' : 'NO'})
- Video bio: ${profile.videoUrl ? 'YES' : 'NO'}

Missing (ordered by impact): ${Object.entries(missing).filter(([, value]) => value).map(([key]) => key).join(', ') || 'nothing critical'}

Write a verdict (max 100 chars) and exactly 5 recommendations ordered by impact.
Rules:
- Profile photo (15pts) and cover image (10pts) are the TOP priorities if missing - mention them first
- Be specific - reference what they have and what they're missing
- Each recommendation must explain the business impact clearly
- Write entirely in Bulgarian
- Descriptions under 90 chars, actions under 55 chars

Return ONLY valid JSON:
{"verdict":"...","recommendations":[{"priority":"high","icon":"camera","title":"...","description":"...","action":"..."}]}

Use priority "high" for items worth 8+ points that are missing, "medium" for 3-7pts, "low" for under 3pts.`;

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
                max_tokens: 1200,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            console.error('[profile-optimize] Claude error:', await response.json().catch(() => ({})));
            return res.status(500).json({ error: 'AI generation failed' });
        }

        const data = await response.json();
        const rawText: string = data.content?.[0]?.text ?? '';
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');

        if (start === -1 || end === -1 || end <= start) {
            console.error('[profile-optimize] No JSON:', rawText);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }

        let parsed: any;
        try {
            parsed = JSON.parse(rawText.slice(start, end + 1));
        } catch (e) {
            console.error('[profile-optimize] Parse error:', e);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }

        return res.status(200).json({
            score,
            completionPct,
            verdict: parsed.verdict,
            recommendations: parsed.recommendations,
        });
    } catch (err) {
        console.error('[profile-optimize]', err);
        return res.status(500).json({ error: 'Failed to analyze profile' });
    }
}
