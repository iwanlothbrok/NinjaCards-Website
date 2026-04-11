import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import { sign, verify } from 'jsonwebtoken';
import { AdminStatus, type AdminUser as PrismaAdminUser } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuthShared';
const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 12;

type AdminJwtPayload = {
    id: string;
    email: string;
    role: string;
    status: string;
};

export function getAdminAuthSecret() {
    const secret = process.env.ADMIN_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error('Missing admin auth secret');
    }
    return secret;
}

export function toSafeAdminUser(adminUser: PrismaAdminUser) {
    return {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        status: adminUser.status,
        lastLoginAt: adminUser.lastLoginAt?.toISOString() ?? null,
        createdAt: adminUser.createdAt.toISOString(),
    };
}

export function signAdminToken(adminUser: PrismaAdminUser) {
    return sign(
        {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
            status: adminUser.status,
        },
        getAdminAuthSecret(),
        { expiresIn: `${ADMIN_TOKEN_TTL_SECONDS}s` },
    );
}

export function serializeAdminCookie(token: string) {
    return serialize(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ADMIN_TOKEN_TTL_SECONDS,
    });
}

export function clearAdminCookie() {
    return serialize(ADMIN_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}

export function getAdminTokenFromRequest(req: NextApiRequest) {
    const cookies = parse(req.headers.cookie || '');
    return cookies[ADMIN_COOKIE_NAME] || null;
}

export async function getAdminUserFromRequest(req: NextApiRequest) {
    const token = getAdminTokenFromRequest(req);
    if (!token) return null;

    try {
        const payload = verify(token, getAdminAuthSecret()) as AdminJwtPayload;
        const adminUser = await prisma.adminUser.findUnique({ where: { id: payload.id } });
        if (!adminUser || adminUser.status !== AdminStatus.ACTIVE) {
            return null;
        }
        return adminUser;
    } catch {
        return null;
    }
}

export async function requireAdmin(
    req: NextApiRequest,
    res: NextApiResponse,
    allowedRoles?: string[],
) {
    const adminUser = await getAdminUserFromRequest(req);
    if (!adminUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(adminUser.role)) {
        res.status(403).json({ error: 'Forbidden' });
        return null;
    }

    return adminUser;
}
