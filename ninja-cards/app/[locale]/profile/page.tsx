'use client';

import React from 'react';
import { useRouter, type Href } from '@/navigation';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Icons: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  idCard: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="12" r="2" /><path strokeLinecap="round" d="M13 10h4M13 14h4" /></svg>,
  user: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  chart: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  link: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.758-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  qr: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path strokeLinecap="round" d="M14 14h3v3h-3zM17 17h3v3h-3z" /></svg>,
  globe: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
  lock: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="5" y="11" width="14" height="10" rx="2" /><path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" /></svg>,
  info: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 16v-4M12 8h.01" /></svg>,
  email: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  image: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" d="M21 15l-5-5L5 21" /></svg>,
  eye: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  location: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>,
  video: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>,
  billing: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="4" width="22" height="16" rx="2" /><path strokeLinecap="round" d="M1 10h22" /></svg>,
  changelog: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  delete: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,

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

  arrow: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>,
}

type TabDef = { labelKey: string; icon: string; accent: string; href?: Href; buildHref?: (id: string) => Href }

const BIG_TABS: TabDef[] = [
  { labelKey: 'businessCard', icon: 'idCard', accent: '#f59e0b', buildHref: (id) => ({ pathname: '/profileDetails/[id]', params: { id } } as const) },
  { labelKey: 'clients', icon: 'user', accent: '#60a5fa', href: '/profile/subscribed' },
  { labelKey: 'analyse', icon: 'chart', accent: '#4ade80', href: '/analyse' },
  { labelKey: 'links', icon: 'link', accent: '#a78bfa', href: '/profile/links' },
  { labelKey: 'qr', icon: 'qr', accent: '#f59e0b', href: '/profile/profileQr' },
  { labelKey: 'language', icon: 'globe', accent: '#34d399', href: '/profile/changeLanguage' },
]

const SETTINGS_TABS: TabDef[] = [
  { labelKey: 'info', icon: 'info', accent: '#9ca3af', href: '/profile/information' },
  { labelKey: 'changeImage', icon: 'image', accent: '#9ca3af', href: '/profile/changeImage' },
  { labelKey: 'cover', icon: 'video', accent: '#9ca3af', href: '/profile/cover' },
  { labelKey: 'changePassword', icon: 'lock', accent: '#9ca3af', href: '/profile/settings' },
  { labelKey: 'changeEmail', icon: 'email', accent: '#9ca3af', href: '/profile/changeEmail' },
  { labelKey: 'features', icon: 'eye', accent: '#9ca3af', href: '/profile/features' },
  { labelKey: 'help', icon: 'location', accent: '#9ca3af', href: '/profile/help' },
  { labelKey: 'billing', icon: 'billing', accent: '#9ca3af', href: '/profile/billing' },
  { labelKey: "video", icon: "video", accent: "#9ca3af", href: "/profile/video" },
  { labelKey: "optimize", icon: "optimize", accent: "#9ca3af", href: "/profile/optimizeProfile" },
  { labelKey: "googleWallet", icon: "googleWallet", accent: "#9ca3af", href: "/profile/googleWallet" },
  // { labelKey: 'changelog', icon: 'changelog', accent: '#9ca3af', href: '/changelog' },
]

const DELETE_TAB: TabDef = { labelKey: 'delete', icon: 'delete', accent: '#ef4444', href: '/profile/delete' }

export default function ProfileTabs() {
  const { user, loading } = useAuth()
  const t = useTranslations('ProfileTabs')
  const router = useRouter()
  const userId = user?.id ? String(user.id) : null
  const [navigating, setNavigating] = React.useState(false)

  React.useEffect(() => {
    if (loading) return
    if (!user) router.replace('/')
  }, [loading, user, router])

  const go = (tab: TabDef) => {
    const href = tab.href ?? (userId && tab.buildHref ? tab.buildHref(userId) : null)
    if (!href) return
    setNavigating(true)
    router.push(href)
  }

  const firstName = user
    ? (user.firstName || (user.name?.split(' ')[0]) || '')
    : ''

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
          </div>
        </div>
      )}

      <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6"
        style={{ background: 'radial-gradient(ellipse 100% 50% at 50% -5%, rgba(245,158,11,0.07) 0%, transparent 60%), #080A0F' }}>

        <div className="fixed inset-0 -z-10 pointer-events-none" style={{
          opacity: 0.015,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }} />

        <div className="max-w-lg mx-auto space-y-8">

          {/* ── Greeting ── */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/60 mb-1">{t('subtitle')}</p>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {firstName ? `${t('greeting')}, ${firstName} 👋` : t('title')}
            </h1>
          </motion.div>

          {/* ── BIG 6 — 2 колони, огромен touch target ── */}
          <div className="grid grid-cols-2 gap-3">
            {BIG_TABS.map((tab, i) => {
              const disabled = !tab.href && !userId
              const Icon = Icons[tab.icon]
              return (
                <motion.button
                  key={tab.labelKey}
                  onClick={() => !disabled && go(tab)}
                  disabled={disabled}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex flex-col items-start gap-3 px-5 pt-5 pb-4 rounded-2xl text-left transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: `${tab.accent}0d`, border: `1px solid ${tab.accent}28` }}
                  onMouseEnter={e => {
                    if (disabled) return
                    const el = e.currentTarget
                    el.style.background = `${tab.accent}18`
                    el.style.border = `1px solid ${tab.accent}55`
                    el.style.boxShadow = `0 8px 28px ${tab.accent}18`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = `${tab.accent}0d`
                    el.style.border = `1px solid ${tab.accent}28`
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${tab.accent}18`, border: `1px solid ${tab.accent}35` }}>
                    <Icon className="w-6 h-6" style={{ color: tab.accent }} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white leading-tight">
                      {t(`tabs.${tab.labelKey}.label`)}
                    </p>
                    <p className="text-[11px] mt-0.5 leading-snug" style={{ color: `${tab.accent}80` }}>
                      {t(`tabs.${tab.labelKey}.desc`)}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* ── Settings list ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600 mb-3">{t('moreOptions')}</p>
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {SETTINGS_TABS.map((tab, i) => {
                const Icon = Icons[tab.icon]
                return (
                  <motion.button
                    key={tab.labelKey}
                    onClick={() => go(tab)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.42 + i * 0.03 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.05]">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white">{t(`tabs.${tab.labelKey}.label`)}</p>
                      <p className="text-[11px] text-gray-600 truncate">{t(`tabs.${tab.labelKey}.desc`)}</p>
                    </div>
                    <Icons.arrow className="w-4 h-4 text-gray-700 flex-shrink-0" />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* ── Delete — отделен, червен ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <button
              onClick={() => go(DELETE_TAB)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-red-500/15 bg-red-500/[0.04] hover:bg-red-500/[0.08] hover:border-red-500/30 active:bg-red-500/[0.12] transition-all text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20">
                <Icons.delete className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-red-400">{t('tabs.delete.label')}</p>
                <p className="text-[11px] text-red-500/50">{t('tabs.delete.desc')}</p>
              </div>
              <Icons.arrow className="w-4 h-4 text-red-800 flex-shrink-0" />
            </button>
          </motion.div>

        </div>
      </div>
    </>
  )
}