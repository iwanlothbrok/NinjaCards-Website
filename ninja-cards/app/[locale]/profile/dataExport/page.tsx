'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTranslations } from 'next-intl'

const SpinnerIcon = ({ className }: { className?: string }) => (
    <div className={`rounded-full border border-current border-t-transparent animate-spin ${className ?? 'w-3.5 h-3.5'}`} />
)

// ─── What's included in the export ───────────────────────────────────────────
const EXPORT_SECTIONS = [
    { icon: '👤', key: 'profile' },
    { icon: '📇', key: 'card' },
    { icon: '📊', key: 'analytics' },
    { icon: '🧲', key: 'leads' },
    { icon: '💳', key: 'subscription' },
    { icon: '🧾', key: 'invoices' },
]

export default function DataExportPage() {
    const { user } = useAuth()
    const t = useTranslations('dataExport')

    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')
    const [canExport, setCanExport] = useState<boolean | null>(null)
    const [upgradeReason, setUpgradeReason] = useState('')

    React.useEffect(() => {
        if (!user?.id) return

        const loadEntitlements = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/subscription/me`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id }),
                })
                const data = await res.json().catch(() => ({}))
                const exportAllowed = Boolean(data?.entitlements?.canExportLeads)
                setCanExport(exportAllowed)
                if (!exportAllowed) {
                    setUpgradeReason('Export is available on Pro and Teams plans.')
                }
            } catch {
                setCanExport(false)
                setUpgradeReason('Could not verify your plan right now.')
            }
        }

        void loadEntitlements()
    }, [user?.id])

    const handleExport = async () => {
        if (!user?.id) return
        if (canExport === false) {
            setError(upgradeReason || 'Export is available on Pro and Teams plans.')
            return
        }
        setLoading(true)
        setDone(false)
        setError('')

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/export-data?userId=${user.id}`)

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error ?? t('errors.generic'))
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `ninja-card-data-${user.id.slice(0, 8)}.json`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)

            setDone(true)
            setTimeout(() => setDone(false), 5000)
        } catch (err: any) {
            setError(err.message || t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8 text-gray-200"
            style={{
                background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(59,130,246,0.06) 0%, transparent 55%), #080A0F',
            }}
        >
            {/* Grid texture */}
            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.018,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

            <div className="max-w-2xl mx-auto space-y-14">

                {/* ── Header ── */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.5 }}
                    className="space-y-1"
                >
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-blue-500/65">
                        {t('subtitle')}
                    </p>
                    <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
                        {t('title')}
                    </h1>
                </motion.header>

                {canExport === false && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4"
                    >
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-400/75 mb-1">
                            Pro Feature
                        </p>
                        <p className="text-sm text-amber-100/85 leading-relaxed">
                            {upgradeReason}
                        </p>
                        <button
                            onClick={() => { window.location.href = '/lp-1'; }}
                            className="mt-4 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-amber-400"
                        >
                            Upgrade to Pro
                        </button>
                    </motion.div>
                )}

                {/* ── Error banner ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm font-medium"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Success banner ── */}
                <AnimatePresence>
                    {done && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {t('success')}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Account chip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.13 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.055] bg-white/[0.02]"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-0.5">{t('accountLabel')}</p>
                        <p className="text-white font-semibold truncate">{user?.email}</p>
                    </div>
                </motion.div>

                {/* ── What's included card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="rounded-2xl border border-white/[0.055] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                    <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">
                            {t('included.title')}
                        </p>
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                        {EXPORT_SECTIONS.map(({ icon, key }, i) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.22 + i * 0.05 }}
                                className="flex items-center gap-4 px-7 py-4 hover:bg-white/[0.025] transition-colors duration-200"
                            >
                                <span className="text-base">{icon}</span>
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-300 font-medium">{t(`included.items.${key}.label`)}</p>
                                    <p className="text-[11px] text-gray-600 mt-0.5">{t(`included.items.${key}.desc`)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── GDPR info box ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                    className="flex items-start gap-3.5 px-5 py-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.05]"
                >
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-200/70 leading-relaxed">{t('gdprNote')}</p>
                </motion.div>

                {/* ── Download button ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 }}
                >
                    <button
                        onClick={handleExport}
                        disabled={loading || canExport === false}
                        className="w-full py-3.5 rounded-xl border border-blue-500/30 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                        style={{ background: loading ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.2)' }}
                        onMouseEnter={e => { if (!loading && canExport !== false) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.28)' }}
                        onMouseLeave={e => { if (!loading && canExport !== false) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.2)' }}
                    >
                        {loading ? (
                            <><SpinnerIcon /> {t('downloadingButton')}</>
                        ) : done ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {t('downloadedButton')}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t('downloadButton')}
                            </>
                        )}
                    </button>
                </motion.div>

            </div>
        </motion.div>
    )
}
