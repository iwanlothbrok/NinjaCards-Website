import type { NextApiRequest } from 'next';
import type { Prisma } from '@prisma/client';

export type AdminRangeKey = 'today' | '7d' | '30d' | '90d' | 'thisMonth' | 'lastMonth' | '12m';
export type AdminFilterValue =
    | 'all'
    | 'yes'
    | 'no'
    | 'active'
    | 'inactive'
    | 'tracked'
    | 'never'
    | 'low'
    | 'medium'
    | 'high';

export type AdminFilters = {
    range: AdminRangeKey;
    plan: string;
    subscriptionStatus: string;
    hasSlug: AdminFilterValue;
    hasLeads: AdminFilterValue;
    loginState: AdminFilterValue;
    activityState: AdminFilterValue;
    completenessBand: AdminFilterValue;
};

export type AdminRangeWindow = {
    key: AdminRangeKey;
    label: string;
    start: Date;
    end: Date;
};

const VALID_RANGES: AdminRangeKey[] = ['today', '7d', '30d', '90d', 'thisMonth', 'lastMonth', '12m'];

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, delta: number) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function daysAgo(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function normalizeEnumLikeValue(value: string) {
    return value.trim();
}

export function getAdminRangeWindow(range: AdminRangeKey, now = new Date()): AdminRangeWindow {
    const safeNow = new Date(now);

    switch (range) {
        case 'today':
            return { key: range, label: 'Today', start: startOfDay(safeNow), end: safeNow };
        case '7d':
            return { key: range, label: 'Last 7 days', start: daysAgo(7), end: safeNow };
        case '90d':
            return { key: range, label: 'Last 90 days', start: daysAgo(90), end: safeNow };
        case 'thisMonth':
            return { key: range, label: 'This month', start: startOfMonth(safeNow), end: safeNow };
        case 'lastMonth': {
            const start = shiftMonth(startOfMonth(safeNow), -1);
            return { key: range, label: 'Last month', start, end: shiftMonth(start, 1) };
        }
        case '12m':
            return { key: range, label: 'Last 12 months', start: shiftMonth(startOfMonth(safeNow), -11), end: safeNow };
        case '30d':
        default:
            return { key: '30d', label: 'Last 30 days', start: daysAgo(30), end: safeNow };
    }
}

function getQueryValue(query: NextApiRequest['query'], key: string) {
    const value = query[key];
    return typeof value === 'string' ? value.trim() : '';
}

export function parseAdminFilters(query: NextApiRequest['query']): AdminFilters {
    const rangeCandidate = getQueryValue(query, 'range') as AdminRangeKey;
    const range = VALID_RANGES.includes(rangeCandidate) ? rangeCandidate : '30d';

    return {
        range,
        plan: getQueryValue(query, 'plan') || 'all',
        subscriptionStatus: getQueryValue(query, 'subscriptionStatus') || 'all',
        hasSlug: (getQueryValue(query, 'hasSlug') as AdminFilterValue) || 'all',
        hasLeads: (getQueryValue(query, 'hasLeads') as AdminFilterValue) || 'all',
        loginState: (getQueryValue(query, 'loginState') as AdminFilterValue) || 'all',
        activityState: (getQueryValue(query, 'activityState') as AdminFilterValue) || 'all',
        completenessBand: (getQueryValue(query, 'completenessBand') as AdminFilterValue) || 'all',
    };
}

export function buildAdminUserWhere(filters: AdminFilters, q?: string): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    const andClauses: Prisma.UserWhereInput[] = [];

    if (q) {
        andClauses.push({
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
            ],
        });
    }

    if (filters.plan !== 'all') {
        andClauses.push({
            subscription: {
                is: {
                    plan: normalizeEnumLikeValue(filters.plan) as never,
                },
            },
        });
    }

    if (filters.subscriptionStatus !== 'all') {
        if (filters.subscriptionStatus === 'none') {
            andClauses.push({ subscription: { is: null } });
        } else {
            andClauses.push({
                subscription: {
                    is: {
                        status: normalizeEnumLikeValue(filters.subscriptionStatus) as never,
                    },
                },
            });
        }
    }

    if (filters.hasSlug === 'yes') {
        andClauses.push({ slug: { not: null } });
    } else if (filters.hasSlug === 'no') {
        andClauses.push({ OR: [{ slug: null }, { slug: '' }] });
    }

    if (filters.hasLeads === 'yes') {
        andClauses.push({ leads: { some: {} } });
    } else if (filters.hasLeads === 'no') {
        andClauses.push({ leads: { none: {} } });
    }

    if (filters.loginState === 'tracked') {
        andClauses.push({ lastLoginAt: { not: null } });
    } else if (filters.loginState === 'never') {
        andClauses.push({ lastLoginAt: null });
    }

    if (andClauses.length > 0) {
        where.AND = andClauses;
    }

    return where;
}

export function profileCompleteness(user: {
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
    position?: string | null;
    phone1?: string | null;
    bio?: string | null;
    image?: string | null;
    slug?: string | null;
    website?: string | null;
    linkedin?: string | null;
}) {
    const fields = [
        user.firstName,
        user.lastName,
        user.company,
        user.position,
        user.phone1,
        user.bio,
        user.image,
        user.slug,
        user.website,
        user.linkedin,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
}

export function matchesCompletenessBand(completeness: number, band: AdminFilterValue) {
    if (band === 'all') return true;
    if (band === 'low') return completeness < 40;
    if (band === 'medium') return completeness >= 40 && completeness < 75;
    if (band === 'high') return completeness >= 75;
    return true;
}

export function matchesActivityState(lastSeenAt: Date | string | null | undefined, filters: AdminFilters, windowStart: Date) {
    if (filters.activityState === 'all') return true;
    const timestamp = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;
    const isActive = timestamp >= windowStart.getTime();
    return filters.activityState === 'active' ? isActive : !isActive;
}

export function buildFilterSummary(filters: AdminFilters) {
    const labels: string[] = [getAdminRangeWindow(filters.range).label];

    if (filters.plan !== 'all') labels.push(`Plan: ${filters.plan}`);
    if (filters.subscriptionStatus !== 'all') labels.push(`Subscription: ${filters.subscriptionStatus}`);
    if (filters.hasSlug !== 'all') labels.push(filters.hasSlug === 'yes' ? 'Has slug' : 'No slug');
    if (filters.hasLeads !== 'all') labels.push(filters.hasLeads === 'yes' ? 'Has leads' : 'No leads');
    if (filters.loginState !== 'all') labels.push(filters.loginState === 'tracked' ? 'Login tracked' : 'Never logged in');
    if (filters.activityState !== 'all') labels.push(filters.activityState === 'active' ? 'Active users' : 'Inactive users');
    if (filters.completenessBand !== 'all') labels.push(`Completeness: ${filters.completenessBand}`);

    return labels;
}
