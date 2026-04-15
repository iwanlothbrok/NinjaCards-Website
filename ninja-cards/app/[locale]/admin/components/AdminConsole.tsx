'use client';

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, CalendarClock, CreditCard, Crown, Funnel, KeyRound, LayoutDashboard, Loader2, LogOut, Search, Send, ShieldCheck, TrendingUp, Users, X } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { useAdminAuth } from '../AdminAuthProvider';
import { BASE_API_URL } from '@/utils/constants';

type ModuleKey = 'overview' | 'users' | 'revenue' | 'crm' | 'admins';
type OverviewTabKey = 'performance' | 'lifecycle' | 'conversion' | 'watchlist';
type UsersTabKey = 'directory' | 'activity' | 'watchlist';
type AdminRangeKey = 'today' | '7d' | '30d' | '90d' | 'thisMonth' | 'lastMonth' | '12m';

type AdminFilterState = {
    range: AdminRangeKey;
    plan: string;
    subscriptionStatus: string;
    hasSlug: string;
    hasLeads: string;
    loginState: string;
    activityState: string;
    completenessBand: string;
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const modules: Array<{ key: ModuleKey; label: string; icon: ComponentType<{ className?: string }>; description: string }> = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Growth, revenue, engagement, and funnel health.' },
    { key: 'users', label: 'Users', icon: Users, description: 'Customer accounts, plans, profile quality, and card activity.' },
    { key: 'revenue', label: 'Revenue', icon: CreditCard, description: 'Subscription status, retention risk, and invoice flow.' },
    { key: 'crm', label: 'Leads & CRM', icon: TrendingUp, description: 'Lead flow, deals, meetings, and follow-ups.' },
    { key: 'admins', label: 'Admins', icon: ShieldCheck, description: 'Separate admin identities and roles.' },
];

const BULGARIA_TIME_ZONE = 'Europe/Sofia';
const overviewTabs: Array<{ key: OverviewTabKey; label: string; description: string }> = [
    { key: 'performance', label: 'Performance', description: 'Monthly usage, active users, and platform velocity.' },
    { key: 'lifecycle', label: 'Lifecycle', description: 'Who is active, inactive, reactivated, or dropping off.' },
    { key: 'conversion', label: 'Conversion', description: 'Which cards convert visits into leads best or worst.' },
    { key: 'watchlist', label: 'Watchlist', description: 'Users who need admin attention right now.' },
];
const usersTabs: Array<{ key: UsersTabKey; label: string; description: string }> = [
    { key: 'directory', label: 'Directory', description: 'Search users, card access, and password controls.' },
    { key: 'activity', label: 'Activity', description: 'Recently active and most engaged users.' },
    { key: 'watchlist', label: 'Watchlist', description: 'Inactive users and accounts that need attention.' },
];

const rangeOptions: Array<{ value: AdminRangeKey; label: string }> = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: '12m', label: '12 months' },
];

const filterOptions = {
    plan: [
        { value: 'all', label: 'All plans' },
        { value: 'SHINOBI', label: 'Shinobi' },
        { value: 'SAMURAI', label: 'Samurai' },
        { value: 'SHOGUN', label: 'Shogun' },
    ],
    subscriptionStatus: [
        { value: 'all', label: 'All subscriptions' },
        { value: 'active', label: 'Active' },
        { value: 'trialing', label: 'Trialing' },
        { value: 'past_due', label: 'Past due' },
        { value: 'unpaid', label: 'Unpaid' },
        { value: 'paused', label: 'Paused' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'none', label: 'No subscription' },
    ],
    hasSlug: [
        { value: 'all', label: 'All slug states' },
        { value: 'yes', label: 'Has slug' },
        { value: 'no', label: 'No slug' },
    ],
    hasLeads: [
        { value: 'all', label: 'All lead states' },
        { value: 'yes', label: 'Has leads' },
        { value: 'no', label: 'No leads' },
    ],
    loginState: [
        { value: 'all', label: 'All login states' },
        { value: 'tracked', label: 'Login tracked' },
        { value: 'never', label: 'Never logged in' },
    ],
    activityState: [
        { value: 'all', label: 'All activity states' },
        { value: 'active', label: 'Active in range' },
        { value: 'inactive', label: 'Inactive in range' },
    ],
    completenessBand: [
        { value: 'all', label: 'All completeness' },
        { value: 'low', label: 'Low completeness' },
        { value: 'medium', label: 'Medium completeness' },
        { value: 'high', label: 'High completeness' },
    ],
};

const defaultFilters: AdminFilterState = {
    range: '30d',
    plan: 'all',
    subscriptionStatus: 'all',
    hasSlug: 'all',
    hasLeads: 'all',
    loginState: 'all',
    activityState: 'all',
    completenessBand: 'all',
};

const fmtDate = (value?: string | null, fallback = 'Never') =>
    value
        ? new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: BULGARIA_TIME_ZONE,
          }).format(new Date(value))
        : fallback;

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

