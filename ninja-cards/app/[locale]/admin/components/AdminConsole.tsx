'use client';

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Crown, LayoutDashboard, Loader2, LogOut, Search, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthProvider';
import { BASE_API_URL } from '@/utils/constants';

type ModuleKey = 'overview' | 'users' | 'revenue' | 'crm' | 'admins';

const modules: Array<{ key: ModuleKey; label: string; icon: ComponentType<{ className?: string }>; description: string }> = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Growth, revenue, engagement, and funnel health.' },
    { key: 'users', label: 'Users', icon: Users, description: 'Customer accounts, plans, profile quality, and card activity.' },
    { key: 'revenue', label: 'Revenue', icon: CreditCard, description: 'Subscription status, retention risk, and invoice flow.' },
    { key: 'crm', label: 'Leads & CRM', icon: TrendingUp, description: 'Lead flow, deals, meetings, and follow-ups.' },
    { key: 'admins', label: 'Admins', icon: ShieldCheck, description: 'Separate admin identities and roles.' },
];

const fmtDate = (value?: string | null) =>
    value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Never';

const fmtMoney = (value = 0, currency = 'EUR') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value / 100);

const fmtAction = (value?: string | null) => {
    if (!value) return 'No card activity yet';

    const labels: Record<string, string> = {
        visit: 'Profile visit',
        share: 'Profile share',
        download: 'VCF download',
        socialClick: 'Social click',
    };

    return labels[value] || value;
};

