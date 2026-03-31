'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

// ─── Tag keys mapped to colors ────────────────────────────────────────────────
type TagKey = 'AI' | 'newFeature' | 'improvement' | 'card' | 'dashboard'

const TAG_STYLE: Record<TagKey, { bg: string; color: string; border: string }> = {
    AI: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    newFeature: { bg: 'rgba(245,158,11,0.10)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    improvement: { bg: 'rgba(34,197,94,0.08)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    card: { bg: 'rgba(59,130,246,0.10)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    dashboard: { bg: 'rgba(249,115,22,0.10)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
}

// Per-change tag assignment (by index within each release)
const RELEASE_TAGS: Record<string, TagKey[]> = {
    v25: ['AI', 'AI', 'AI', 'AI', 'AI', 'AI', 'card', 'card', 'card', 'card', 'newFeature', 'newFeature', 'improvement', 'improvement', 'improvement'],
    v24: ['newFeature', 'improvement', 'dashboard', 'dashboard', 'improvement', 'dashboard'],
    v23: ['newFeature', 'newFeature', 'card', 'card', 'card', 'dashboard'],
    v22: ['newFeature', 'dashboard', 'dashboard', 'dashboard', 'dashboard'],
    v21: ['newFeature', 'newFeature', 'improvement', 'improvement'],
}

const RELEASE_KEYS = ['v25', 'v24', 'v23', 'v22', 'v21'] as const
type ReleaseKey = typeof RELEASE_KEYS[number]

// ─── Tag Chip ─────────────────────────────────────────────────────────────────
function TagChip({ tagKey, label }: { tagKey: TagKey; label: string }) {
    const s = TAG_STYLE[tagKey]
    return (
        <span className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {label}
        </span>
    )
}

// ─── Release Card ─────────────────────────────────────────────────────────────
function ReleaseCard({ releaseKey, index, isLatest }: { releaseKey: ReleaseKey; index: number; isLatest: boolean }) {
    const t = useTranslations('changelog')
    const release = t.raw(`releases.${releaseKey}`) as { label: string; highlight: string; date: string; changes: string[] }
    const tags = RELEASE_TAGS[releaseKey] ?? []

    const [expanded, setExpanded] = useState(isLatest)

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-white/[0.08] to-transparent" />

            <div className="flex gap-5">
                {/* Dot */}
                <div className="relative flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center z-10 relative"
                        style={{
                            background: isLatest ? 'linear-gradient(135deg, #f59e0b, #f59e0bcc)' : 'rgba(255,255,255,0.04)',
                            border: isLatest ? 'none' : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: isLatest ? '0 0 20px rgba(245,158,11,0.4)' : 'none',
                        }}>
                        <span className="text-[9px] font-black" style={{ color: isLatest ? '#000' : '#555' }}>
                            {releaseKey.replace('v', 'v').replace(/(\d)(\d)$/, '$1.$2')}
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div className="flex-1 pb-8">
                    <div className="rounded-2xl border overflow-hidden"
                        style={{
                            border: isLatest ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.055)',
                            background: isLatest
                                ? 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                                : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        }}>
                        {isLatest && <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />}

                        <button onClick={() => setExpanded(e => !e)}
                            className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h3 className="text-base font-black text-white tracking-tight">{release.label}</h3>
                                    {isLatest && (
                                        <span className="text-[9px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                                            {t('latest')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[12px] text-gray-500">{release.highlight}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-700">{release.date}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-[11px] text-gray-600 font-medium">
                                    {release.changes.length} {t('changes')}
                                </span>
                                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {expanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
                                        {release.changes.map((text, i) => {
                                            const tagKey = tags[i] ?? 'improvement'
                                            const tagLabel = t(`tags.${tagKey}`)
                                            return (
                                                <motion.div key={i}
                                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.04, duration: 0.25 }}
                                                    className="flex items-start gap-3 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500/50 mt-2 flex-shrink-0" />
                                                    <p className="text-[13px] text-gray-400 leading-relaxed flex-1">{text}</p>
                                                    <TagChip tagKey={tagKey} label={tagLabel} />
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChangelogPage() {
    const t = useTranslations('changelog')

    const totalChanges = RELEASE_KEYS.reduce((acc, k) => {
        const r = t.raw(`releases.${k}`) as { changes: string[] }
        return acc + r.changes.length
    }, 0)
    const aiCount = (t.raw('releases.v25') as { changes: string[] }).changes
        .filter((_, i) => RELEASE_TAGS.v25[i] === 'AI').length

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.07) 0%, transparent 50%), #080A0F' }}>

            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.015,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-2xl mx-auto">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06]">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-500/80">{t('badge')}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                        {t('title')}<br />
                        <span style={{ color: '#f59e0b' }}>{t('titleAccent')}</span>
                    </h1>

                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">{t('description')}</p>

                    <div className="flex items-center justify-center gap-6 pt-2">
                        {[
                            { value: RELEASE_KEYS.length, label: t('stats.versions') },
                            { value: totalChanges, label: t('stats.changes') },
                            { value: aiCount, label: t('stats.aiFeatures') },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <p className="text-2xl font-black tabular-nums" style={{ color: '#f59e0b' }}>{value}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tag legend */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-10">
                    {(Object.keys(TAG_STYLE) as TagKey[]).map(key => (
                        <TagChip key={key} tagKey={key} label={t(`tags.${key}`)} />
                    ))}
                </motion.div>

                {/* Timeline */}
                <div>
                    {RELEASE_KEYS.map((key, i) => (
                        <ReleaseCard key={key} releaseKey={key} index={i} isLatest={i === 0} />
                    ))}
                </div>

                {/* Footer */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="mt-8 text-center space-y-3">
                    <div className="w-px h-12 bg-gradient-to-b from-white/[0.08] to-transparent mx-auto" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-700 font-semibold">
                        {t('footer')} · {new Date().getFullYear()}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}