'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BASE_API_URL } from '@/utils/constants'
import { useTranslations } from 'next-intl'
import { useAuth } from '../../context/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Recommendation {
    priority: 'high' | 'medium' | 'low'
    icon: string
    title: string
    description: string
    action: string
}

interface OptimizeResult {
    score: number
    verdict: string
    completionPct: number
    recommendations: Recommendation[]
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

const CheckIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const r = 40
    const circ = 2 * Math.PI * r
    const fill = (score / 100) * circ
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle
                    cx="56" cy="56" r={r} fill="none"
                    stroke={color} strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - fill }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
            </svg>
            <div className="text-center">
                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-black tabular-nums"
                    style={{ color }}
                >
                    {score}
                </motion.p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">/100</p>
            </div>
        </div>
    )
}

// ─── Completion Bar ───────────────────────────────────────────────────────────
function CompletionBar({ pct }: { pct: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">Попълненост</span>
                <span className="text-[11px] font-bold text-gray-300">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    )
}

// ─── Recommendation Card ──────────────────────────────────────────────────────
const PRIORITY_STYLE = {
    high: { label: 'Висок приоритет', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
    medium: { label: 'Среден приоритет', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    low: { label: 'Нисък приоритет', color: '#6b7280', bg: 'rgba(107,114,128,0.06)', border: 'rgba(107,114,128,0.15)' },
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
    const [done, setDone] = useState(false)
    const s = PRIORITY_STYLE[rec.priority]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="rounded-xl overflow-hidden"
            style={{
                border: `1px solid ${done ? 'rgba(34,197,94,0.2)' : s.border}`,
                background: done ? 'rgba(34,197,94,0.05)' : s.bg,
                opacity: done ? 0.6 : 1,
            }}
        >
            <div className="px-4 py-3 flex items-start gap-3">
                {/* Icon */}
                <span className="text-xl flex-shrink-0 mt-0.5">{rec.icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-white leading-snug">{rec.title}</p>
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                        >
                            {s.label}
                        </span>
                    </div>
                    <p className="text-[12px] text-gray-400 leading-relaxed">{rec.description}</p>

                    {/* Action */}
                    <div className="flex items-center justify-between pt-1.5">
                        <p className="text-[11px] font-semibold" style={{ color: s.color }}>
                            → {rec.action}
                        </p>
                        <button
                            onClick={() => setDone(d => !d)}
                            className="flex items-center gap-1.5 text-[10px] font-bold transition-colors px-2.5 py-1 rounded-lg"
                            style={done
                                ? { color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }
                                : { color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                            }
                        >
                            <CheckIcon /> {done ? 'Готово' : 'Маркирай'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfileOptimizerPage() {
    const { user } = useAuth()
    const t = useTranslations('profileOptimizer')

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<OptimizeResult | null>(null)
    const [error, setError] = useState('')

    if (!user) return null

    const analyze = async () => {
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: user }),
            })
            if (!res.ok) throw new Error((await res.json()).error || t('errors.generic'))
            setResult(await res.json())
        } catch (e: any) {
            setError(e.message || t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const highCount = result?.recommendations.filter(r => r.priority === 'high').length ?? 0
    const mediumCount = result?.recommendations.filter(r => r.priority === 'medium').length ?? 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8"
            style={{
                background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F',
            }}
        >
            {/* Grid texture */}
            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.018,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />

            <div className="max-w-2xl mx-auto space-y-10">

                {/* ── Header ── */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.5 }}
                    className="space-y-1"
                >
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">
                        {t('subtitle')}
                    </p>
                    <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
                        {t('title')}
                    </h1>
                    <p className="text-sm text-gray-500 pt-1">{t('description')}</p>
                </motion.header>

                {/* ── Error ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Profile snapshot ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
                    className="rounded-2xl border border-white/[0.055] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">{t('snapshotTitle')}</p>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {[
                            { label: t('fields.name'), val: user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') },
                            { label: t('fields.position'), val: user.position },
                            { label: t('fields.company'), val: user.company },
                            { label: t('fields.bio'), val: user.bio ? user.bio.substring(0, 60) + (user.bio.length > 60 ? '…' : '') : null },
                            { label: t('fields.photo'), val: user.image ? '✓ ' + t('fields.set') : '✗ ' + t('fields.missing') },
                            {
                                label: t('fields.links'),
                                val: [user.linkedin, user.github, user.instagram, user.facebook, user.website, user.tiktok, user.youtube]
                                    .filter(Boolean).length + ' ' + t('fields.linksFound')
                            },
                        ].map(({ label, val }) => val ? (
                            <div key={label} className="flex items-center justify-between px-7 py-3 hover:bg-white/[0.025] transition-colors">
                                <span className="text-[11px] text-gray-500">{label}</span>
                                <span className="text-[12px] font-semibold text-gray-300 truncate max-w-[220px] text-right">{val}</span>
                            </div>
                        ) : null)}
                    </div>
                </motion.div>

                {/* ── Analyze button ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <button
                        onClick={analyze}
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.35)',
                        }}
                    >
                        {loading
                            ? <><SpinnerIcon className="w-4 h-4" /> {t('analyzing')}</>
                            : <><SparkleIcon /> {t('analyzeButton')}</>
                        }
                    </button>
                </motion.div>

                {/* ── Results ── */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Score card */}
                            <div
                                className="rounded-2xl border border-white/[0.055] overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                            >
                                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                                <div className="p-6 flex items-center gap-6">
                                    <ScoreRing score={result.score} />
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{t('verdict')}</p>
                                            <p className="text-sm font-semibold text-white leading-relaxed">{result.verdict}</p>
                                        </div>
                                        <CompletionBar pct={result.completionPct} />
                                        <div className="flex gap-3">
                                            {highCount > 0 && (
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                                    {highCount} {t('highPriority')}
                                                </span>
                                            )}
                                            {mediumCount > 0 && (
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                    {mediumCount} {t('mediumPriority')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="space-y-3">
                                <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-gray-500">
                                    {t('recommendationsTitle')}
                                </p>
                                {result.recommendations.map((rec, i) => (
                                    <RecommendationCard key={i} rec={rec} index={i} />
                                ))}
                            </div>

                            {/* Re-analyze */}
                            <button
                                onClick={analyze}
                                disabled={loading}
                                className="w-full py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] text-gray-400 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <SparkleIcon /> {t('reAnalyze')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    )
}