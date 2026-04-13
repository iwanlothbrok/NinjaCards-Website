// File: /pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import cors from '@/utils/cors';

const prisma = new PrismaClient();
const USER_LOGIN_SELECT = {
    id: true,
    name: true,
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    company: true,
    position: true,
    phone1: true,
    phone2: true,
    email2: true,
    street1: true,
    street2: true,
    zipCode: true,
    city: true,
    state: true,
    country: true,
    bio: true,
    image: true,
    facebook: true,
    instagram: true,
    linkedin: true,
    twitter: true,
    tiktok: true,
    googleReview: true,
    revolut: true,
    website: true,
    viber: true,
    whatsapp: true,
    github: true,
    behance: true,
    youtube: true,
    paypal: true,
    trustpilot: true,
    qrCode: true,
    selectedColor: true,
    createdAt: true,
    updatedAt: true,
    calendly: true,
    discord: true,
    telegram: true,
    tripadvisor: true,
    pdf: true,
    coverImage: true,
    slug: true,
    isDirect: true,
    videoUrl: true,
    language: true,
} as const;

function getUserAuthSecret() {
    return (
        process.env.NEXTAUTH_SECRET ||
        process.env.ADMIN_AUTH_SECRET ||
        process.env.AUTH_SECRET ||
        process.env.JWT_SECRET ||
        null
    );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS (preflight may end here).
    if (cors(req, res)) return;

    try {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: USER_LOGIN_SELECT,
        });
        if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password' });

        let isPasswordValid = false;
        try {
            isPasswordValid = await compare(password, user.password);
        } catch (passwordError) {
            // Some legacy accounts may still have a non-bcrypt password value stored.
            console.warn('Falling back to plain-text password comparison during login:', passwordError);
            isPasswordValid = password === user.password;
        }
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        const authSecret = getUserAuthSecret();
        if (!authSecret)
            return res.status(500).json({ error: 'Internal server error: Missing secret' });

        const token = sign({ id: user.id, email: user.email }, authSecret, {
            expiresIn: '12h',
        });

        let safeUser: Omit<typeof user, 'password'>;
        try {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });
            const { password: _password, ...sanitizedUser } = updatedUser;
            safeUser = sanitizedUser;
        } catch (updateError) {
            // Keep login working when the deployment is ahead of the applied DB schema.
            console.warn('Failed to persist lastLoginAt during login:', updateError);
            const { password: _password, ...sanitizedUser } = user;
            safeUser = sanitizedUser;
        }

        // Cross-site request => require SameSite=None; Secure for the cookie to be accepted.
        // Note: This will still be blocked if the browser disables third-party cookies entirely.
        const cookie = serialize('token', token, {
            httpOnly: true, // why: reduce XSS risk
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 12,
            // Do NOT set `domain` here; it must default to the API host (vercel.app).
            // Setting a mismatched domain would break the cookie.
        });

        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({ token, user: safeUser });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
