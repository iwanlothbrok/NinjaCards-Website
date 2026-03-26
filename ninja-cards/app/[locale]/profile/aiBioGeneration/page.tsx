'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BASE_API_URL } from '@/utils/constants'
import { useTranslations } from 'next-intl'
import { useAuth } from '../../context/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────
interface BioVariant { tone: string; text: string }
interface GeneratedBios { analysis: string; bg: BioVariant[]; en: BioVariant[] }

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
const CopyIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// ─── Bio Card ─────────────────────────────────────────────────────────────────
function BioCard({ variant, onUse }: { variant: BioVariant; onUse: (text: string) => void }) {
    const t = useTranslations('bioGenerator')
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard?.writeText(variant.text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.03]"
        >
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.05] bg-amber-500/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-500">
                    {variant.tone}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            {copied
                                ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-400"><CheckIcon /></motion.span>
                                : <motion.span key="i" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CopyIcon /></motion.span>
                            }
                        </AnimatePresence>
                        {copied ? t('copied') : t('copy')}
                    </button>
                    <button
                        onClick={() => onUse(variant.text)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
                    >
                        {t('use')} →
                    </button>
                </div>
            </div>
            <p className="px-4 py-3.5 text-sm leading-relaxed text-gray-300">
                {variant.text}
            </p>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BioGeneratorPage() {
    const { user } = useAuth()
    const t = useTranslations('bioGenerator')

    const [lang, setLang] = useState<'bg' | 'en'>('bg')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<GeneratedBios | null>(null)
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    if (!user) return null

    const generate = async () => {
        setLoading(true)
        setError('')
        setResult(null)

        const links: Record<string, string> = {}
        if (user.linkedin) links['LinkedIn'] = user.linkedin
        if (user.github) links['GitHub'] = user.github
        if (user.instagram) links['Instagram'] = user.instagram
        if (user.website) links['Website'] = user.website
        if (user.twitter) links['Twitter/X'] = user.twitter
        if (user.behance) links['Behance'] = user.behance
        if (user.youtube) links['YouTube'] = user.youtube
        if (user.facebook) links['Facebook'] = user.facebook
        if (user.tiktok) links['TikTok'] = user.tiktok
        if (user.discord) links['Discord'] = user.discord
        if (user.telegram) links['Telegram'] = user.telegram
        if (user.viber) links['Viber'] = user.viber
        if (user.whatsapp) links['WhatsApp'] = user.whatsapp
        if (user.calendly) links['Calendly'] = user.calendly
        if (user.googleReview) links['Google Review'] = user.googleReview
        if (user.trustpilot) links['Trustpilot'] = user.trustpilot
        if (user.tripadvisor) links['Tripadvisor'] = user.tripadvisor
        if (user.paypal) links['PayPal'] = user.paypal
        if (user.revolut) links['Revolut'] = user.revolut

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/generate-bio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name || [user.firstName, user.lastName].filter(Boolean).join(' '),
                    position: user.position,
                    company: user.company,
                    links,
                }),
            })
            if (!res.ok) throw new Error((await res.json()).error || t('errors.generic'))
            setResult(await res.json())
        } catch (e: any) {
            setError(e.message || t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const handleUse = async (bio: string) => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/saveBio`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, bio }),
            })
            if (!res.ok) throw new Error()
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch {
            setError(t('errors.saveFail'))
        }
    }

    const linkCount = [user.linkedin, user.github, user.instagram, user.website, user.twitter, user.behance, user.youtube].filter(Boolean).length

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
                </motion.header>

                {/* ── Success toast ── */}
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                        >
                            <CheckIcon /> {t('savedSuccess')}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Error banner ── */}
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

                {/* ── Context card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.13 }}
                    className="rounded-2xl border border-white/[0.055] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">
                            {t('dataTitle')}
                        </p>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {[
                            { label: t('fields.name'), val: user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') },
                            { label: t('fields.position'), val: user.position },
                            { label: t('fields.company'), val: user.company },
                            { label: t('fields.links'), val: linkCount > 0 ? `${linkCount} ${t('fields.linksFound')}` : null },
                        ].map(({ label, val }) => val ? (
                            <div key={label} className="flex items-center justify-between px-7 py-3.5 hover:bg-white/[0.025] transition-colors">
                                <span className="text-[11px] text-gray-500">{label}</span>
                                <span className="text-[12px] font-semibold text-gray-300 truncate max-w-[220px]">{val}</span>
                            </div>
                        ) : null)}
                    </div>
                </motion.div>

                {/* ── Generate button ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.35)',
                        }}
                    >
                        {loading
                            ? <><SpinnerIcon className="w-4 h-4" /> {t('generating')}</>
                            : <><SparkleIcon /> {t('generateButton')}</>
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
                            {/* AI Analysis */}
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] px-6 py-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500/70 mb-2">
                                    {t('analysisTitle')}
                                </p>
                                <p className="text-sm leading-relaxed italic text-amber-200/60">
                                    {result.analysis}
                                </p>
                            </div>

                            {/* Language toggle */}
                            <div className="flex p-1 gap-1 rounded-xl w-fit bg-black/30 border border-white/[0.055]">
                                {(['bg', 'en'] as const).map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className="px-6 py-1.5 rounded-lg text-[11.5px] font-bold tracking-wide transition-all uppercase"
                                        style={lang === l
                                            ? { background: '#f59e0b', color: '#000' }
                                            : { color: 'rgba(255,255,255,0.3)' }
                                        }
                                    >
                                        {l === 'bg' ? '🇧🇬 BG' : '🇬🇧 EN'}
                                    </button>
                                ))}
                            </div>

                            {/* Variants */}
                            <div className="space-y-3">
                                {result[lang].map((v, i) => (
                                    <motion.div
                                        key={`${lang}-${i}`}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <BioCard variant={v} onUse={handleUse} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    )
}