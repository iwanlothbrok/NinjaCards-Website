'use client';

import React from 'react';
import { useRouter, type Href } from '@/navigation';
import { useRouter as useNextRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  PROFILE_BIG_TABS,
  PROFILE_BUILDER_TAB,
  PROFILE_DELETE_TAB,
  PROFILE_SETTINGS_TABS,
  ProfileIcons,
  type ProfileTabDef,
  resolveProfileHref,
} from './profileNavigation';

export default function ProfileTabs() {
  const { user, loading } = useAuth()
  const t = useTranslations('ProfileTabs')
  const router = useRouter()
  const nextRouter = useNextRouter()
  const locale = useLocale()
  const userId = user?.id ? String(user.id) : null
  const [navigating, setNavigating] = React.useState(false)

  React.useEffect(() => {
    if (loading) return
    if (!user) router.replace('/')
  }, [loading, user, router])

  const go = (tab: ProfileTabDef) => {
    const href = resolveProfileHref(tab, userId, user?.slug)
    if (!href) return
    setNavigating(true)
    if (typeof href === 'string' && href.startsWith('/p/')) {
      nextRouter.push(`/${locale}${href}`)
    } else {
      router.push(href as Href)
    }
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

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => go(PROFILE_BUILDER_TAB)}
            className="w-full rounded-[28px] border border-amber-400/20 bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.05))] p-5 text-left shadow-[0_10px_35px_rgba(245,158,11,0.10)] transition hover:border-amber-400/35"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/12">
                  <ProfileIcons.idCard className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/70">
                    {t('builderCta.eyebrow')}
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-white">
                    {t('builderCta.title')}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                    {t('builderCta.description')}
                  </p>
                </div>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white sm:block">
                {t('builderCta.button')}
              </div>
            </div>
          </motion.button>

          {/* ── BIG 6 — 2 колони, огромен touch target ── */}
          <div className="grid grid-cols-2 gap-3">
            {PROFILE_BIG_TABS.map((tab, i) => {
              const disabled = !tab.href && !userId
              const Icon = ProfileIcons[tab.icon]
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
              {PROFILE_SETTINGS_TABS.map((tab, i) => {
                const Icon = ProfileIcons[tab.icon]
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
                    <ProfileIcons.arrow className="w-4 h-4 text-gray-700 flex-shrink-0" />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* ── Delete — отделен, червен ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <button
              onClick={() => go(PROFILE_DELETE_TAB)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-red-500/15 bg-red-500/[0.04] hover:bg-red-500/[0.08] hover:border-red-500/30 active:bg-red-500/[0.12] transition-all text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20">
                <ProfileIcons.delete className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-red-400">{t('tabs.delete.label')}</p>
                <p className="text-[11px] text-red-500/50">{t('tabs.delete.desc')}</p>
              </div>
              <ProfileIcons.arrow className="w-4 h-4 text-red-800 flex-shrink-0" />
            </button>
          </motion.div>

        </div>
      </div>
    </>
  )
}
