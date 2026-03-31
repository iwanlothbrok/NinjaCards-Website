import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ── Search Bing Images with a single query, returns up to `limit` URLs ────────
async function bingImageSearch(query: string, limit = 8): Promise<string[]> {
    try {
        const q = encodeURIComponent(query);
        const r = await fetch(
            `https://www.bing.com/images/search?q=${q}&form=HDRSC2&first=1`,
            {
                headers: {
                    'User-Agent': UA,
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': 'https://www.bing.com/',
                    'Cache-Control': 'no-cache',
                },
                signal: AbortSignal.timeout(8000),
            }
        );
        if (!r.ok) return [];
        const html = await r.text();
        const urls: string[] = [];

        // Bing embeds image data as JSON — try multiple known field names
        const patterns = [
            /"murl":"(https?[^"]+)"/g,
            /"imgurl":"(https?[^"]+)"/g,
            /mediaurl=(https?[^&">\s]+)/g,
        ];
        for (const re of patterns) {
            let m: RegExpExecArray | null;
            re.lastIndex = 0;
            while ((m = re.exec(html)) !== null) {
                // Unescape JSON unicode sequences first, then percent-decode
                let raw = m[1]
                    .replace(/\\u0026/g, '&')
                    .replace(/\\u003d/g, '=')
                    .replace(/\\u002f/g, '/')
                    .replace(/\\u003a/g, ':');
                // Bing sometimes stores URLs as percent-encoded strings
                try { raw = decodeURIComponent(raw); } catch { /* keep as-is */ }
                if (raw.startsWith('http') && /\.(jpe?g|png|webp)/i.test(raw) && !urls.includes(raw)) {
                    urls.push(raw);
                    if (urls.length >= limit) return urls;
                }
            }
            if (urls.length >= limit) break;
        }
        return urls;
    } catch {
        return [];
    }
}

// ── Find real company domain via Bing web search ──────────────────────────────
async function findCompanyDomain(company: string): Promise<string> {
    const SKIP = new Set(['bing.com', 'microsoft.com', 'msn.com', 'google.com',
        'wikipedia.org', 'linkedin.com', 'facebook.com', 'instagram.com',
        'youtube.com', 'twitter.com', 'x.com']);
    try {
        const q = encodeURIComponent(`${company} official website`);
        const r = await fetch(`https://www.bing.com/search?q=${q}&form=QBLH&count=5`, {
            headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', 'Accept': 'text/html' },
            signal: AbortSignal.timeout(6000),
        });
        if (!r.ok) return '';
        const html = await r.text();

        // <cite> tags contain the display URL of each organic result
        const citeRe = /<cite[^>]*>(https?:\/\/)?([^<\s/]+)/gi;
        let m: RegExpExecArray | null;
        while ((m = citeRe.exec(html)) !== null) {
            const domain = m[2].replace(/^www\./, '').toLowerCase();
            if (domain && !SKIP.has(domain) && domain.includes('.')) {
                return domain;
            }
        }
        return '';
    } catch {
        return '';
    }
}

