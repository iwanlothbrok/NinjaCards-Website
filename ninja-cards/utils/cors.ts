import type { NextApiRequest, NextApiResponse } from 'next';

import { APP_SITE_URL, PUBLIC_SITE_URL } from './constants';

const allowedOrigins: Array<string | RegExp> = [
    PUBLIC_SITE_URL,
    APP_SITE_URL,
    // Helpful in dev:
    /^https?:\/\/localhost:\d+$/,
];

function isAllowed(origin: string | undefined): origin is string {
    if (!origin) return false;
    return allowedOrigins.some((o) => (o instanceof RegExp ? o.test(origin) : o === origin));
}

export default function cors(req: NextApiRequest, res: NextApiResponse): boolean {
    const origin = req.headers.origin as string | undefined;

    if (origin && isAllowed(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // why: required for cookies w/ credentials
    }

    // Reflect requested headers if present; otherwise use a safe default.
    const reqHeaders =
        (req.headers['access-control-request-headers'] as string | undefined) ||
        'Content-Type, Authorization';

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', reqHeaders);
    res.setHeader('Access-Control-Max-Age', '86400'); // cache preflight

    // Ensure proxies/CDNs don’t cache one origin for all.
    const varyValues = ['Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'];
    const existingVary = (res.getHeader('Vary') as string | string[] | undefined) || '';
    const varySet = new Set(
        (Array.isArray(existingVary) ? existingVary.join(',') : existingVary)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    );
    varyValues.forEach((v) => varySet.add(v));
    res.setHeader('Vary', Array.from(varySet).join(', '));

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return true;
    }
    return false;
}
