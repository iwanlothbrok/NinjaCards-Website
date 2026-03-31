import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/utils/cors';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    if (req.method !== 'POST') return res.status(405).end();

    const { url } = req.body as { url?: string };
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: 'Invalid URL' });

    try {
        const r = await fetch(url, {
            headers: { 'User-Agent': UA, 'Referer': 'https://www.google.com/' },
            signal: AbortSignal.timeout(10000),
        });
        if (!r.ok) return res.status(400).json({ error: 'Fetch failed' });

        const mime = r.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
        if (!mime.startsWith('image/')) return res.status(400).json({ error: 'Not an image' });

        const base64 = Buffer.from(await r.arrayBuffer()).toString('base64');
        return res.status(200).json({ base64, mime });
    } catch (err) {
        console.error('[proxy-image]', err);
        return res.status(500).json({ error: 'Failed to fetch image' });
    }
}