// ── Generate avatar fallback (always works) ───────────────────────────────────
async function generateAvatarBase64(name: string): Promise<string> {
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=f97316&color=ffffff&bold=true&font-size=0.38`;
    try {
        const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(6000) });
        if (!r.ok) return '';
        return Buffer.from(await r.arrayBuffer()).toString('base64');
    } catch { return ''; }
}

// ── LinkedIn og:image ─────────────────────────────────────────────────────────
function extractOgImage(html: string): string {
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
           ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const url = m?.[1] ?? '';
    return url.startsWith('http') && !url.includes('placeholder') && !url.includes('logo') ? url : '';
}

// ── Extract domain from a URL string ─────────────────────────────────────────
function toDomain(website: string): string {
    try {
        return new URL(website.startsWith('http') ? website : `https://${website}`)
            .hostname.replace(/^www\./, '');
    } catch { return ''; }
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'POST') return res.status(405).end();

    const { name, linkedinUrl, companyHint, positionHint } = req.body as {
        name?: string; linkedinUrl?: string; companyHint?: string; positionHint?: string;
    };
    if (!name?.trim()) return res.status(400).json({ error: 'Името е задължително' });

    const nameClean = name.trim();
    const company = companyHint?.trim() ?? '';
    const position = positionHint?.trim() ?? '';

    // ── 1. LinkedIn fetch + avatar in parallel ────────────────────────────────
    const [linkedinResult, avatarBase64] = await Promise.all([
        linkedinUrl
            ? fetch(linkedinUrl, {
                headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'bg,en-US;q=0.7' },
                signal: AbortSignal.timeout(8000),
              }).then(r => r.ok ? r.text() : '').catch(() => '')
            : Promise.resolve(''),
        generateAvatarBase64(nameClean),
    ]);

    let linkedinContent = '';
    let linkedinImageUrl = '';
    if (linkedinResult) {
        linkedinImageUrl = extractOgImage(linkedinResult);
        linkedinContent = linkedinResult
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 4000);
    }

    // ── 2. Claude AI — runs with LinkedIn data; also asked to return company URL ─
    const prompt = `You are a profile data extractor for Ninja Cards — a Bulgarian NFC business card platform.

INPUT:
- Full name: ${nameClean}
- LinkedIn URL: ${linkedinUrl || 'not provided'}
${company ? `- Company hint: ${company}` : ''}
${position ? `- Position hint: ${position}` : ''}
${linkedinContent ? `\nLinkedIn page text (may be partial):\n${linkedinContent}` : ''}

Return a JSON object. Use empty string when unknown.

CRITICAL: For "website" return the real company website URL you know from your training data
(e.g. "https://google.com", "https://apple.com", "https://ninjacardsnfc.com").
This is used to find the company logo — accuracy matters.

{
  "firstName": "first name",
  "lastName": "last name",
  "name": "full name for the card",
  "position": "professional title",
  "company": "company name",
  "bio": "2-3 sentence professional bio in Bulgarian, first person",
  "website": "company website URL — fill if you know the company",
  "linkedin": "${linkedinUrl || ''}",
  "city": "city",
  "country": "България",
  "slug": "latinized lowercase slug e.g. ivan-petrov (a-z 0-9 - only, 3-40 chars)"
}

Return ONLY the raw JSON, no markdown.`;

    let profile: Record<string, string> = {};

    try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
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

        if (!aiRes.ok) return res.status(500).json({ error: 'AI generation failed' });
        const aiData = await aiRes.json();
        const rawText: string = aiData.content?.[0]?.text ?? '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return res.status(500).json({ error: 'Invalid AI response' });
        profile = JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('[ai-profile-extract] AI error', err);
        return res.status(500).json({ error: 'Failed to generate profile' });
    }

    const resolvedName = profile.name || nameClean;
    const resolvedCompany = profile.company || company;
    const resolvedPosition = profile.position || position;

    // ── 3. Image searches (3 queries) + company domain search — all parallel ──
    //
    // Query strategy (most precise → broadest):
    //   Q1: "Full Name" "Company"           — exact phrase match, best precision
    //   Q2: "Full Name" Position Company LinkedIn  — adds role + platform hint
    //   Q3: Full Name Company               — broadest fallback
    const q1 = `"${resolvedName}" "${resolvedCompany}"`;
    const q2 = `"${resolvedName}" ${resolvedPosition} ${resolvedCompany} LinkedIn`;
    const q3 = `${resolvedName} ${resolvedCompany}`;

    // Logo: prefer AI-returned website, otherwise search Bing for the company domain
    const aiDomain = profile.website ? toDomain(profile.website) : '';

    const logoQ1 = `"${resolvedCompany}" logo`;
    const logoQ2 = `${resolvedCompany} logo transparent`;

    const [imgs1, imgs2, imgs3, searchedDomain, logoImgs1, logoImgs2] = await Promise.all([
        bingImageSearch(q1, 8),
        bingImageSearch(q2, 6),
        bingImageSearch(q3, 6),
        !aiDomain && resolvedCompany ? findCompanyDomain(resolvedCompany) : Promise.resolve(''),
        resolvedCompany ? bingImageSearch(logoQ1, 6) : Promise.resolve([]),
        resolvedCompany ? bingImageSearch(logoQ2, 6) : Promise.resolve([]),
    ]);

    // Merge & deduplicate person images
    const seenPerson = new Set<string>();
    const personImageUrls: string[] = [];
    if (linkedinImageUrl) { seenPerson.add(linkedinImageUrl); personImageUrls.push(linkedinImageUrl); }
    for (const url of [...imgs1, ...imgs2, ...imgs3]) {
        if (!seenPerson.has(url) && personImageUrls.length < 12) {
            seenPerson.add(url);
            personImageUrls.push(url);
        }
    }

    // Resolve logo domain: AI website > Bing search > nothing
    const logoDomain = aiDomain || searchedDomain;
    const clearbitUrl = logoDomain ? `https://logo.clearbit.com/${logoDomain}` : '';

    // Build logo candidates: Clearbit first (most reliable), then Bing results
    const seenLogo = new Set<string>();
    const logoUrls: string[] = [];
    if (clearbitUrl) { seenLogo.add(clearbitUrl); logoUrls.push(clearbitUrl); }
    for (const url of [...logoImgs1, ...logoImgs2]) {
        if (!seenLogo.has(url) && logoUrls.length < 8) {
            seenLogo.add(url);
            logoUrls.push(url);
        }
    }

    return res.status(200).json({
        ...profile,
        personImageUrls,
        logoUrls,          // array — used in cover picker
        logoUrl: clearbitUrl, // kept for backwards compat
        avatarBase64,
    });
}
