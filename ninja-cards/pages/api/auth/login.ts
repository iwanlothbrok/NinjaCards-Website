// File: /pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS (preflight may end here).
    if (cors(req, res)) return;

    try {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const { email, password } = req.body as { email: string; password: string };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password' });

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        if (!process.env.NEXTAUTH_SECRET)
            return res.status(500).json({ error: 'Internal server error: Missing secret' });

        const token = sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET, {
            expiresIn: '12h',
        });

        // Cross-site request => require SameSite=None; Secure for the cookie to be accepted.
        // Note: This will still be blocked if the browser disables third-party cookies entirely.
        const cookie = serialize('token', token, {
            httpOnly: true, // why: mitigate XSS exfiltration
            secure: true, // must be true with SameSite=None
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 12,
            // Do NOT set `domain` here; it must default to the API host (vercel.app).
            // Setting a mismatched domain would break the cookie.
        });

        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}