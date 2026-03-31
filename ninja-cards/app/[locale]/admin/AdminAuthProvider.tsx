'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminSession } from '@/types/admin';
import { BASE_API_URL } from '@/utils/constants';

type AdminAuthContextValue = {
    adminUser: AdminSession | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

async function fetchAdminSession(setAdminUser: (value: AdminSession | null) => void) {
    const response = await fetch(`${BASE_API_URL}/api/admin/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        setAdminUser(null);
        return;
    }

    const data = await response.json();
    setAdminUser(data.adminUser);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'bg';

    const refresh = useCallback(async () => {
        try {
            await fetchAdminSession(setAdminUser);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const login = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${BASE_API_URL}/api/admin/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({ error: 'Login failed' }));
            return { ok: false, error: data.error || 'Login failed' };
        }

        const data = await response.json();
        setAdminUser(data.adminUser);
        return { ok: true };
    }, []);

    const logout = useCallback(async () => {
        await fetch(`${BASE_API_URL}/api/admin/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setAdminUser(null);
        router.push(`/${locale}/admin/login`);
    }, [locale, router]);

    const value = useMemo(
        () => ({ adminUser, loading, login, logout, refresh }),
        [adminUser, loading, login, logout, refresh],
    );

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