const getStatusTone = (status?: string | null): 'neutral' | 'green' | 'orange' | 'blue' | 'red' => {
    if (!status) return 'neutral';
    if (['active', 'ACTIVE', 'trialing'].includes(status)) return 'green';
    if (['past_due', 'unpaid', 'DISABLED'].includes(status)) return 'red';
    if (['cancelled', 'paused'].includes(status)) return 'orange';
    return 'blue';
};

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'orange' | 'blue' | 'red' }) {
    const tones = {
        neutral: 'bg-white/10 text-white/70',
        green: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
        orange: 'bg-orange/15 text-orange border border-orange/20',
        blue: 'bg-teil/20 text-cyan-200 border border-teil/30',
        red: 'bg-red-500/15 text-red-300 border border-red-500/20',
    };

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tones[tone]}`}>{children}</span>;
}

function Card({ title, value, detail, accent = 'text-orange' }: { title: string; value: string; detail: string; accent?: string }) {
    return (
        <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <p className="text-sm uppercase tracking-[0.24em] text-white/45">{title}</p>
            <p className={`mt-4 text-4xl font-bold ${accent}`}>{value}</p>
            <p className="mt-3 text-sm text-white/55">{detail}</p>
        </div>
    );
}

function Section({ title, subtitle, actions, children }: { title: string; subtitle: string; actions?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-3xl border border-white/8 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/6 px-6 py-5">
                <div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <p className="mt-1 text-sm text-white/50">{subtitle}</p>
                </div>
                {actions}
            </div>
            <div className="p-6">{children}</div>
        </section>
    );
}

export default function AdminConsole() {
    const { adminUser, loading, logout } = useAdminAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'bg';

    const requestedModule = searchParams?.get('module');
    const activeModule = modules.some((module) => module.key === requestedModule) ? (requestedModule as ModuleKey) : 'overview';
    const [query, setQuery] = useState('');
    const [dashboard, setDashboard] = useState<any>(null);
    const [usersData, setUsersData] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [crmData, setCrmData] = useState<any>(null);
    const [adminUsersData, setAdminUsersData] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !adminUser) router.replace(`/${locale}/admin/login`);
    }, [adminUser, loading, locale, router]);

    useEffect(() => {
        if (!adminUser) return;
        let ignore = false;
        setPageLoading(true);
        setError(null);

        Promise.all([
            fetch(`${BASE_API_URL}/api/admin/dashboard`, { credentials: 'include', cache: 'no-store' }),
            fetch(`${BASE_API_URL}/api/admin/users?q=${encodeURIComponent(query)}`, { credentials: 'include', cache: 'no-store' }),
            fetch(`${BASE_API_URL}/api/admin/revenue`, { credentials: 'include', cache: 'no-store' }),
            fetch(`${BASE_API_URL}/api/admin/crm`, { credentials: 'include', cache: 'no-store' }),
            fetch(`${BASE_API_URL}/api/admin/admin-users`, { credentials: 'include', cache: 'no-store' }),
        ])
            .then(async (responses) => {
                if (!responses.every((res) => res.ok)) throw new Error('Failed to load admin console data');
                const [dash, users, revenue, crm, admins] = await Promise.all(responses.map((res) => res.json()));
                if (!ignore) {
                    setDashboard(dash);
                    setUsersData(users);
                    setRevenueData(revenue);
                    setCrmData(crm);
                    setAdminUsersData(admins);
                }
            })
            .catch((err) => !ignore && setError(err instanceof Error ? err.message : 'Failed to load admin console'))
            .finally(() => !ignore && setPageLoading(false));

        return () => {
            ignore = true;
        };
    }, [adminUser, query]);

    const setModule = (module: ModuleKey) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('module', module);
        router.push(`${pathname}?${params.toString()}`);
    };

    const currentModule = useMemo(() => modules.find((item) => item.key === activeModule) || modules[0], [activeModule]);

    if (loading || (!adminUser && !error)) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-orange" /></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#05080c] via-darkBg to-black text-white">
            <div className="flex min-h-screen">
                <aside className="hidden w-[310px] shrink-0 border-r border-white/8 bg-[#081118]/90 px-6 py-8 lg:flex lg:flex-col">
                    <div className="rounded-3xl border border-orange/20 bg-gradient-to-br from-orange/10 via-transparent to-teil/10 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-orange/15 p-3 text-orange"><Crown className="h-6 w-6" /></div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Ninja Admin</h1>
                                <p className="mt-1 text-sm text-white/55">Users, retention, revenue, and card activity operations.</p>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-8 space-y-2">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            const isActive = activeModule === module.key;
                            return (
                                <button key={module.key} onClick={() => setModule(module.key)} className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${isActive ? 'border-teil/50 bg-teil/15' : 'border-transparent bg-white/[0.02] hover:border-white/8 hover:bg-white/[0.04]'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-xl p-2 ${isActive ? 'bg-orange/15 text-orange' : 'bg-white/5 text-white/60'}`}><Icon className="h-4 w-4" /></div>
                                        <div>
                                            <div className="font-semibold text-white">{module.label}</div>
                                            <div className="mt-1 text-xs leading-5 text-white/45">{module.description}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Signed in</p>
                        <p className="mt-3 text-lg font-semibold">{adminUser?.name}</p>
                        <p className="text-sm text-white/45">{adminUser?.email}</p>
                        <div className="mt-4"><Badge tone="orange">{adminUser?.role?.replace('_', ' ')}</Badge></div>
                    </div>
                </aside>

                <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/8 bg-[#071018]/85 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                        <header className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-orange/80">Ninja Cards Operations</p>
                                <h1 className="mt-3 text-3xl font-bold tracking-tight">{currentModule.label}</h1>
                                <p className="mt-2 max-w-2xl text-sm text-white/55">{currentModule.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                                    <span className="font-semibold text-white">{adminUser?.name}</span>
                                    <span className="ml-2 text-white/45">{adminUser?.email}</span>
                                </div>
                                <button onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange/30 hover:text-orange">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </header>

                        <div className="space-y-6 p-6">
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
                                {modules.map((module) => (
                                    <button
                                        key={module.key}
                                        onClick={() => setModule(module.key)}
                                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                                            activeModule === module.key ? 'border-orange/40 bg-orange/15 text-orange' : 'border-white/10 bg-white/[0.03] text-white/70'
                                        }`}
                                    >
                                        {module.label}
                                    </button>
                                ))}
                            </div>

                            {activeModule === 'users' && (
                                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0d1319] px-4 py-3">
                                    <Search className="h-4 w-4 text-white/35" />
                                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or company" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
                                </div>
                            )}

                            {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">{error}</div>}
                            {pageLoading && <div className="flex min-h-[280px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange" /></div>}

                            {!pageLoading && activeModule === 'overview' && dashboard && (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Card title="Total Users" value={String(dashboard.overview.totalUsers)} detail={`${dashboard.overview.newUsers30d} joined in the last 30 days`} />
                                        <Card title="New Users 7D" value={String(dashboard.overview.newUsers7d)} detail="Fresh signups in the last 7 days" accent="text-cyan-300" />
                                        <Card title="Revenue" value={fmtMoney(dashboard.overview.totalRevenue)} detail={`${fmtMoney(dashboard.overview.revenue30d)} collected in the last 30 days`} accent="text-white" />
                                        <Card title="Follow-up Queue" value={String(dashboard.overview.followUpQueue)} detail="Leads currently due for a follow-up touch" accent="text-cyan-300" />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Card title="Active Subs" value={String(dashboard.overview.activeSubscriptions)} detail="Paying and trialing users right now" accent="text-cyan-300" />
                                        <Card title="At Risk Subs" value={String(dashboard.overview.atRiskSubscriptions)} detail="Past due, unpaid, paused, or cancelled customers" />
                                        <Card title="Visit To Lead" value={`${dashboard.overview.visitToLeadRate}%`} detail="Current visit-to-lead conversion rate" accent="text-white" />
                                        <Card title="Total Visits" value={String(dashboard.engagement.totalVisits)} detail={`${dashboard.engagement.totalShares} shares and ${dashboard.engagement.totalDownloads} downloads tracked`} accent="text-cyan-300" />
                                    </div>

                                    <Section title="Funnel Snapshot" subtitle="The operating view of growth, visits, leads, and wins.">
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                            <Card title="Visits" value={String(dashboard.funnel.visits)} detail="Tracked profile visits" accent="text-white" />
                                            <Card title="Leads" value={String(dashboard.funnel.leads)} detail="Lead records captured" />
                                            <Card title="Meetings" value={String(dashboard.funnel.meetings)} detail="Deals that reached meeting stage" accent="text-cyan-300" />
                                            <Card title="Won Deals" value={String(dashboard.funnel.wonDeals)} detail="Closed won CRM deals" />
                                            <Card title="Won Value" value={fmtMoney(dashboard.funnel.wonDealValue)} detail="Value of won deals" accent="text-white" />
                                        </div>
                                    </Section>

                                    <Section title="Last 10 Users Active On Cards" subtitle="This is the freshest real card activity we have, and it doubles as the admin last-seen signal.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Last Seen</div><div>Action</div><div>Plan</div><div>Company</div><div>Engagement</div>
                                            </div>
                                            {dashboard.recentCardActivity.map((user: any) => (
                                                <div key={`${user.userId}-${user.timestamp}`} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div></div>
                                                    <div>{fmtDate(user.timestamp)}</div>
                                                    <div><Badge tone="blue">{fmtAction(user.type)}</Badge></div>
                                                    <div><div>{user.plan}</div><div className="mt-2"><Badge tone={getStatusTone(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge></div></div>
                                                    <div>{user.company || 'No company set'}</div>
                                                    <div><div>{user.profileVisits} visits</div><div className="text-xs text-white/45">{user.profileShares} shares / {user.vcfDownloads} downloads</div></div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <Section title="Newest Signups" subtitle="The latest users who entered the system.">
                                            <div className="space-y-3">
                                                {dashboard.recentUsers.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <Badge tone={getStatusTone(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Joined</div><div className="mt-1">{fmtDate(user.joinedAt)}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Plan</div><div className="mt-1">{user.plan}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Usage</div><div className="mt-1">{user.profileVisits} visits / {user.profileShares} shares / {user.vcfDownloads} downloads</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>

                                        <Section title="Subscription Alerts" subtitle="Customers who may need billing or retention attention.">
                                            <div className="space-y-3">
                                                {dashboard.subscriptionAlerts.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No at-risk subscriptions right now.</div>
                                                )}
                                                {dashboard.subscriptionAlerts.map((item: any) => (
                                                    <div key={item.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{item.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{item.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{item.company || 'No company set'}</div>
                                                            </div>
                                                            <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Plan</div><div className="mt-1">{item.plan}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Ends</div><div className="mt-1">{fmtDate(item.endDate || item.cancelDate)}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Started</div><div className="mt-1">{fmtDate(item.startDate)}</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    </div>

                                    <Section title="Lead Follow-up Pressure" subtitle="Leads already due for a follow-up so you can see where the pipeline is stalling.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Lead</div><div>Owner</div><div>Source</div><div>Next Follow-up</div><div>Stage</div><div>Contact</div>
                                            </div>
                                            {dashboard.followUpLeads.map((lead: any) => (
                                                <div key={lead.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{lead.name}</div><div className="text-xs text-white/45">{lead.email || lead.phone || 'No contact detail'}</div></div>
                                                    <div><div>{lead.ownerName || 'Unassigned owner'}</div><div className="text-xs text-white/45">{lead.company || lead.ownerEmail || ''}</div></div>
                                                    <div>{lead.source}</div>
                                                    <div>{fmtDate(lead.nextFollowUpAt)}</div>
                                                    <div><Badge tone="orange">Stage {lead.followUpStage}</Badge></div>
                                                    <div>{lead.phone || lead.email || 'No contact detail'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Top Engaged Users" subtitle="Users ranked by visits and downstream engagement.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Company</div><div>Visits</div><div>Shares</div><div>Downloads</div><div>Social Clicks</div>
                                            </div>
                                            {dashboard.topUsers.map((user: any) => (
                                                <div key={user.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div></div>
                                                    <div>{user.company || '-'}</div><div>{user.profileVisits}</div><div>{user.profileShares}</div><div>{user.vcfDownloads}</div><div>{user.socialLinkClicks}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {!pageLoading && activeModule === 'users' && usersData && (
                                <Section title="User Management" subtitle="Search live users, track plan state, recent card activity, and weak profiles.">
                                    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                        <div className="grid grid-cols-7 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                            <div>User</div><div>Plan</div><div>Last Seen</div><div>Joined</div><div>Engagement</div><div>Leads</div><div>Profile Health</div>
                                        </div>
                                        {usersData.users.map((user: any) => (
                                            <div key={user.id} className="grid grid-cols-7 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div><div className="text-xs text-white/35">{user.company || 'No company set'}</div></div>
                                                <div><div>{user.plan}</div><div className="mt-2"><Badge tone={getStatusTone(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge></div></div>
                                                <div><div>{fmtDate(user.lastSeenAt)}</div><div className="mt-2 text-xs text-white/45">{fmtAction(user.lastCardAction)}</div></div>
                                                <div>{fmtDate(user.joinedAt)}</div>
                                                <div><div>{user.profileVisits} visits</div><div className="text-xs text-white/45">{user.profileShares} shares / {user.vcfDownloads} downloads</div></div>
                                                <div><div>{user.leadCount}</div><div className="text-xs text-white/45">{user.latestLeadAt ? `Latest ${fmtDate(user.latestLeadAt)}` : 'No leads yet'}</div></div>
                                                <div><div className="font-semibold text-white">{user.completeness}% complete</div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-orange to-teil" style={{ width: `${user.completeness}%` }} /></div></div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {!pageLoading && activeModule === 'revenue' && revenueData && (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Card title="Total Revenue" value={fmtMoney(revenueData.summary.totalRevenue)} detail="All paid invoices to date" />
                                        <Card title="Revenue 30D" value={fmtMoney(revenueData.summary.revenue30d)} detail="Recent paid invoice volume" accent="text-cyan-300" />
                                        <Card title="Active Subs" value={String(revenueData.summary.active)} detail={`${revenueData.summary.trialing} trialing subscriptions`} accent="text-white" />
                                        <Card title="At Risk" value={String(revenueData.summary.past_due + revenueData.summary.unpaid)} detail={`${revenueData.summary.cancelled} cancelled subscriptions`} />
                                    </div>
                                    <Section title="Recent Invoices" subtitle="The latest paid invoices and their customer owners.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Customer</div><div>Company</div><div>Amount</div><div>Currency</div><div>Created</div><div>Invoice</div>
                                            </div>
                                            {revenueData.invoices.map((invoice: any) => (
                                                <div key={invoice.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{invoice.userName}</div><div className="text-xs text-white/45">{invoice.userEmail}</div></div>
                                                    <div>{invoice.company || '-'}</div><div className="font-semibold text-orange">{fmtMoney(invoice.amountPaid, invoice.currency.toUpperCase())}</div><div>{invoice.currency.toUpperCase()}</div><div>{fmtDate(invoice.createdAt)}</div><div><a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-orange">Open invoice</a></div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                    <Section title="Retention Watchlist" subtitle="Billing states that may need customer follow-up before they turn into churn.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Customer</div><div>Company</div><div>Status</div><div>Plan</div><div>Ends</div><div>Started</div>
                                            </div>
                                            {revenueData.alerts.map((item: any) => (
                                                <div key={item.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{item.userName}</div><div className="text-xs text-white/45">{item.userEmail}</div></div>
                                                    <div>{item.company || 'No company set'}</div>
                                                    <div><Badge tone={getStatusTone(item.status)}>{item.status}</Badge></div>
                                                    <div>{item.plan}</div>
                                                    <div>{fmtDate(item.endDate || item.cancelDate)}</div>
                                                    <div>{fmtDate(item.startDate)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {!pageLoading && activeModule === 'crm' && crmData && (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Card title="Total Leads" value={String(crmData.summary.totalLeads)} detail="Captured across profile forms and sources" />
                                        <Card title="Unassigned Leads" value={String(crmData.summary.unassignedLeads)} detail="Leads not yet attached to a deal" accent="text-cyan-300" />
                                        <Card title="Meetings" value={String(crmData.summary.meetings)} detail="Deals that reached meeting stage" accent="text-white" />
                                        <Card title="Won Value" value={fmtMoney(crmData.summary.wonDealValue)} detail={`${crmData.summary.followUpQueue} leads waiting for follow-up`} />
                                    </div>
                                    <Section title="Recent Leads" subtitle="Newest lead captures across the user base.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-4 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Lead</div><div>Owner</div><div>Source</div><div>Created</div>
                                            </div>
                                            {crmData.recentLeads.map((lead: any) => (
                                                <div key={lead.id} className="grid grid-cols-4 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{lead.name}</div><div className="text-xs text-white/45">{lead.email || lead.phone || 'No contact detail'}</div></div>
                                                    <div><div>{lead.ownerName || '-'}</div><div className="text-xs text-white/45">{lead.company || lead.ownerEmail || ''}</div></div>
                                                    <div>{lead.source}</div><div>{fmtDate(lead.createdAt)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                    <Section title="Recently Updated Deals" subtitle="The CRM deals your team touched most recently.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Deal</div><div>Owner</div><div>Lead</div><div>Stage</div><div>Value</div><div>Updated</div>
                                            </div>
                                            {crmData.recentDeals.map((deal: any) => (
                                                <div key={deal.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div className="font-semibold text-white">{deal.title}</div>
                                                    <div><div>{deal.ownerName || 'No owner'}</div><div className="text-xs text-white/45">{deal.ownerEmail || ''}</div></div>
                                                    <div><div>{deal.leadName || 'No linked lead'}</div><div className="text-xs text-white/45">{deal.leadEmail || ''}</div></div>
                                                    <div><Badge tone={deal.stage === 'WON' ? 'green' : deal.stage === 'LOST' ? 'red' : 'blue'}>{deal.stage}</Badge></div>
                                                    <div>{fmtMoney(deal.value || 0)}</div>
                                                    <div>{fmtDate(deal.updatedAt)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {!pageLoading && activeModule === 'admins' && adminUsersData && (
                                <Section title="Admin Accounts" subtitle="Separate admin identities with their own role and access lifecycle.">
                                    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                        <div className="grid grid-cols-5 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                            <div>Admin</div><div>Role</div><div>Status</div><div>Last Login</div><div>Created</div>
                                        </div>
                                        {adminUsersData.adminUsers.map((user: any) => (
                                            <div key={user.id} className="grid grid-cols-5 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div></div>
                                                <div><Badge tone="orange">{user.role.replace('_', ' ')}</Badge></div>
                                                <div><Badge tone={getStatusTone(user.status)}>{user.status}</Badge></div>
                                                <div>{fmtDate(user.lastLoginAt)}</div><div>{fmtDate(user.createdAt)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