function ChartPanel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
    return (
        <div className="rounded-3xl border border-white/8 bg-[#0d1319] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-white/45">{subtitle}</p>
            </div>
            <div className="h-[320px]">{children}</div>
        </div>
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
    const filters = useMemo<AdminFilterState>(
        () => ({
            range: (searchParams?.get('range') as AdminRangeKey) || defaultFilters.range,
            plan: searchParams?.get('plan') || defaultFilters.plan,
            subscriptionStatus: searchParams?.get('subscriptionStatus') || defaultFilters.subscriptionStatus,
            hasSlug: searchParams?.get('hasSlug') || defaultFilters.hasSlug,
            hasLeads: searchParams?.get('hasLeads') || defaultFilters.hasLeads,
            loginState: searchParams?.get('loginState') || defaultFilters.loginState,
            activityState: searchParams?.get('activityState') || defaultFilters.activityState,
            completenessBand: searchParams?.get('completenessBand') || defaultFilters.completenessBand,
        }),
        [searchParams],
    );
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [dashboard, setDashboard] = useState<any>(null);
    const [usersData, setUsersData] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [crmData, setCrmData] = useState<any>(null);
    const [adminUsersData, setAdminUsersData] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usersActionError, setUsersActionError] = useState<string | null>(null);
    const [usersActionNotice, setUsersActionNotice] = useState<string | null>(null);
    const [passwordActionUserId, setPasswordActionUserId] = useState<string | null>(null);
    const [overviewTab, setOverviewTab] = useState<OverviewTabKey>('performance');
    const [usersTab, setUsersTab] = useState<UsersTabKey>('directory');
    const [timelineUser, setTimelineUser] = useState<any>(null);
    const [timelineData, setTimelineData] = useState<any>(null);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [timelineError, setTimelineError] = useState<string | null>(null);
    const [followUpSending, setFollowUpSending] = useState(false);
    const [followUpNotice, setFollowUpNotice] = useState<string | null>(null);
    const [followUpError, setFollowUpError] = useState<string | null>(null);
    const [digestSending, setDigestSending] = useState(false);
    const [digestNotice, setDigestNotice] = useState<string | null>(null);
    const [digestError, setDigestError] = useState<string | null>(null);

    const sharedFilterParams = useMemo(() => {
        const params = new URLSearchParams();
        params.set('locale', locale);
        params.set('range', filters.range);

        (Object.keys(defaultFilters) as Array<keyof AdminFilterState>).forEach((key) => {
            const value = filters[key];
            if (key !== 'range' && value && value !== 'all') {
                params.set(key, value);
            }
        });

        return params.toString();
    }, [filters, locale]);

    const updateFilter = (key: keyof AdminFilterState, value: string) => {
        const params = new URLSearchParams(searchParams?.toString());

        if (value === 'all' && key !== 'range') {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        if (!params.get('module')) {
            params.set('module', activeModule);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams?.toString());
        (Object.keys(defaultFilters) as Array<keyof AdminFilterState>).forEach((key) => {
            if (key === 'range') {
                params.set('range', defaultFilters.range);
            } else {
                params.delete(key);
            }
        });
        if (!params.get('module')) {
            params.set('module', activeModule);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        if (!loading && !adminUser) router.replace(`/${locale}/admin/login`);
    }, [adminUser, loading, locale, router]);

    useEffect(() => {
        if (!adminUser) return;
        let ignore = false;

        const fetchJson = async (url: string, fallbackMessage: string) => {
            const response = await fetch(url, { credentials: 'include', cache: 'no-store' });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || fallbackMessage);
            }
            return payload;
        };

        const loadModule = async () => {
            setPageLoading(true);
            setError(null);
            setUsersActionError(null);
            const baseParams = new URLSearchParams(sharedFilterParams);

            try {
                if (activeModule === 'overview') {
                    const dash = await fetchJson(`${BASE_API_URL}/api/admin/dashboard?${baseParams.toString()}`, 'Failed to load dashboard data');
                    if (!ignore) setDashboard(dash);
                    return;
                }

                if (activeModule === 'users') {
                    baseParams.set('q', appliedQuery);
                    baseParams.set('limit', '20');
                    const users = await fetchJson(
                        `${BASE_API_URL}/api/admin/users?${baseParams.toString()}`,
                        'Failed to load users data',
                    );
                    if (!ignore) setUsersData(users);
                    return;
                }

                if (activeModule === 'revenue') {
                    const revenue = await fetchJson(`${BASE_API_URL}/api/admin/revenue`, 'Failed to load revenue data');
                    if (!ignore) setRevenueData(revenue);
                    return;
                }

                if (activeModule === 'crm') {
                    const crm = await fetchJson(`${BASE_API_URL}/api/admin/crm`, 'Failed to load CRM data');
                    if (!ignore) setCrmData(crm);
                    return;
                }

                const admins = await fetchJson(`${BASE_API_URL}/api/admin/admin-users`, 'Failed to load admin users');
                if (!ignore) setAdminUsersData(admins);
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : 'Failed to load admin console');
                }
            } finally {
                if (!ignore) setPageLoading(false);
            }
        };

        void loadModule();

        return () => {
            ignore = true;
        };
    }, [activeModule, adminUser, appliedQuery, sharedFilterParams]);

    useEffect(() => {
        if (!timelineUser || !adminUser) return;
        let ignore = false;

        const loadTimeline = async () => {
            setTimelineLoading(true);
            setTimelineError(null);
            try {
                const params = new URLSearchParams(sharedFilterParams);
                params.set('userId', timelineUser.id);
                const response = await fetch(`${BASE_API_URL}/api/admin/user-timeline?${params.toString()}`, {
                    credentials: 'include',
                    cache: 'no-store',
                });
                const payload = await response.json().catch(() => null);
                if (!response.ok) {
                    throw new Error(payload?.error || 'Failed to load user timeline');
                }
                if (!ignore) {
                    setTimelineData(payload);
                }
            } catch (err) {
                if (!ignore) {
                    setTimelineError(err instanceof Error ? err.message : 'Failed to load user timeline');
                }
            } finally {
                if (!ignore) {
                    setTimelineLoading(false);
                }
            }
        };

        void loadTimeline();

        return () => {
            ignore = true;
        };
    }, [adminUser, sharedFilterParams, timelineUser]);

    const handleClearPassword = async (user: any) => {
        const confirmed = window.confirm(
            `Remove the password for ${user.name}? They will no longer be able to log in with a password until a new one is set.`,
        );

        if (!confirmed) return;

        setPasswordActionUserId(user.id);
        setUsersActionError(null);
        setUsersActionNotice(null);

        try {
            const response = await fetch(`${BASE_API_URL}/api/admin/users`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'clear-password',
                    userId: user.id,
                }),
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to remove password');
            }

            setUsersData((current: any) =>
                current
                    ? {
                          ...current,
                          users: current.users.map((item: any) =>
                              item.id === user.id ? { ...item, hasPassword: false } : item,
                          ),
                      }
                    : current,
            );
            setUsersActionNotice(`Password removed for ${user.name}.`);
        } catch (err) {
            setUsersActionError(err instanceof Error ? err.message : 'Failed to remove password');
        } finally {
            setPasswordActionUserId(null);
        }
    };

    const handleViewTimeline = (user: any) => {
        setTimelineUser(user);
        setTimelineData(null);
        setTimelineError(null);
    };

    const setModule = (module: ModuleKey) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('module', module);
        router.push(`${pathname}?${params.toString()}`);
    };

    const submitUserSearch = () => {
        setAppliedQuery(query.trim());
    };

    const clearUserSearch = () => {
        setQuery('');
        setAppliedQuery('');
    };

    const refreshCrmData = async () => {
        const response = await fetch(`${BASE_API_URL}/api/admin/crm`, {
            credentials: 'include',
            cache: 'no-store',
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error(payload?.error || 'Failed to load CRM data');
        }
        setCrmData(payload);
    };

    const handleSendDueFollowUps = async () => {
        setFollowUpSending(true);
        setFollowUpNotice(null);
        setFollowUpError(null);

        try {
            const response = await fetch(`${BASE_API_URL}/api/admin/follow-up`, {
                method: 'POST',
                credentials: 'include',
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to send due follow-ups');
            }

            setFollowUpNotice(payload?.message || 'Due follow-ups processed successfully.');
            await refreshCrmData();
        } catch (err) {
            setFollowUpError(err instanceof Error ? err.message : 'Failed to send due follow-ups');
        } finally {
            setFollowUpSending(false);
        }
    };

    const handleSendWeeklyDigest = async () => {
        setDigestSending(true);
        setDigestNotice(null);
        setDigestError(null);

        try {
            const response = await fetch(`${BASE_API_URL}/api/admin/weekly-digest`, {
                method: 'POST',
                credentials: 'include',
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to send dashboard digest emails');
            }

            setDigestNotice(payload?.message || 'Dashboard digest emails sent successfully.');
        } catch (err) {
            setDigestError(err instanceof Error ? err.message : 'Failed to send dashboard digest emails');
        } finally {
            setDigestSending(false);
        }
    };

    const currentModule = useMemo(() => modules.find((item) => item.key === activeModule) || modules[0], [activeModule]);
    const latestMonthlyAnalytics = dashboard?.monthlyAnalytics?.[dashboard.monthlyAnalytics.length - 1] || null;
    const monthlyLabels = useMemo(() => dashboard?.monthlyAnalytics?.map((month: any) => month.label) || [], [dashboard]);
    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index' as const, intersect: false },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255,255,255,0.72)',
                        boxWidth: 12,
                        boxHeight: 12,
                        usePointStyle: true,
                        pointStyle: 'circle' as const,
                    },
                },
                tooltip: {
                    backgroundColor: '#081118',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: 'rgba(255,255,255,0.78)',
                },
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: 'rgba(255,255,255,0.5)' },
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    ticks: { color: 'rgba(255,255,255,0.5)' },
                },
            },
        }),
        [],
    );
    const activityChartData = useMemo(
        () => ({
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Visits',
                    data: dashboard?.monthlyAnalytics?.map((month: any) => month.visits) || [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    fill: true,
                    tension: 0.35,
                },
                {
                    label: 'Active Users',
                    data: dashboard?.monthlyAnalytics?.map((month: any) => month.activeUsers) || [],
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.15)',
                    fill: true,
                    tension: 0.35,
                },
                {
                    label: 'Leads',
                    data: dashboard?.monthlyAnalytics?.map((month: any) => month.leads) || [],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    fill: true,
                    tension: 0.35,
                },
            ],
        }),
        [dashboard, monthlyLabels],
    );
    const lifecycleChartData = useMemo(
        () => ({
            labels: dashboard?.insights?.monthlyLifecycle?.map((month: any) => month.label) || [],
            datasets: [
                {
                    label: 'Active',
                    data: dashboard?.insights?.monthlyLifecycle?.map((month: any) => month.activeUsers) || [],
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.12)',
                    fill: false,
                    tension: 0.35,
                },
                {
                    label: 'Inactive',
                    data: dashboard?.insights?.monthlyLifecycle?.map((month: any) => month.inactiveUsers) || [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    fill: false,
                    tension: 0.35,
                },
                {
                    label: 'Reactivated',
                    data: dashboard?.insights?.monthlyLifecycle?.map((month: any) => month.reactivatedUsers) || [],
                    borderColor: '#34d399',
                    backgroundColor: 'rgba(52, 211, 153, 0.12)',
                    fill: false,
                    tension: 0.35,
                },
            ],
        }),
        [dashboard],
    );
    const conversionChartData = useMemo(
        () => ({
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Leads',
                    data: dashboard?.monthlyAnalytics?.map((month: any) => month.leads) || [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    fill: true,
                    tension: 0.35,
                },
                {
                    label: 'Visit to Lead %',
                    data: dashboard?.monthlyAnalytics?.map((month: any) => month.visitToLeadRate) || [],
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.15)',
                    tension: 0.35,
                    fill: true,
                },
            ],
        }),
        [dashboard, monthlyLabels],
    );

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

                            {(activeModule === 'overview' || activeModule === 'users') && (
                                <Section
                                    title="Operations Filters"
                                    subtitle="Shared time and segment filters for overview and user operations."
                                    actions={
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange/30 hover:text-orange"
                                        >
                                            <X className="h-4 w-4" />
                                            Reset filters
                                        </button>
                                    }
                                >
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/35"><CalendarClock className="h-3.5 w-3.5" />Range</span>
                                            <select value={filters.range} onChange={(event) => updateFilter('range', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {rangeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/35"><Funnel className="h-3.5 w-3.5" />Plan</span>
                                            <select value={filters.plan} onChange={(event) => updateFilter('plan', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.plan.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Subscription</span>
                                            <select value={filters.subscriptionStatus} onChange={(event) => updateFilter('subscriptionStatus', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.subscriptionStatus.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Activity</span>
                                            <select value={filters.activityState} onChange={(event) => updateFilter('activityState', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.activityState.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Slug</span>
                                            <select value={filters.hasSlug} onChange={(event) => updateFilter('hasSlug', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.hasSlug.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Leads</span>
                                            <select value={filters.hasLeads} onChange={(event) => updateFilter('hasLeads', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.hasLeads.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Login</span>
                                            <select value={filters.loginState} onChange={(event) => updateFilter('loginState', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.loginState.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm text-white/70">
                                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">Completeness</span>
                                            <select value={filters.completenessBand} onChange={(event) => updateFilter('completenessBand', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none">
                                                {filterOptions.completenessBand.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/35">
                                        {(activeModule === 'overview' ? dashboard?.filterSummary?.appliedFilters : usersData?.summary?.appliedFilters)?.map((label: string) => (
                                            <span key={label} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-white/65">{label}</span>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {activeModule === 'users' && (
                                <div className="space-y-3">
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            submitUserSearch();
                                        }}
                                        className="flex flex-col gap-3 lg:flex-row"
                                    >
                                        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0d1319] px-4 py-3 lg:flex-1">
                                            <Search className="h-4 w-4 text-white/35" />
                                            <input
                                                value={query}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="Search by user name"
                                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange/30 bg-orange px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                                            >
                                                <Search className="h-4 w-4" />
                                                Search
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearUserSearch}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                                            >
                                                <X className="h-4 w-4" />
                                                Clear
                                            </button>
                                        </div>
                                    </form>
                                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/35">
                                        <span>Showing the latest 20 users</span>
                                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-white/60">
                                            Ordered by created date
                                        </span>
                                        {appliedQuery && (
                                            <span className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1.5 text-[11px] font-semibold text-orange">
                                                Filter: {appliedQuery}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">{error}</div>}
                            {usersActionError && activeModule === 'users' && (
                                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">{usersActionError}</div>
                            )}
                            {usersActionNotice && activeModule === 'users' && (
                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">{usersActionNotice}</div>
                            )}
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

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Card
                                            title="Active Users 7D"
                                            value={String(dashboard.overview.activeUsers7d)}
                                            detail="Users with at least one card event in the last 7 days"
                                            accent="text-white"
                                        />
                                        <Card
                                            title="Active Users 30D"
                                            value={String(dashboard.overview.activeUsers30d)}
                                            detail="Users with at least one card event in the last 30 days"
                                            accent="text-cyan-300"
                                        />
                                        <Card
                                            title="This Month Interactions"
                                            value={String(latestMonthlyAnalytics?.interactions || 0)}
                                            detail={`${latestMonthlyAnalytics?.activeUsers || 0} active users and ${latestMonthlyAnalytics?.leads || 0} leads this month`}
                                        />
                                        <Card
                                            title="This Month Conversion"
                                            value={`${latestMonthlyAnalytics?.visitToLeadRate || 0}%`}
                                            detail={`${latestMonthlyAnalytics?.visits || 0} visits turned into ${latestMonthlyAnalytics?.leads || 0} leads`}
                                            accent="text-white"
                                        />
                                    </div>

                                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-3">
                                        <div className="flex flex-wrap gap-2">
                                            {overviewTabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    onClick={() => setOverviewTab(tab.key)}
                                                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                                                        overviewTab === tab.key
                                                            ? 'border-orange/40 bg-orange/15 text-white'
                                                            : 'border-white/8 bg-[#0d1319] text-white/65 hover:border-white/15 hover:text-white'
                                                    }`}
                                                >
                                                    <div className="text-sm font-semibold">{tab.label}</div>
                                                    <div className="mt-1 text-xs text-white/45">{tab.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {overviewTab === 'performance' && (
                                        <div className="grid gap-6 xl:grid-cols-2">
                                            <ChartPanel title="Usage Trend" subtitle="Twelve months of visits, active users, and leads.">
                                                <Line data={activityChartData} options={chartOptions} />
                                            </ChartPanel>
                                            <ChartPanel title="Lead Conversion Trend" subtitle="Monthly leads against visit-to-lead conversion rate.">
                                                <Line data={conversionChartData} options={chartOptions} />
                                            </ChartPanel>
                                        </div>
                                    )}

                                    {overviewTab === 'lifecycle' && (
                                        <div className="grid gap-6 xl:grid-cols-2">
                                            <ChartPanel title="User Lifecycle Trend" subtitle="Track active, inactive, and reactivated users over the last year.">
                                                <Line data={lifecycleChartData} options={chartOptions} />
                                            </ChartPanel>
                                            <Section title="Lifecycle Highlights" subtitle="A quick operational read on who is moving in and out of activity right now.">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <Card title="Reactivated" value={String(dashboard.insights.reactivatedUsersNow.length)} detail="Users who came back this month" />
                                                    <Card title="Dropped Off" value={String(dashboard.insights.newlyInactiveUsersNow.length)} detail="Users active last month but quiet now" accent="text-cyan-300" />
                                                    <Card title="Inactive Sample" value={String(dashboard.insights.inactiveUsers.length)} detail="Users with no recent card activity" accent="text-white" />
                                                    <Card title="Monthly Leaders" value={String(dashboard.insights.topActiveUsersByMonth.length)} detail="Months with tracked user leaderboards" accent="text-cyan-300" />
                                                </div>
                                            </Section>
                                        </div>
                                    )}

                                    {overviewTab === 'conversion' && (
                                        <div className="grid gap-6 xl:grid-cols-2">
                                            <ChartPanel title="Conversion Focus" subtitle="Compare monthly leads with conversion rate to spot strong and weak periods.">
                                                <Line data={conversionChartData} options={chartOptions} />
                                            </ChartPanel>
                                            <Section title="Conversion Highlights" subtitle="See who is winning and who needs attention.">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <Card title="Best Converters" value={String(dashboard.insights.bestConverters.length)} detail="Strong cards turning traffic into leads" />
                                                    <Card title="Weak Converters" value={String(dashboard.insights.worstConverters.length)} detail="Cards with meaningful traffic but poor conversion" accent="text-cyan-300" />
                                                    <Card title="Lead Generators" value={String(dashboard.insights.topLeadGeneratorsThisMonth.length)} detail="Users producing new leads this month" accent="text-white" />
                                                    <Card title="Follow-Up Queue" value={String(dashboard.followUpLeads.length)} detail="Leads already due for a follow-up" accent="text-cyan-300" />
                                                </div>
                                            </Section>
                                        </div>
                                    )}

                                    {overviewTab === 'watchlist' && (
                                        <div className="grid gap-6 xl:grid-cols-2">
                                            <ChartPanel title="Watchlist Snapshot" subtitle="Use this view to spot risk before it becomes churn or missed revenue.">
                                                <Bar
                                                    data={{
                                                        labels: ['Never logged in', 'Declining users', 'High traffic low lead', 'At-risk subs'],
                                                        datasets: [
                                                            {
                                                                label: 'Users to review',
                                                                data: [
                                                                    dashboard.insights.neverLoggedInUsers.length,
                                                                    dashboard.insights.decliningUsers.length,
                                                                    dashboard.insights.highTrafficLowLeadUsers.length,
                                                                    dashboard.subscriptionAlerts.length,
                                                                ],
                                                                backgroundColor: [
                                                                    'rgba(245, 158, 11, 0.7)',
                                                                    'rgba(34, 211, 238, 0.7)',
                                                                    'rgba(255,255,255,0.5)',
                                                                    'rgba(239, 68, 68, 0.65)',
                                                                ],
                                                                borderRadius: 10,
                                                            },
                                                        ],
                                                    }}
                                                    options={chartOptions}
                                                />
                                            </ChartPanel>
                                            <Section title="Watchlist Highlights" subtitle="The users and accounts most likely to need intervention.">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <Card title="Never Logged In" value={String(dashboard.insights.neverLoggedInUsers.length)} detail="Signed up but never completed a password login" />
                                                    <Card title="Declining Users" value={String(dashboard.insights.decliningUsers.length)} detail="Month-over-month usage drop detected" accent="text-cyan-300" />
                                                    <Card title="High Traffic / Low Lead" value={String(dashboard.insights.highTrafficLowLeadUsers.length)} detail="Cards getting visits without converting" accent="text-white" />
                                                    <Card title="At-Risk Subscriptions" value={String(dashboard.subscriptionAlerts.length)} detail="Billing states that may need retention work" accent="text-cyan-300" />
                                                </div>
                                            </Section>
                                        </div>
                                    )}

                                    <Section title="Funnel Snapshot" subtitle="The operating view of growth, visits, leads, and wins.">
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                            <Card title="Visits" value={String(dashboard.funnel.visits)} detail="Tracked profile visits" accent="text-white" />
                                            <Card title="Leads" value={String(dashboard.funnel.leads)} detail="Lead records captured" />
                                            <Card title="Meetings" value={String(dashboard.funnel.meetings)} detail="Deals that reached meeting stage" accent="text-cyan-300" />
                                            <Card title="Won Deals" value={String(dashboard.funnel.wonDeals)} detail="Closed won CRM deals" />
                                            <Card title="Won Value" value={fmtMoney(dashboard.funnel.wonDealValue)} detail="Value of won deals" accent="text-white" />
                                        </div>
                                    </Section>

                                    <Section title="Monthly Card Analytics" subtitle="A six-month view of card usage, active users, and lead conversion.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-8 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Month</div><div>Active Users</div><div>Visits</div><div>Shares</div><div>Downloads</div><div>Social Clicks</div><div>Leads</div><div>Visit To Lead</div>
                                            </div>
                                            {dashboard.monthlyAnalytics.map((month: any) => (
                                                <div key={month.monthKey} className="grid grid-cols-8 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div className="font-semibold text-white">{month.label}</div>
                                                    <div>{month.activeUsers}</div>
                                                    <div>{month.visits}</div>
                                                    <div>{month.shares}</div>
                                                    <div>{month.downloads}</div>
                                                    <div>{month.socialClicks}</div>
                                                    <div>{month.leads}</div>
                                                    <div>{month.visitToLeadRate}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Monthly User Lifecycle" subtitle="See who is active, inactive, reactivated, or dropping off month by month.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Month</div><div>Active</div><div>Inactive</div><div>Reactivated</div><div>Newly Inactive</div><div>First-Time Active</div>
                                            </div>
                                            {dashboard.insights.monthlyLifecycle.map((month: any) => (
                                                <div key={month.monthKey} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div className="font-semibold text-white">{month.label}</div>
                                                    <div>{month.activeUsers}</div>
                                                    <div>{month.inactiveUsers}</div>
                                                    <div>{month.reactivatedUsers}</div>
                                                    <div>{month.newlyInactiveUsers}</div>
                                                    <div>{month.firstTimeActiveUsers}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Latest Card Events" subtitle="The most recent profile and card actions across the platform.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-7 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Event Time</div><div>Action</div><div>Last Login</div><div>Plan</div><div>Company</div><div>Engagement</div>
                                            </div>
                                            {dashboard.recentCardActivity.map((user: any) => (
                                                <div key={`${user.userId}-${user.timestamp}`} className="grid grid-cols-7 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div>
                                                        <div className="font-semibold text-white">{user.name}</div>
                                                        <div className="text-xs text-white/45">{user.email}</div>
                                                        <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-orange hover:text-cyan-200">
                                                            Open card
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                    <div>{fmtDate(user.timestamp)}</div>
                                                    <div><Badge tone="blue">{fmtAction(user.type)}</Badge></div>
                                                    <div>{fmtDate(user.lastLoginAt, 'Not tracked yet')}</div>
                                                    <div><div>{user.plan}</div><div className="mt-2"><Badge tone={getStatusTone(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge></div></div>
                                                    <div>{user.company || 'No company set'}</div>
                                                    <div><div>{user.profileVisits} visits</div><div className="text-xs text-white/45">{user.profileShares} shares / {user.vcfDownloads} downloads / {user.socialLinkClicks} social clicks</div></div>
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

                                    <Section title="Lead Follow-up Pressure" subtitle="Leads already due for a follow-up so you can see which follow-up is pending next.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-6 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>Lead</div><div>Owner</div><div>Source</div><div>Due Since</div><div>Pending</div><div>Contact</div>
                                            </div>
                                            {dashboard.followUpLeads.map((lead: any) => (
                                                <div key={lead.id} className="grid grid-cols-6 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{lead.name}</div><div className="text-xs text-white/45">{lead.email || lead.phone || 'No contact detail'}</div></div>
                                                    <div><div>{lead.ownerName || 'Unassigned owner'}</div><div className="text-xs text-white/45">{lead.company || lead.ownerEmail || ''}</div></div>
                                                    <div>{lead.source}</div>
                                                    <div>{fmtDate(lead.nextFollowUpAt)}</div>
                                                    <div><Badge tone="orange">Stage {lead.pendingFollowUpStage ?? ((lead.followUpStage ?? 0) + 1)}</Badge></div>
                                                    <div>{lead.phone || lead.email || 'No contact detail'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Top Engaged Users" subtitle="Users ranked by visits and downstream engagement.">
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-7 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Company</div><div>Visits</div><div>Shares</div><div>Downloads</div><div>Social Clicks</div><div>Leads</div>
                                            </div>
                                            {dashboard.topUsers.map((user: any) => (
                                                <div key={user.id} className="grid grid-cols-7 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div>
                                                        <div className="font-semibold text-white">{user.name}</div>
                                                        <div className="text-xs text-white/45">{user.email}</div>
                                                        <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-orange hover:text-cyan-200">
                                                            Open card
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                    <div>{user.company || '-'}</div><div>{user.profileVisits}</div><div>{user.profileShares}</div><div>{user.vcfDownloads}</div><div>{user.socialLinkClicks}</div><div>{user.leadCount}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <Section title="Top Active Users This Month" subtitle="Users with the freshest activity in the current month.">
                                            <div className="space-y-3">
                                                {dashboard.insights.topActiveUsersThisMonth.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Last Activity</div><div className="mt-1">{fmtDate(user.lastSeenAt)}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Interactions</div><div className="mt-1">{user.profileVisits} visits / {user.profileShares} shares</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Clicks</div><div className="mt-1">{user.vcfDownloads} downloads / {user.socialLinkClicks} social clicks</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>

                                        <Section title="Worst Converting Cards" subtitle="Cards with meaningful traffic but weak lead conversion right now.">
                                            <div className="space-y-3">
                                                {dashboard.insights.worstConverters.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No weak-conversion cards worth flagging right now.</div>
                                                )}
                                                {dashboard.insights.worstConverters.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Visits</div><div className="mt-1">{user.profileVisits}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Leads / Rate</div><div className="mt-1">{user.leadCount} / {user.conversionRate}%</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Shares / Downloads</div><div className="mt-1">{user.profileShares} / {user.vcfDownloads}</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <Section title="Reactivated Users This Month" subtitle="Users who came back this month after being inactive last month.">
                                            <div className="space-y-3">
                                                {dashboard.insights.reactivatedUsersNow.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No reactivated users this month yet.</div>
                                                )}
                                                {dashboard.insights.reactivatedUsersNow.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 text-sm text-white/65">
                                                            Last login: {fmtDate(user.lastLoginAt, 'Not tracked yet')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>

                                        <Section title="Dropped-Off Users This Month" subtitle="Users who were active last month but have no card activity this month.">
                                            <div className="space-y-3">
                                                {dashboard.insights.newlyInactiveUsersNow.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No newly inactive users this month.</div>
                                                )}
                                                {dashboard.insights.newlyInactiveUsersNow.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 text-sm text-white/65">
                                                            Last login: {fmtDate(user.lastLoginAt, 'Not tracked yet')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <Section title="Best Converting Cards" subtitle="Cards turning visits into real leads most efficiently.">
                                            <div className="space-y-3">
                                                {dashboard.insights.bestConverters.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No strong conversion leaders yet.</div>
                                                )}
                                                {dashboard.insights.bestConverters.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Visits</div><div className="mt-1">{user.profileVisits}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Leads</div><div className="mt-1">{user.leadCount}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Conversion</div><div className="mt-1">{user.conversionRate}%</div></div>
                                                        </div>
                                                        <div className="mt-3 text-sm text-white/55">Last login: {fmtDate(user.lastLoginAt, 'Not tracked yet')}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>

                                        <Section title="Top Lead Generators This Month" subtitle="Users capturing the most new leads this month.">
                                            <div className="space-y-3">
                                                {dashboard.insights.topLeadGeneratorsThisMonth.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No new lead generation has been tracked this month yet.</div>
                                                )}
                                                {dashboard.insights.topLeadGeneratorsThisMonth.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-2">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">New Leads</div><div className="mt-1">{user.leadCount}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Latest Lead</div><div className="mt-1">{fmtDate(user.latestLeadAt)}</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <Section title="Users Who Never Logged In" subtitle="Signed-up users who still have no tracked password login.">
                                            <div className="space-y-3">
                                                {dashboard.insights.neverLoggedInUsers.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">Everyone in the current sample has a recorded login.</div>
                                                )}
                                                {dashboard.insights.neverLoggedInUsers.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Joined</div><div className="mt-1">{fmtDate(user.joinedAt)}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Plan</div><div className="mt-1">{user.plan}</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Card Traffic</div><div className="mt-1">{user.profileVisits} visits</div></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>

                                        <Section title="Declining Users" subtitle="Users whose card activity dropped compared with last month.">
                                            <div className="space-y-3">
                                                {dashboard.insights.decliningUsers.length === 0 && (
                                                    <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No meaningful activity drop-offs this month.</div>
                                                )}
                                                {dashboard.insights.decliningUsers.map((user: any) => (
                                                    <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-semibold text-white">{user.name}</div>
                                                                <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                                <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                            </div>
                                                            <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                                Open card
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Last Month</div><div className="mt-1">{user.previousEvents} events</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">This Month</div><div className="mt-1">{user.currentEvents} events</div></div>
                                                            <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Decline</div><div className="mt-1">{user.declineRate}%</div></div>
                                                        </div>
                                                        <div className="mt-3 text-sm text-white/55">Last login: {fmtDate(user.lastLoginAt, 'Not tracked yet')}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    </div>

                                    <Section title="Top Active Users By Month" subtitle="Monthly leaderboards so you can see which cards dominate each month.">
                                        <div className="grid gap-4 xl:grid-cols-2">
                                            {dashboard.insights.topActiveUsersByMonth.map((month: any) => (
                                                <div key={month.monthKey} className="rounded-2xl border border-white/8 bg-[#0d1319] p-5">
                                                    <div className="mb-4 flex items-center justify-between gap-4">
                                                        <h3 className="text-lg font-semibold text-white">{month.label}</h3>
                                                        <Badge tone="blue">{month.users.length} tracked leaders</Badge>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {month.users.length === 0 && (
                                                            <div className="text-sm text-white/50">No activity leaders for this month.</div>
                                                        )}
                                                        {month.users.map((user: any, index: number) => (
                                                            <div key={`${month.monthKey}-${user.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                                                <div>
                                                                    <div className="font-semibold text-white">{index + 1}. {user.name}</div>
                                                                    <div className="text-xs text-white/45">{user.email}</div>
                                                                    <div className="text-xs text-white/35">{user.company || 'No company set'}</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <Badge tone="orange">{user.events} events</Badge>
                                                                    <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-orange hover:text-cyan-200">
                                                                        Open card
                                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Users With No Recent Card Activity" subtitle={`Customers whose cards have not been used in ${dashboard.filterSummary.rangeLabel.toLowerCase()}.`}>
                                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                            <div className="grid grid-cols-5 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Company</div><div>Last Activity</div><div>Last Action</div><div>Card</div>
                                            </div>
                                            {dashboard.insights.inactiveUsers.length === 0 && (
                                                <div className="px-5 py-10 text-center text-sm text-white/55">
                                                    No inactive users matched the current overview filters and date range.
                                                </div>
                                            )}
                                            {dashboard.insights.inactiveUsers.map((user: any) => (
                                                <div key={user.id} className="grid grid-cols-5 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                    <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div></div>
                                                    <div>{user.company || 'No company set'}</div>
                                                    <div>{fmtDate(user.lastSeenAt, 'No card activity yet')}</div>
                                                    <div>{fmtAction(user.lastCardAction)}</div>
                                                    <div>
                                                        <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-orange hover:text-cyan-200">
                                                            Open card
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {!pageLoading && activeModule === 'users' && usersData && (
                                <>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <Card title="Users Loaded" value={String(usersData.summary.totalShown)} detail="Current results set" />
                                    <Card title="Active In Range" value={String(usersData.summary.activeUsers30d)} detail={usersData.summary.rangeLabel} accent="text-cyan-300" />
                                    <Card title="Login Tracked" value={String(usersData.summary.loginTrackedCount)} detail="Users with a recorded password login" accent="text-white" />
                                    <Card title="No Recent Activity" value={String(usersData.summary.noRecentActivityCount)} detail={`Inactive in ${usersData.summary.rangeLabel.toLowerCase()}`} accent="text-cyan-300" />
                                </div>
                                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-3">
                                    <div className="flex flex-wrap gap-2">
                                        {usersTabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => setUsersTab(tab.key)}
                                                className={`rounded-2xl border px-4 py-3 text-left transition ${
                                                    usersTab === tab.key
                                                        ? 'border-orange/40 bg-orange/15 text-white'
                                                        : 'border-white/8 bg-[#0d1319] text-white/65 hover:border-white/15 hover:text-white'
                                                }`}
                                            >
                                                <div className="text-sm font-semibold">{tab.label}</div>
                                                <div className="mt-1 text-xs text-white/45">{tab.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {usersTab === 'directory' && (
                                <Section title="User Management" subtitle="Review the latest 20 signups, search by name, sort by join date, open business cards, and remove a user's password when needed.">
                                    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/45">
                                        <span>Scroll horizontally to see the access controls</span>
                                        <span className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-[11px] font-semibold text-orange">
                                            Card and password actions on the far right
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto rounded-2xl border border-white/8 bg-[#0d1319]">
                                        <div className="min-w-[1880px]">
                                            <div className="grid grid-cols-[minmax(220px,1.3fr)_minmax(140px,0.8fr)_minmax(170px,0.9fr)_minmax(170px,0.9fr)_minmax(160px,0.8fr)_minmax(170px,0.9fr)_minmax(170px,0.8fr)_minmax(150px,0.7fr)_minmax(170px,0.8fr)_minmax(280px,1.1fr)] gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                <div>User</div><div>Plan</div><div>Last Login</div><div>Last Card Activity</div><div>Joined</div><div>Engagement</div><div>Social + Leads</div><div>Profile Health</div><div>Card</div><div>Access</div>
                                            </div>
                                            {usersData.users.map((user: any) => (
                                                <div key={user.id} className="grid grid-cols-[minmax(220px,1.3fr)_minmax(140px,0.8fr)_minmax(170px,0.9fr)_minmax(170px,0.9fr)_minmax(160px,0.8fr)_minmax(170px,0.9fr)_minmax(170px,0.8fr)_minmax(150px,0.7fr)_minmax(170px,0.8fr)_minmax(280px,1.1fr)] gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div><div className="text-xs text-white/35">{user.company || 'No company set'}</div></div>
                                                <div><div>{user.plan}</div><div className="mt-2"><Badge tone={getStatusTone(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge></div></div>
                                                <div>{fmtDate(user.lastLoginAt, 'Not tracked yet')}</div>
                                                <div><div>{fmtDate(user.lastSeenAt, 'No card activity yet')}</div><div className="mt-2 text-xs text-white/45">{fmtAction(user.lastCardAction)}</div></div>
                                                <div>{fmtDate(user.joinedAt)}</div>
                                                <div><div>{user.profileVisits} visits</div><div className="text-xs text-white/45">{user.profileShares} shares / {user.vcfDownloads} downloads</div></div>
                                                <div><div>{user.socialLinkClicks} social clicks / {user.leadCount} leads</div><div className="text-xs text-white/45">{user.latestLeadAt ? `Latest ${fmtDate(user.latestLeadAt)}` : 'No leads yet'}</div></div>
                                                <div><div className="font-semibold text-white">{user.completeness}% complete</div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-orange to-teil" style={{ width: `${user.completeness}%` }} /></div></div>
                                                <div>
                                                    <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                        Open card
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Badge tone={user.hasPassword ? 'green' : 'neutral'}>
                                                                {user.hasPassword ? 'Password set' : 'No password'}
                                                            </Badge>
                                                        </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewTimeline(user)}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:text-white"
                                                        >
                                                            <CalendarClock className="h-3.5 w-3.5" />
                                                            View timeline
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => void handleClearPassword(user)}
                                                            disabled={!user.hasPassword || passwordActionUserId === user.id}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:border-orange/30 hover:text-orange disabled:cursor-not-allowed disabled:border-white/6 disabled:text-white/30"
                                                        >
                                                            {passwordActionUserId === user.id ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <KeyRound className="h-3.5 w-3.5" />
                                                            )}
                                                            {user.hasPassword ? 'Remove password' : 'Password cleared'}
                                                        </button>
                                                    </div>
                                                </div>
                                                </div>
                                            ))}
                                            {usersData.users.length === 0 && (
                                                <div className="px-5 py-10 text-center text-sm text-white/55">
                                                    No users matched this search yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Section>
                                )}
                                {usersTab === 'activity' && (
                                <div className="grid gap-6 xl:grid-cols-2">
                                    <Section title="Top Recently Active Users" subtitle={`Users ordered by newest card activity within ${usersData.summary.rangeLabel.toLowerCase()}.`}>
                                        <div className="space-y-3">
                                            {usersData.recentlyActiveUsers.map((user: any) => (
                                                <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="font-semibold text-white">{user.name}</div>
                                                            <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                            <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                        </div>
                                                        <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                            Open card
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                    <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Last Card Activity</div><div className="mt-1">{fmtDate(user.lastSeenAt, 'No card activity yet')}</div></div>
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Last Login</div><div className="mt-1">{fmtDate(user.lastLoginAt, 'Not tracked yet')}</div></div>
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Engagement</div><div className="mt-1">{user.profileVisits} visits / {user.profileShares} shares / {user.vcfDownloads} downloads</div></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                    <Section title="Most Engaged Users" subtitle="Users ranked by combined visits, shares, downloads, social clicks, and leads.">
                                        <div className="space-y-3">
                                            {usersData.mostEngagedUsers.map((user: any) => (
                                                <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="font-semibold text-white">{user.name}</div>
                                                            <div className="mt-1 text-sm text-white/45">{user.email}</div>
                                                            <div className="mt-1 text-xs text-white/35">{user.company || 'No company set'}</div>
                                                        </div>
                                                        <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-orange/20 bg-orange/10 px-3 py-2 text-xs font-semibold text-orange transition hover:border-orange/40 hover:text-white">
                                                            Open card
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                    <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-3">
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Visits / Shares</div><div className="mt-1">{user.profileVisits} / {user.profileShares}</div></div>
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Downloads / Social</div><div className="mt-1">{user.vcfDownloads} / {user.socialLinkClicks}</div></div>
                                                        <div><div className="text-xs uppercase tracking-[0.18em] text-white/35">Leads</div><div className="mt-1">{user.leadCount}</div></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                                )}
                                {usersTab === 'watchlist' && (
                                <Section title="Users With No Recent Activity" subtitle={`Recent signups and customers with no card activity in ${usersData.summary.rangeLabel.toLowerCase()}.`}>
                                    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1319]">
                                        <div className="grid grid-cols-5 gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                            <div>User</div><div>Company</div><div>Joined</div><div>Last Activity</div><div>Card</div>
                                        </div>
                                        {usersData.noRecentActivityUsers.length === 0 && (
                                            <div className="px-5 py-10 text-center text-sm text-white/55">
                                                No inactive users matched the current filters and date range.
                                            </div>
                                        )}
                                        {usersData.noRecentActivityUsers.map((user: any) => (
                                            <div key={user.id} className="grid grid-cols-5 gap-4 border-b border-white/6 px-5 py-4 text-sm text-white/75 last:border-b-0">
                                                <div><div className="font-semibold text-white">{user.name}</div><div className="text-xs text-white/45">{user.email}</div></div>
                                                <div>{user.company || 'No company set'}</div>
                                                <div>{fmtDate(user.joinedAt)}</div>
                                                <div>{fmtDate(user.lastSeenAt, 'No card activity yet')}</div>
                                                <div>
                                                    <a href={user.publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-orange hover:text-cyan-200">
                                                        Open card
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                                )}
                                </>
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
                                    {(followUpNotice || followUpError) && (
                                        <div
                                            className={`rounded-2xl border px-5 py-4 text-sm ${
                                                followUpError
                                                    ? 'border-red-500/20 bg-red-500/10 text-red-200'
                                                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                                            }`}
                                        >
                                            {followUpError || followUpNotice}
                                        </div>
                                    )}
                                    {(digestNotice || digestError) && (
                                        <div
                                            className={`rounded-2xl border px-5 py-4 text-sm ${
                                                digestError
                                                    ? 'border-red-500/20 bg-red-500/10 text-red-200'
                                                    : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100'
                                            }`}
                                        >
                                            {digestError || digestNotice}
                                        </div>
                                    )}
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
                                    <Section
                                        title="Recently Updated Deals"
                                        subtitle="The CRM deals your team touched most recently."
                                        actions={
                                            <div className="flex flex-wrap items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => void handleSendWeeklyDigest()}
                                                    disabled={digestSending}
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {digestSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
                                                    {digestSending ? 'Sending dashboard digest...' : 'Send last 2 weeks digest'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleSendDueFollowUps()}
                                                    disabled={followUpSending}
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-orange/20 bg-orange/10 px-4 py-3 text-sm font-semibold text-orange transition hover:border-orange/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {followUpSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    {followUpSending ? 'Sending follow-ups...' : 'Send due follow-ups'}
                                                </button>
                                            </div>
                                        }
                                    >
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

                            {timelineUser && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                                    <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#081118] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
                                        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.24em] text-orange/80">User timeline</p>
                                                <h3 className="mt-3 text-2xl font-bold text-white">{timelineUser.name}</h3>
                                                <p className="mt-2 text-sm text-white/50">
                                                    Important account, card, lead, billing, and CRM events in {(timelineData?.range?.label || usersData?.summary?.rangeLabel || filters.range).toString().toLowerCase()}.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTimelineUser(null);
                                                    setTimelineData(null);
                                                    setTimelineError(null);
                                                }}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange/30 hover:text-orange"
                                            >
                                                <X className="h-4 w-4" />
                                                Close
                                            </button>
                                        </div>
                                        <div className="space-y-6 overflow-y-auto p-6">
                                            {timelineError && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">{timelineError}</div>}
                                            {timelineLoading && (
                                                <div className="flex min-h-[260px] items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-orange" />
                                                </div>
                                            )}
                                            {!timelineLoading && timelineData && (
                                                <>
                                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                                        <Card title="Joined" value={fmtDate(timelineData.user.joinedAt, 'Unknown')} detail="Account creation" />
                                                        <Card title="Last login" value={fmtDate(timelineData.user.lastLoginAt, 'Not tracked')} detail="Latest password login" accent="text-cyan-300" />
                                                        <Card title="Last card activity" value={fmtDate(timelineData.user.lastSeenAt, 'No card activity')} detail="Newest tracked card event" accent="text-white" />
                                                        <Card title="Profile health" value={`${timelineData.user.completeness}%`} detail={`${timelineData.user.leadCount} total leads`} accent="text-cyan-300" />
                                                    </div>
                                                    <Section
                                                        title="Timeline"
                                                        subtitle="Signup, login, card activity, leads, subscription, and CRM milestones."
                                                        actions={
                                                            <a
                                                                href={timelineData.user.publicProfileUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-2xl border border-orange/20 bg-orange/10 px-4 py-3 text-sm font-semibold text-orange transition hover:border-orange/40 hover:text-white"
                                                            >
                                                                Open card
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            </a>
                                                        }
                                                    >
                                                        <div className="space-y-4">
                                                            {timelineData.timeline.length === 0 && (
                                                                <div className="rounded-2xl border border-white/8 bg-[#0d1319] p-4 text-sm text-white/55">No timeline events were found in the selected range.</div>
                                                            )}
                                                            {timelineData.timeline.map((event: any) => (
                                                                <div key={`${event.type}-${event.timestamp}-${event.title}`} className="rounded-2xl border border-white/8 bg-[#0d1319] p-4">
                                                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                                        <div>
                                                                            <div className="font-semibold text-white">{event.title}</div>
                                                                            <div className="mt-2 text-sm text-white/60">{event.detail}</div>
                                                                        </div>
                                                                        <div className="md:text-right">
                                                                            <Badge tone="blue">{event.source}</Badge>
                                                                            <div className="mt-2 text-sm text-white/55">{fmtDate(event.timestamp)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Section>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
