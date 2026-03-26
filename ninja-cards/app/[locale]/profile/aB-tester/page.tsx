'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BASE_API_URL } from '@/utils/constants'
import { useTranslations } from 'next-intl'
import { useAuth } from '../../context/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ABVariant { label: string; value: string }
interface ABTest {
    id: string
    field: string
    hypothesis: string
    expectedImpact: string
    before: ABVariant
    after: ABVariant
}
interface ABResult {
    overallInsight: string
    tests: ABTest[]
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const SpinnerIcon = ({ className }: { className?: string }) => (
    <div className={`rounded-full border-2 border-current border-t-transparent animate-spin ${className ?? 'w-4 h-4'}`} />
)
const SparkleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

// ─── Mini Card Preview ────────────────────────────────────────────────────────
function MiniCard({ name, position, company, bio, tag, accent = '#f59e0b' }: {
    name: string; position?: string; company?: string; bio?: string
    tag: string; accent?: string
}) {
    return (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid rgba(255,255,255,0.07)`, background: '#0a0c10' }}>
            <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: `${accent}12`, borderBottom: `1px solid ${accent}20` }}>
                <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: accent }}>{tag}</span>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                        style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}>
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        {position && <p className="text-[11px] truncate" style={{ color: accent }}>{position}</p>}
                        {company && <p className="text-[10px] text-gray-600 truncate">{company}</p>}
                    </div>
                </div>
                {bio && <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{bio}</p>}
                <div className="flex gap-1.5 mt-3">
                    <div className="flex-1 h-7 rounded-lg" style={{ background: `${accent}cc` }} />
                    <div className="flex-1 h-7 rounded-lg bg-white/[0.06]" />
                    <div className="flex-1 h-7 rounded-lg bg-white/[0.06]" />
                </div>
            </div>
        </div>
    )
}

// ─── AB Test Card ─────────────────────────────────────────────────────────────
function ABTestCard({ test, user, onApply, applying }: {
    test: ABTest; user: any
    onApply: (testId: string, value: string) => void
    applying: string | null
}) {
    const [view, setView] = useState<'before' | 'after'>('before')
    const [applied, setApplied] = useState(false)

    const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Вашето Име'

    const getPreviewProps = (variant: 'before' | 'after') => {
        const value = variant === 'before' ? test.before.value : test.after.value
        switch (test.id) {
            case 'title': return { name, position: value, company: user.company, bio: user.bio }
            case 'bio': return { name, position: user.position, company: user.company, bio: value }
            case 'cta': return { name, position: user.position, company: user.company, bio: value }
            default: return { name, position: user.position, company: user.company, bio: user.bio }
        }
    }

    const handleApply = async () => {
        await onApply(test.id, test.after.value)
        setApplied(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/[0.055] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
        >
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            <div className="px-5 py-4 border-b border-white/[0.05] flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-500/70">
                            A/B Test · {test.field}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            {test.expectedImpact}
                        </span>
                    </div>
                    <p className="text-[12px] text-gray-400 leading-relaxed">{test.hypothesis}</p>
                </div>
            </div>

            <div className="px-5 pt-4 pb-2">
                <div className="flex p-1 gap-1 rounded-xl w-fit bg-black/30 border border-white/[0.055]">
                    {(['before', 'after'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className="px-5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all"
                            style={view === v ? { background: '#f59e0b', color: '#000' } : { color: 'rgba(255,255,255,0.3)' }}>
                            {v === 'before' ? '← Текущо' : 'Вариант →'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-5 pb-4 space-y-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: view === 'after' ? 12 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <MiniCard
                            {...getPreviewProps(view)}
                            tag={view === 'before' ? test.before.label : test.after.label}
                            accent={view === 'before' ? '#6b7280' : '#f59e0b'}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-1.5">
                        {view === 'before' ? test.before.label : test.after.label}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {view === 'before' ? test.before.value : test.after.value}
                    </p>
                </div>

                {!applied ? (
                    <button
                        onClick={handleApply}
                        disabled={applying === test.id}
                        onMouseEnter={() => setView('after')}
                        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: applying === test.id ? 'none' : '0 6px 20px rgba(245,158,11,0.3)',
                        }}
                    >
                        {applying === test.id
                            ? <><SpinnerIcon className="w-4 h-4" /> Прилага се...</>
                            : <><SparkleIcon /> Приложи вариант B</>
                        }
                    </button>
                ) : (
                    <div className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        ✓ Приложено успешно
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ABTesterPage() {
    const { user } = useAuth()
    const t = useTranslations('abTester')

    // ── ALL hooks must be before any early return ──────────────────────────────
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ABResult | null>(null)
    const [error, setError] = useState('')
    const [applying, setApplying] = useState<string | null>(null)
    const [stats, setStats] = useState({ visits: 0, leads: 0, downloads: 0, shares: 0, clicks: 0 })

    useEffect(() => {
        if (!user?.id) return
        const fetchStats = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/dashboard/${user.id}`)
                if (!res.ok) return
                const data = await res.json()
                setStats({
                    visits: data.profileVisits ?? 0,
                    leads: data.leads ?? 0,
                    downloads: data.vcfDownloads ?? 0,
                    shares: data.profileShares ?? 0,
                    clicks: data.socialLinkClicks ?? 0,
                })
            } catch { /* silent */ }
        }
        fetchStats()
    }, [user?.id])
    // ──────────────────────────────────────────────────────────────────────────

    // Early return AFTER all hooks
    if (!user) return null

    const analyze = async () => {
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/ab-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: user, stats }),
            })
            if (!res.ok) throw new Error((await res.json()).error || t('errors.generic'))
            setResult(await res.json())
        } catch (e: any) {
            setError(e.message || t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const handleApply = async (testId: string, value: string) => {
        setApplying(testId)
        try {
            const fieldMap: Record<string, string> = { title: 'position', bio: 'bio', cta: 'bio' }
            const field = fieldMap[testId] || testId
            await fetch(`${BASE_API_URL}/api/profile/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, [field]: value }),
            })
        } catch { /* silent */ }
        finally { setApplying(null) }
    }

    const convRate = stats.visits > 0
        ? ((stats.leads / stats.visits) * 100).toFixed(1)
        : '0'

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8"
            style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F' }}
        >
            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.018,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />

            <div className="max-w-2xl mx-auto space-y-10">

                {/* Header */}
                <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-1">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">{t('subtitle')}</p>
                    <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">{t('title')}</h1>
                    <p className="text-sm text-gray-500 pt-1">{t('description')}</p>
                </motion.header>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm font-medium">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Current stats */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
                    className="rounded-2xl border border-white/[0.055] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">{t('currentStats')}</p>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
                        {[
                            { label: t('stats.visits'), value: stats.visits },
                            { label: t('stats.leads'), value: stats.leads },
                            { label: t('stats.convRate'), value: `${convRate}%` },
                        ].map(({ label, value }) => (
                            <div key={label} className="px-6 py-5 text-center">
                                <p className="text-2xl font-black text-white tabular-nums">{value}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-600 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Analyze button */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <button onClick={analyze} disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.35)',
                        }}>
                        {loading ? <><SpinnerIcon className="w-4 h-4" /> {t('analyzing')}</> : <><SparkleIcon /> {t('analyzeButton')}</>}
                    </button>
                </motion.div>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] px-6 py-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500/70 mb-2">{t('overallInsight')}</p>
                                <p className="text-sm leading-relaxed italic text-amber-200/60">{result.overallInsight}</p>
                            </div>

                            <div className="space-y-5">
                                {result.tests.map((test, i) => (
                                    <motion.div key={test.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <ABTestCard test={test} user={user} onApply={handleApply} applying={applying} />
                                    </motion.div>
                                ))}
                            </div>

                            <button onClick={analyze} disabled={loading}
                                className="w-full py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] text-gray-400 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                <SparkleIcon /> {t('reAnalyze')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    )
}