'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthProvider';

export default function AdminLoginPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { login, adminUser, loading } = useAdminAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const locale = pathname?.split('/')[1] || 'bg';

    useEffect(() => {
        if (!loading && adminUser) {
            router.replace(`/${locale}/admin`);
        }
    }, [adminUser, loading, locale, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const result = await login(email, password);
            if (!result.ok) {
                setError(result.error || 'Unable to log in');
                return;
            }
            router.push(`/${locale}/admin`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,165,0,0.16),_transparent_28%),linear-gradient(135deg,#030507_0%,#081118_50%,#020304_100%)] px-4 py-16">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,109,119,0.08)_100%)]" />
            <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#091119]/90 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="mb-8 flex items-center gap-4">
                    <div className="rounded-2xl bg-orange/15 p-3 text-orange">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/35">Ninja Cards</p>
                        <h1 className="mt-2 text-3xl font-bold text-white">Admin Console</h1>
                    </div>
                </div>

                <p className="mb-8 text-sm leading-6 text-white/55">
                    Sign in with a dedicated admin account. Customer accounts do not have access to this workspace.
                </p>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-white/70">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                            placeholder="admin@ninjacardsnfc.com"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-white/70">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                            placeholder="Enter your admin password"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-2xl bg-gradient-to-r from-orange to-[#ff7b00] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </section>
    );
}
