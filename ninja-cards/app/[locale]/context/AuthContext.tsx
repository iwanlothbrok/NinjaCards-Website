// File: /app/[locale]/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT payload (for exp)
function parseJwt<T = Record<string, unknown>>(token: string): (T & { exp?: number }) | null {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        const decoded = decodeURIComponent(
            json.split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')
        );
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

function msUntilExpiry(token: string | null): number {
    if (!token) return 0;
    const payload = parseJwt<{ exp?: number }>(token);
    if (!payload?.exp) return 0;
    return Math.max(0, payload.exp * 1000 - Date.now());
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Tracks if this tab was ever logged in (to avoid redirecting guests on storage events)
    const wasLoggedInRef = useRef(false);
    useEffect(() => {
        wasLoggedInRef.current = !!user;
    }, [user]);

    // Single-shot auto-logout timer
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };
    const scheduleAutoLogout = (token: string) => {
        clearLogoutTimer();
        const ms = msUntilExpiry(token);
        if (ms <= 0) {
            // Token already expired → logout once (only when actually logged in)
            void logout();
            return;
        }
        // 12h token is ~43,200,000 ms — setTimeout can handle that fine
        logoutTimerRef.current = setTimeout(() => { void logout(); }, ms);
    };

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        scheduleAutoLogout(token);
        router.push('/');
    };

    const logout = async () => {
        try {
            await fetch(`${BASE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch {/* ignore */ }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearLogoutTimer();
        setUser(null);
        router.push('/login');
    };

    // Initial hydration
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            setUser(null);                 // guest session
            setLoading(false);
            return;
        }

        const left = msUntilExpiry(token);
        if (left <= 0) {
            // Token exists but expired → logout to clean cookie + localStorage
            void logout();
            setLoading(false);
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }

        scheduleAutoLogout(token);
        setLoading(false);
    }, []); // mount only

    // Re-check on tab focus/visibility (ONLY if logged in)
    useEffect(() => {
        const check = () => {
            const token = localStorage.getItem('token');
            if (!token) return; // 🔒 guests: do nothing
            const left = msUntilExpiry(token);
            if (left <= 0) void logout();
            else scheduleAutoLogout(token);
        };
        window.addEventListener('focus', check);
        window.addEventListener('visibilitychange', check);
        return () => {
            window.removeEventListener('focus', check);
            window.removeEventListener('visibilitychange', check);
        };
    }, []); // mount only

    // Cross-tab sync: only redirect if we were logged in in this tab
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'token' && !e.newValue) {
                setUser(null);
                if (wasLoggedInRef.current) router.push('/login'); // guests: no redirect
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [router]);

    // Global fetch wrapper: auto-logout on 401 only if we have a token
    useEffect(() => {
        const original = window.fetch.bind(window);
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const res = await original(input, { credentials: 'include', ...init });
            if (res.status === 401) {
                const token = localStorage.getItem('token');
                if (token) await logout();
            }
            return res;
        };
        return () => { window.fetch = original; };
    }, []); // mount only

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <AuthContext.Provider value={{ user, login, logout, setUser }}>
                {loading ? (
                    <div className="flex justify-center items-center py-96 ">
                        <img src="/load.gif" alt="Loading..." className="w-40 h-40" />
                    </div>
                ) : (
                    children
                )}
            </AuthContext.Provider>
        </div>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
