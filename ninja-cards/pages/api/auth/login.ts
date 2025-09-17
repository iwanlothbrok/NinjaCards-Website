// File: /pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    try {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const { email, password } = req.body as { email: string; password: string };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password' });

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        if (!process.env.NEXTAUTH_SECRET) return res.status(500).json({ error: 'Internal server error: Missing secret' });

        // 12h access token
        const token = sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET, { expiresIn: '12h' });

        // Cookie mirrors JWT lifetime. Match attributes when clearing.
        const cookie = serialize('token', token, {
            httpOnly: true, // why: reduce XSS risk
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 12, // 12h
        });

        res.setHeader('Set-Cookie', cookie);
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}