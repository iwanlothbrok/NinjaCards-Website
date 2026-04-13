import React from 'react';
import type { Href } from '@/navigation';

export type ProfileIconKey =
  | 'home'
  | 'idCard'
  | 'user'
  | 'chart'
  | 'link'
  | 'qr'
  | 'globe'
  | 'lock'
  | 'info'
  | 'email'
  | 'image'
  | 'eye'
  | 'location'
  | 'video'
  | 'billing'
  | 'delete'
  | 'optimize'
  | 'googleWallet'
  | 'arrow'
  | 'spark'
  | 'copy'
  | 'settings';

export type ProfileTabDef = {
  labelKey: string;
  icon: ProfileIconKey;
  accent: string;
  href?: Href | string;
  buildHref?: (id: string, slug?: string) => Href | string;
};

export type DashboardNavGroup = {
  key: string;
  titleKey: string;
  items: ProfileTabDef[];
};

export const ProfileIcons: Record<
  ProfileIconKey,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  home: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  idCard: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2" />
      <path strokeLinecap="round" d="M13 10h4M13 14h4" />
    </svg>
  ),
  user: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chart: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
    </svg>
  ),
  link: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.1-1.1m-.758-4.9a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  qr: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path strokeLinecap="round" d="M14 14h3v3h-3zM17 17h3v3h-3z" />
    </svg>
  ),
  globe: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  lock: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  info: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  email: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </svg>
  ),
  image: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" d="M21 15l-5-5L5 21" />
    </svg>
  ),
  eye: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  location: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  ),
  video: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
    </svg>
  ),
  billing: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path strokeLinecap="round" d="M1 10h22" />
    </svg>
  ),
  delete: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
    </svg>
  ),
  optimize: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12" />
    </svg>
  ),
  googleWallet: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 14h3" />
    </svg>
  ),
  arrow: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  spark: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
  copy: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <path strokeLinecap="round" d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    </svg>
  ),
  settings: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 0 1 3.35 0 1.724 1.724 0 0 0 2.573 1.066 1.724 1.724 0 0 1 2.356 2.356 1.724 1.724 0 0 0 1.066 2.573 1.724 1.724 0 0 1 0 3.35 1.724 1.724 0 0 0-1.066 2.573 1.724 1.724 0 0 1-2.356 2.356 1.724 1.724 0 0 0-2.573 1.066 1.724 1.724 0 0 1-3.35 0 1.724 1.724 0 0 0-2.573-1.066 1.724 1.724 0 0 1-2.356-2.356 1.724 1.724 0 0 0-1.066-2.573 1.724 1.724 0 0 1 0-3.35 1.724 1.724 0 0 0 1.066-2.573 1.724 1.724 0 0 1 2.356-2.356 1.724 1.724 0 0 0 2.573-1.066Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export const PROFILE_BUILDER_TAB: ProfileTabDef = {
  labelKey: 'builder',
  icon: 'idCard',
  accent: '#f59e0b',
  href: '/profile/create',
};

export const PROFILE_BIG_TABS: ProfileTabDef[] = [
  {
    labelKey: 'businessCard',
    icon: 'idCard',
    accent: '#f59e0b',
    buildHref: (id, slug) => (slug ? `/p/${slug}` : ({ pathname: '/profileDetails/[id]', params: { id } } as const)),
  },
  { labelKey: 'clients', icon: 'user', accent: '#60a5fa', href: '/profile/subscribed' },
  { labelKey: 'analyse', icon: 'chart', accent: '#4ade80', href: '/analyse' },
  { labelKey: 'links', icon: 'link', accent: '#a78bfa', href: '/profile/links' },
  { labelKey: 'qr', icon: 'qr', accent: '#f59e0b', href: '/profile/profileQr' },
  { labelKey: 'language', icon: 'globe', accent: '#34d399', href: '/profile/changeLanguage' },
];

export const PROFILE_SETTINGS_TABS: ProfileTabDef[] = [
  { labelKey: 'info', icon: 'info', accent: '#9ca3af', href: '/profile/information' },
  { labelKey: 'changeImage', icon: 'image', accent: '#9ca3af', href: '/profile/changeImage' },
  { labelKey: 'cover', icon: 'image', accent: '#9ca3af', href: '/profile/cover' },
  { labelKey: 'changePassword', icon: 'lock', accent: '#9ca3af', href: '/profile/settings' },
  { labelKey: 'changeEmail', icon: 'email', accent: '#9ca3af', href: '/profile/changeEmail' },
  { labelKey: 'features', icon: 'eye', accent: '#9ca3af', href: '/profile/features' },
  { labelKey: 'help', icon: 'location', accent: '#9ca3af', href: '/profile/help' },
  { labelKey: 'billing', icon: 'billing', accent: '#9ca3af', href: '/profile/billing' },
  { labelKey: 'video', icon: 'video', accent: '#9ca3af', href: '/profile/video' },
  { labelKey: 'optimize', icon: 'optimize', accent: '#9ca3af', href: '/profile/optimizeProfile' },
  { labelKey: 'googleWallet', icon: 'googleWallet', accent: '#9ca3af', href: '/profile/googleWallet' },
];

export const PROFILE_DELETE_TAB: ProfileTabDef = {
  labelKey: 'delete',
  icon: 'delete',
  accent: '#ef4444',
  href: '/profile/delete',
};

export const PROFILE_DASHBOARD_GROUPS: DashboardNavGroup[] = [
  {
    key: 'home',
    titleKey: 'sections.home',
    items: [
      { labelKey: 'dashboard', icon: 'home', accent: '#111827', href: '/profileTest' },
      PROFILE_BUILDER_TAB,
    ],
  },
  {
    key: 'card',
    titleKey: 'sections.card',
    items: [
      PROFILE_BIG_TABS[0],
      { labelKey: 'slug', icon: 'link', accent: '#0f172a', href: '/profile/slug' },
      PROFILE_BIG_TABS[3],
      PROFILE_BIG_TABS[4],
    ],
  },
  {
    key: 'leads',
    titleKey: 'sections.leads',
    items: [PROFILE_BIG_TABS[1], PROFILE_BIG_TABS[2]],
  },
  {
    key: 'tools',
    titleKey: 'sections.tools',
    items: [
      PROFILE_SETTINGS_TABS[8],
      PROFILE_SETTINGS_TABS[9],
      PROFILE_SETTINGS_TABS[10],
      { labelKey: 'abTester', icon: 'spark', accent: '#0f172a', href: '/profile/aB-tester' },
    ],
  },
  {
    key: 'settings',
    titleKey: 'sections.settings',
    items: [
      PROFILE_SETTINGS_TABS[0],
      PROFILE_SETTINGS_TABS[1],
      PROFILE_SETTINGS_TABS[2],
      PROFILE_SETTINGS_TABS[3],
      PROFILE_SETTINGS_TABS[4],
      PROFILE_SETTINGS_TABS[5],
      PROFILE_SETTINGS_TABS[6],
      PROFILE_SETTINGS_TABS[7],
    ],
  },
];

export function resolveProfileHref(
  tab: ProfileTabDef,
  userId: string | null,
  slug?: string
): Href | string | null {
  if (tab.href) {
    return tab.href;
  }
  if (userId && tab.buildHref) {
    return tab.buildHref(userId, slug);
  }
  return null;
}
