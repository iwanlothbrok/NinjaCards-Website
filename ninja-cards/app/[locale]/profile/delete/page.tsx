'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

// ─── Spinner ──────────────────────────────────────────────────────────────────
const SpinnerIcon = ({ className }: { className?: string }) => (
    <div className={`rounded-full border border-current border-t-transparent animate-spin ${className ?? 'w-3.5 h-3.5'}`} />
)

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
    email,
    onConfirm,
    onCancel,
    loading,
}: {
    email: string
    onConfirm: () => void
    onCancel: () => void
    loading: boolean
}) {
    const t = useTranslations('deleteAccount')
    const [typed, setTyped] = useState('')

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onCancel])

    const confirmWord = t('modal.confirmWord')
    const confirmed = typed.trim().toLowerCase() === confirmWord.toLowerCase()

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(5,7,12,0.75)' }}
                onClick={onCancel}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0E1117 0%, #080A0F 100%)' }}
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

                    <div className="p-8 space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-white tracking-tight">{t('modal.title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('modal.description')}</p>
                        </div>

                        {/* Account chip */}
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500">{t('modal.account')}</span>
                                <span className="text-sm font-semibold text-white truncate ml-4">{email}</span>
                            </div>
                        </div>

                        {/* Consequences */}
                        <div className="space-y-2">
                            {(t.raw('modal.consequences') as string[]).map((line: string, i: number) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-1.5 flex-shrink-0" />
                                    <p className="text-[12px] text-gray-500 leading-relaxed">{line}</p>
                                </div>
                            ))}
                        </div>

                        {/* Type to confirm */}
                        <div className="space-y-2">
                            <p className="text-[11.5px] text-gray-500 leading-relaxed">
                                {t('modal.typeToConfirm')}{' '}
                                <span className="text-red-400 font-mono font-semibold">{confirmWord}</span>
                                {' '}{t('modal.typeToConfirm') === 'Type' ? 'to confirm' : 'за потвърждение'}
                            </p>
                            <input
                                type="text"
                                value={typed}
                                onChange={e => setTyped(e.target.value)}
                                placeholder={confirmWord}
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all font-mono"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-300 text-sm font-semibold transition-all disabled:opacity-50"
                            >
                                {t('modal.cancel')}
                            </button>
                            <button
                                onClick={() => confirmed && onConfirm()}
                                disabled={loading || !confirmed}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <><SpinnerIcon /> {t('modal.deleting')}</> : t('modal.confirm')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DeleteAccountPage() {
    const { user, logout } = useAuth()
    const t = useTranslations('deleteAccount')
    const router = useRouter()

    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        if (!user?.id) return
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/delete-account`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error ?? t('errors.generic'))
            }

            await logout?.()
            router.replace('/')
        } catch (err: any) {
            setError(err.message || t('errors.generic'))
            setLoading(false)
            setShowModal(false)
        }
    }

    return (
        <>
            {showModal && user?.email && (
                <ConfirmDeleteModal
                    email={user.email}
                    onConfirm={handleDelete}
                    onCancel={() => { if (!loading) setShowModal(false) }}
                    loading={loading}
                />
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8 text-gray-200"
                style={{
                    background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(239,68,68,0.06) 0%, transparent 55%), #080A0F',
                }}
            >
                {/* Grid texture — same as leads */}
                <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                    opacity: 0.018,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }} />
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

                <div className="max-w-2xl mx-auto space-y-14">

                    {/* ── Header — exact same pattern as leads ── */}
                    <motion.header
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.5 }}
                        className="space-y-1"
                    >
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-red-500/65">
                            {t('subtitle')}
                        </p>
                        <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
                            {t('title')}
                        </h1>
                    </motion.header>

                    {/* ── Error banner — same as leads ── */}
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

                    {/* ── Account info chip ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.13 }}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.055] bg-white/[0.02]"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-0.5">{t('accountLabel')}</p>
                            <p className="text-white font-semibold truncate">{user?.email}</p>
                        </div>
                    </motion.div>

                    {/* ── Main card — same border/bg pattern as leads table ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="rounded-2xl border border-white/[0.055] overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                    >
                        {/* Top accent line */}
                        <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

                        {/* Section header — same style as table column headers */}
                        <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">
                                {t('whatGetsDeleted.title')}
                            </p>
                        </div>

                        {/* Items — same divide pattern as table rows */}
                        <div className="divide-y divide-white/[0.04]">
                            {(t.raw('whatGetsDeleted.items') as string[]).map((item: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.22 + i * 0.05 }}
                                    className="flex items-center gap-4 px-7 py-4 hover:bg-white/[0.025] transition-colors duration-200"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" />
                                    <p className="text-sm text-gray-400">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Warning box ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.42 }}
                        className="flex items-start gap-3.5 px-5 py-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]"
                    >
                        <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <p className="text-sm text-amber-200/70 leading-relaxed">{t('warning')}</p>
                    </motion.div>

                    {/* ── Delete button ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.48 }}
                    >
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-red-500/90 hover:bg-red-500 border border-red-500/30 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('deleteButton')}
                        </button>
                    </motion.div>

                </div>
            </motion.div>
        </>
    )
}