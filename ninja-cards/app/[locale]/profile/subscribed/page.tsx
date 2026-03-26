'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from "../../context/AuthContext"
import { useTranslations } from "next-intl"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}

type SyncStatus = 'idle' | 'synced' | 'duplicate' | 'failed' | 'syncing'
type HubSpotPanelState = 'closed' | 'setup' | 'open'

const HS_TOKEN_KEY = 'ninja_hs_token'

// ─── Icons ────────────────────────────────────────────────────────────────────
const HubSpotIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.221 12.002c0-.933-.185-1.82-.512-2.633a7.065 7.065 0 0 0-2.734-3.354V4.008a2.005 2.005 0 1 0-2.223 0v2.007a7.052 7.052 0 0 0-2.195.96A6.945 6.945 0 0 0 9.34 5.99H8.01a2.96 2.96 0 0 0-2.959 2.96v.5c-.972.528-1.635 1.563-1.635 2.75 0 1.187.663 2.222 1.635 2.75v.498A2.96 2.96 0 0 0 8.01 18.41h1.33a6.996 6.996 0 0 0 4.848 1.931 7 7 0 0 0 7-7c0-.112-.003-.225-.008-.337zM17.188 7.1a1.116 1.116 0 1 1 1.117-1.116A1.117 1.117 0 0 1 17.188 7.1zm-3 10.353a5.11 5.11 0 1 1 5.11-5.11 5.116 5.116 0 0 1-5.11 5.11z" />
        <circle cx="14.188" cy="12.343" r="2.223" />
    </svg>
)
const CheckIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)
const SpinnerIcon = ({ className }: { className?: string }) => (
    <div className={`rounded-full border border-current border-t-transparent animate-spin ${className ?? 'w-3.5 h-3.5'}`} />
)
const SparkleIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

// ─── AI Follow-up Modal ───────────────────────────────────────────────────────
function FollowUpModal({ lead, owner, onClose }: {
    lead: Lead
    owner: { name?: string; position?: string; company?: string; email?: string }
    onClose: () => void
}) {
    const t = useTranslations('leads')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ subject: string; body: string } | null>(null)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState<'subject' | 'body' | 'all' | null>(null)

    const generate = useCallback(async () => {
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const res = await fetch(`${BASE_API_URL}/api/leads/generate-followup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ownerName: owner.name,
                    ownerPosition: owner.position,
                    ownerCompany: owner.company,
                    leadName: lead.name,
                    leadEmail: lead.email,
                    leadMessage: lead.message,
                }),
            })
            if (!res.ok) throw new Error((await res.json()).error || 'Грешка')
            setResult(await res.json())
        } catch (e: any) {
            setError(e.message || 'Нещо се обърка')
        } finally {
            setLoading(false)
        }
    }, [lead.email, lead.message, lead.name, owner.company, owner.name, owner.position])

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        generate()
        return () => window.removeEventListener('keydown', h)
    }, [generate, onClose])

    const handleCopy = (type: 'subject' | 'body' | 'all') => {
        if (!result) return
        const text = type === 'all'
            ? `Subject: ${result.subject}\n\n${result.body}`
            : type === 'subject' ? result.subject : result.body
        navigator.clipboard?.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    const mailtoUrl = result
        ? `mailto:${lead.email}?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`
        : `mailto:${lead.email}`

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(5,7,12,0.80)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]"
                    style={{ background: 'linear-gradient(135deg, #0E1117 0%, #080A0F 100%)' }}
                >
                    {/* Amber glow */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <SparkleIcon />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-500/70">
                                    {t('followUp.title')}
                                </p>
                                <p className="text-sm font-semibold text-white mt-0.5">{lead.name}</p>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 p-6 space-y-4">

                        {/* Lead message reference */}
                        {lead.message && (
                            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-600 mb-1.5">
                                    {t('followUp.leadMessage')}
                                </p>
                                <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 italic">
                                    &quot;{lead.message}&quot;
                                </p>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex flex-col items-center py-10 gap-3">
                                <div className="relative w-8 h-8">
                                    <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                                    <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
                                </div>
                                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-600">
                                    {t('followUp.generating')}
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Result */}
                        {result && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {/* Subject */}
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                                            {t('followUp.subject')}
                                        </p>
                                        <button
                                            onClick={() => handleCopy('subject')}
                                            className="text-[10px] font-semibold text-gray-600 hover:text-gray-300 transition-colors flex items-center gap-1"
                                        >
                                            {copied === 'subject' ? <><CheckIcon /> {t('followUp.copied')}</> : t('followUp.copy')}
                                        </button>
                                    </div>
                                    <p className="px-4 py-3 text-sm font-semibold text-white">{result.subject}</p>
                                </div>

                                {/* Body */}
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                                            {t('followUp.body')}
                                        </p>
                                        <button
                                            onClick={() => handleCopy('body')}
                                            className="text-[10px] font-semibold text-gray-600 hover:text-gray-300 transition-colors flex items-center gap-1"
                                        >
                                            {copied === 'body' ? <><CheckIcon /> {t('followUp.copied')}</> : t('followUp.copy')}
                                        </button>
                                    </div>
                                    <p className="px-4 py-4 text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.body}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    {result && !loading && (
                        <div className="flex gap-3 px-6 pb-6 pt-2 flex-shrink-0 border-t border-white/[0.05]">
                            <button
                                onClick={generate}
                                className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-400 hover:text-white text-sm font-semibold transition-all flex items-center gap-2"
                            >
                                <SparkleIcon /> {t('followUp.regenerate')}
                            </button>
                            <a
                                href={mailtoUrl}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold text-center transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {t('followUp.openEmail')}
                            </a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ lead, onConfirm, onCancel, loading }: {
    lead: Lead; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
    const t = useTranslations('leads')
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onCancel])

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
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-white tracking-tight">{t('deleteModal.confirm')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('deleteModal.description')}</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500">Name</span>
                                <span className="text-sm font-semibold text-white">{lead.name}</span>
                            </div>
                            {lead.email && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500">Email</span>
                                    <span className="text-sm text-gray-300">{lead.email}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onCancel} disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-300 text-sm font-semibold transition-all disabled:opacity-50">
                                {t('deleteModal.cancel')}
                            </button>
                            <button onClick={onConfirm} disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
                                {loading ? <><SpinnerIcon /> {t('deleteModal.deleting')}</> : t('deleteModal.confirm')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Message Modal ─────────────────────────────────────────────────────────────
function MessageModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    const t = useTranslations('leads')
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(5,7,12,0.75)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0E1117 0%, #080A0F 100%)' }}
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    <div className="p-7 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-500/70 mb-1">{t('messageModal.label')}</p>
                                <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                                {lead.email && <p className="text-sm text-gray-500 mt-0.5">{lead.email}</p>}
                            </div>
                            <button onClick={onClose}
                                className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-px bg-white/[0.05]" />
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 max-h-60 overflow-y-auto">
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words">{lead.message}</p>
                        </div>
                        <div className="flex gap-3">
                            {lead.email && (
                                <a href={`mailto:${lead.email}`}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold text-center transition-all shadow-lg shadow-amber-500/20">
                                    {t('messageModal.replyEmail')}
                                </a>
                            )}
                            <button onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-300 text-sm font-semibold transition-all">
                                {t('messageModal.close')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── HubSpot Panel ────────────────────────────────────────────────────────────
function HubSpotPanel({ onClose, onSync, leads, syncStatuses, isBulkSyncing, tokenSaved, onSaveToken, onClearToken }: {
    onClose: () => void; onSync: (leads: Lead[]) => void; leads: Lead[]
    syncStatuses: Record<string, SyncStatus>; isBulkSyncing: boolean
    tokenSaved: boolean; onSaveToken: (token: string) => void; onClearToken: () => void
}) {
    const [tokenInput, setTokenInput] = useState('')
    const [showToken, setShowToken] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const t = useTranslations('leads')

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    const syncedCount = Object.values(syncStatuses).filter(s => s === 'synced' || s === 'duplicate').length
    const failedCount = Object.values(syncStatuses).filter(s => s === 'failed').length
    const unsyncedLeads = leads.filter(l => !syncStatuses[l.id] || syncStatuses[l.id] === 'failed')

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: 'blur(16px)', background: 'rgba(4,6,10,0.82)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 20 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-xl rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]"
                    style={{ background: 'linear-gradient(160deg, #0F1318 0%, #080B10 100%)' }}
                >
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-28 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                    <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-white/[0.05] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <HubSpotIcon className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">{t('hubspot.panelTitle')}</h2>
                                <p className="text-[11px] text-gray-500">{t('hubspot.panelSubtitle')}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-7 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-gray-500">{t('hubspot.tokenLabel')}</p>
                                {tokenSaved && <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-400"><CheckIcon /> {t('hubspot.tokenConnected')}</span>}
                            </div>
                            {!tokenSaved ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input ref={inputRef} type={showToken ? 'text' : 'password'} value={tokenInput}
                                            onChange={e => setTokenInput(e.target.value)} placeholder={t('hubspot.tokenPlaceholder')}
                                            className="w-full px-4 py-3 pr-10 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono" />
                                        <button onClick={() => setShowToken(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                {showToken
                                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                                                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                    <button onClick={() => tokenInput.trim() && onSaveToken(tokenInput.trim())} disabled={!tokenInput.trim()}
                                        className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-500/20">
                                        {t('hubspot.saveConnect')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-sm text-emerald-300 font-medium">{t('hubspot.tokenSaved')}</span>
                                    </div>
                                    <button onClick={onClearToken} className="text-[11px] text-gray-600 hover:text-red-400 transition-colors font-semibold">{t('hubspot.disconnect')}</button>
                                </div>
                            )}
                        </div>
                        {Object.keys(syncStatuses).length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: t('hubspot.statSynced'), count: syncedCount, color: 'text-emerald-400 border-emerald-500/15 bg-emerald-500/[0.05]' },
                                    { label: t('hubspot.statFailed'), count: failedCount, color: 'text-red-400 border-red-500/15 bg-red-500/[0.05]' },
                                    { label: t('hubspot.statPending'), count: unsyncedLeads.length, color: 'text-gray-400 border-white/[0.07] bg-white/[0.03]' },
                                ].map(({ label, count, color }) => (
                                    <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
                                        <div className="text-xl font-bold tabular-nums">{count}</div>
                                        <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 opacity-70">{label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {tokenSaved && (
                            <button onClick={() => onSync(unsyncedLeads)} disabled={isBulkSyncing || unsyncedLeads.length === 0}
                                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2.5">
                                {isBulkSyncing ? <><SpinnerIcon /> {t('hubspot.syncingButton', { count: unsyncedLeads.length })}</>
                                    : unsyncedLeads.length === 0 ? <><CheckIcon /> {t('hubspot.allSynced')}</>
                                        : <><HubSpotIcon className="w-4 h-4" /> {t('hubspot.syncButton', { count: unsyncedLeads.length })}</>}
                            </button>
                        )}
                        {tokenSaved && leads.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-gray-500">{t('hubspot.leadStatusTitle')}</p>
                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                    {leads.map(lead => {
                                        const status = syncStatuses[lead.id] ?? 'idle'
                                        return (
                                            <div key={lead.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                                                    {lead.email && <p className="text-[11px] text-gray-600 truncate">{lead.email}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                    {status === 'syncing' && <span className="flex items-center gap-1.5 text-[11px] text-orange-400 font-semibold"><SpinnerIcon className="w-3 h-3" /> {t('hubspot.statusSyncing')}</span>}
                                                    {status === 'synced' && <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold"><CheckIcon /> {t('hubspot.statusSynced')}</span>}
                                                    {status === 'duplicate' && <span className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold"><CheckIcon /> {t('hubspot.statusUpdated')}</span>}
                                                    {status === 'failed' && <button onClick={() => onSync([lead])} className="flex items-center gap-1.5 text-[11px] text-red-400 font-semibold hover:text-red-300 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>{t('hubspot.statusRetry')}</button>}
                                                    {status === 'idle' && <button onClick={() => onSync([lead])} className="text-[11px] text-gray-600 hover:text-orange-400 font-semibold transition-colors">Sync</button>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value, color = 'amber' }: { label: string; value: string | number; color?: 'amber' | 'blue' | 'emerald' }) {
    const colors = { amber: 'border-amber-500/20 text-amber-400', blue: 'border-blue-500/20 text-blue-400', emerald: 'border-emerald-500/20 text-emerald-400' }
    return (
        <div className={`flex flex-col items-center px-5 py-3 rounded-xl border bg-white/[0.03] ${colors[color]}`}>
            <span className="text-xl font-bold tabular-nums">{value}</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-gray-500 mt-0.5">{label}</span>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserLeadsTable() {
    const { user } = useAuth()
    const t = useTranslations('leads')

    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleCount, setVisibleCount] = useState(10)
    const [successMsg, setSuccessMsg] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmLead, setConfirmLead] = useState<Lead | null>(null)
    const [messageLead, setMessageLead] = useState<Lead | null>(null)
    const [followUpLead, setFollowUpLead] = useState<Lead | null>(null)  // ← NEW
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [hsPanel, setHsPanel] = useState<HubSpotPanelState>('closed')
    const [hsToken, setHsToken] = useState<string>('')
    const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({})
    const [isBulkSyncing, setIsBulkSyncing] = useState(false)

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem(HS_TOKEN_KEY) : null
        if (saved) setHsToken(saved)
    }, [])

    const handleSaveToken = (token: string) => { localStorage.setItem(HS_TOKEN_KEY, token); setHsToken(token) }
    const handleClearToken = () => { localStorage.removeItem(HS_TOKEN_KEY); setHsToken(''); setSyncStatuses({}) }

    useEffect(() => {
        if (!user?.id) return
            ; (async () => {
                try {
                    const res = await fetch(`${BASE_API_URL}/api/subscribed/${user.id}`)
                    if (!res.ok) throw new Error()
                    const data = await res.json()
                    setLeads(data.leads || [])
                } catch { setError(t('errors.generic')) }
                finally { setLoading(false) }
            })()
    }, [user?.id, t])

    const handleDelete = async () => {
        if (!confirmLead) return
        try {
            setDeletingId(confirmLead.id)
            const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${confirmLead.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            setLeads(prev => prev.filter(l => l.id !== confirmLead.id))
            setSuccessMsg(t('success.delete'))
            setTimeout(() => setSuccessMsg(''), 3500)
        } catch { setError(t('errors.deleteFail')) }
        finally { setDeletingId(null); setConfirmLead(null) }
    }

    const handleHubSpotSync = async (leadsToSync: Lead[]) => {
        if (!hsToken || leadsToSync.length === 0) return
        const isBulk = leadsToSync.length > 1
        if (isBulk) setIsBulkSyncing(true)
        setSyncStatuses(prev => { const next = { ...prev }; leadsToSync.forEach(l => { next[l.id] = 'syncing' }); return next })
        try {
            const res = await fetch('/api/hubspot/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiToken: hsToken, leads: leadsToSync }) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Sync failed')
            setSyncStatuses(prev => { const next = { ...prev }; for (const result of data.results) { next[result.id] = result.status }; return next })
            const { synced, duplicate, failed } = data.summary
            setSuccessMsg(failed === 0 ? (synced + duplicate === 1 ? t('hubspot.successSynced', { count: 1 }) : t('hubspot.successSyncedPlural', { count: synced + duplicate })) : t('hubspot.successPartial', { synced: synced + duplicate, failed }))
            setTimeout(() => setSuccessMsg(''), 5000)
        } catch (err) {
            setSyncStatuses(prev => { const next = { ...prev }; leadsToSync.forEach(l => { next[l.id] = 'failed' }); return next })
            setError(String(err))
        } finally { if (isBulk) setIsBulkSyncing(false) }
    }

    const downloadCSV = () => { window.location.href = `${BASE_API_URL}/api/subscribed/csv/${user?.id}?format=csv` }

    const processed = useMemo(() => {
        let result = leads
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(l => l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q))
        }
        return [...result].sort((a, b) => { const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); return sortOrder === 'newest' ? diff : -diff })
    }, [leads, search, sortOrder])

    const withEmail = leads.filter(l => l.email).length
    const withPhone = leads.filter(l => l.phone).length
    const withMessage = leads.filter(l => l.message).length
    const syncedTotal = Object.values(syncStatuses).filter(s => s === 'synced' || s === 'duplicate').length

    // Owner info for follow-up
    const ownerInfo = { name: user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' '), position: user?.position, company: user?.company, email: user?.email }

    if (loading) return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080A0F] gap-5">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
            </div>
            <p className="text-[10.5px] uppercase tracking-[0.2em] text-gray-600 font-semibold">{t('loading')}</p>
        </div>
    )

    if (error && !leads.length) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                </div>
                <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
        </div>
    )

    return (
        <>
            {confirmLead && <DeleteModal lead={confirmLead} onConfirm={handleDelete} onCancel={() => setConfirmLead(null)} loading={deletingId === confirmLead.id} />}
            {messageLead && <MessageModal lead={messageLead} onClose={() => setMessageLead(null)} />}
            {followUpLead && <FollowUpModal lead={followUpLead} owner={ownerInfo} onClose={() => setFollowUpLead(null)} />}
            {hsPanel !== 'closed' && <HubSpotPanel onClose={() => setHsPanel('closed')} onSync={handleHubSpotSync} leads={leads} syncStatuses={syncStatuses} isBulkSyncing={isBulkSyncing} tokenSaved={!!hsToken} onSaveToken={handleSaveToken} onClearToken={handleClearToken} />}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8 text-gray-200"
                style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F' }}>
                <div className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.018, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto space-y-14">
                    <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">{t('subtitle')}</p>
                            <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">{t('title')}</h1>
                        </div>
                        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                            <button onClick={() => setHsPanel('open')}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${hsToken ? 'bg-orange-500/10 border-orange-500/25 text-orange-400 hover:bg-orange-500/15' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.07]'}`}>
                                <HubSpotIcon className="w-4 h-4" />
                                {hsToken ? <span className="flex items-center gap-1.5">HubSpot{syncedTotal > 0 && <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">{syncedTotal}</span>}</span> : t('hubspot.buttonConnect')}
                            </button>
                            <button onClick={downloadCSV}
                                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all duration-200 shadow-lg shadow-amber-500/20">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                {t('downloadCsv')}
                            </button>
                        </div>
                    </motion.header>

                    {leads.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3">
                            <StatChip label={t('totalLeads')} value={leads.length} color="amber" />
                            <StatChip label={t('withEmail')} value={withEmail} color="blue" />
                            <StatChip label={t('withPhone')} value={withPhone} color="emerald" />
                            <StatChip label={t('withMessage')} value={withMessage} color="amber" />
                            {syncedTotal > 0 && <StatChip label={t('hubspot.inHubSpot')} value={syncedTotal} color="emerald" />}
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {successMsg && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!leads.length && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-16 h-16 rounded-2xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center">
                                <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" /></svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{t('empty')}</p>
                        </motion.div>
                    )}

                    {leads.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search') || 'Search…'}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all" />
                                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>}
                            </div>
                            <div className="flex p-1 gap-1 rounded-xl bg-black/30 border border-white/[0.055] w-fit">
                                {(['newest', 'oldest'] as const).map(o => (
                                    <button key={o} onClick={() => setSortOrder(o)}
                                        className={`px-4 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-200 capitalize ${sortOrder === o ? 'bg-amber-500 text-black shadow-md shadow-amber-500/15' : 'text-gray-500 hover:text-gray-300'}`}>
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {leads.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="rounded-2xl border border-white/[0.055] overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>

                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_auto_auto] gap-5 px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                                {[t('fields.name'), t('fields.email'), t('fields.phone'), 'HubSpot', t('actions.text')].map((h, i) => (
                                    <div key={h} className={`text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500 ${i >= 3 ? 'text-right' : ''}`}>{h}</div>
                                ))}
                            </div>

                            <div className="divide-y divide-white/[0.04]">
                                <AnimatePresence>
                                    {processed.slice(0, visibleCount).map((lead, idx) => {
                                        const status = syncStatuses[lead.id] ?? 'idle'
                                        return (
                                            <motion.div key={lead.id}
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
                                                transition={{ delay: idx * 0.03, duration: 0.25 }}
                                                className="px-6 py-5 hover:bg-white/[0.025] transition-colors duration-200">

                                                {/* Desktop */}
                                                <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_auto_auto] gap-5 items-center">
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">{lead.name}</p>
                                                        <p className="text-[11px] text-gray-600 mt-0.5 tabular-nums">
                                                            {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-400 text-sm truncate">{lead.email || <span className="text-gray-700">—</span>}</p>
                                                    <p className="text-gray-400 text-sm">{lead.phone || <span className="text-gray-700">—</span>}</p>

                                                    {/* HubSpot */}
                                                    <div className="flex justify-end">
                                                        {status === 'idle' && hsToken && <button onClick={() => handleHubSpotSync([lead])} className="px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] hover:bg-orange-500/[0.14] text-orange-400 text-[11px] font-semibold transition-all flex items-center gap-1.5"><HubSpotIcon className="w-3 h-3" /> Sync</button>}
                                                        {status === 'idle' && !hsToken && <span className="text-gray-700 text-[11px]">—</span>}
                                                        {status === 'syncing' && <span className="flex items-center gap-1.5 text-[11px] text-orange-400 font-semibold"><SpinnerIcon className="w-3 h-3" /></span>}
                                                        {(status === 'synced' || status === 'duplicate') && <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold"><CheckIcon /><span>{status === 'duplicate' ? t('hubspot.statusUpdated') : t('hubspot.statusSynced')}</span></span>}
                                                        {status === 'failed' && <button onClick={() => handleHubSpotSync([lead])} className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.06] hover:bg-red-500/[0.14] text-red-400 text-[11px] font-semibold transition-all">{t('hubspot.statusRetry')}</button>}
                                                    </div>

                                                    {/* Actions — с нов AI Follow-up бутон */}
                                                    <div className="flex gap-2 justify-end">
                                                        {lead.email && (
                                                            <button
                                                                onClick={() => setFollowUpLead(lead)}
                                                                className="px-3.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] hover:bg-amber-500/[0.15] text-amber-400 text-[11.5px] font-semibold transition-all flex items-center gap-1.5"
                                                            >
                                                                <SparkleIcon /> {t('actions.followUp')}
                                                            </button>
                                                        )}
                                                        <button onClick={() => lead.message && setMessageLead(lead)} disabled={!lead.message}
                                                            className="px-3.5 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/[0.07] hover:bg-blue-500/[0.15] text-blue-400 text-[11.5px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                                            {t('actions.view')}
                                                        </button>
                                                        <button onClick={() => setConfirmLead(lead)}
                                                            className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/[0.15] text-red-400 text-[11.5px] font-semibold transition-all">
                                                            {t('actions.delete')}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mobile */}
                                                <div className="md:hidden space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-white font-semibold">{lead.name}</p>
                                                            <p className="text-[11px] text-gray-600 mt-0.5">{new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {(status === 'synced' || status === 'duplicate') && <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">HS ✓</span>}
                                                            {status === 'failed' && <span className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">Failed</span>}
                                                            {lead.message && <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-wide text-amber-500/70">{t('fields.message')}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div><p className="text-[10px] uppercase tracking-[0.1em] text-gray-600 mb-0.5">{t('fields.email')}</p><p className="text-gray-300 truncate">{lead.email || '—'}</p></div>
                                                        <div><p className="text-[10px] uppercase tracking-[0.1em] text-gray-600 mb-0.5">{t('fields.phone')}</p><p className="text-gray-300">{lead.phone || '—'}</p></div>
                                                    </div>
                                                    <div className="flex gap-2 pt-1">
                                                        {hsToken && status === 'idle' && <button onClick={() => handleHubSpotSync([lead])} className="flex-1 py-2 rounded-lg border border-orange-500/20 bg-orange-500/[0.07] hover:bg-orange-500/[0.15] text-orange-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"><HubSpotIcon className="w-3.5 h-3.5" /> Sync</button>}
                                                        {lead.email && <button onClick={() => setFollowUpLead(lead)} className="flex-1 py-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] hover:bg-amber-500/[0.15] text-amber-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"><SparkleIcon /> {t('actions.followUp')}</button>}
                                                        <button onClick={() => lead.message && setMessageLead(lead)} disabled={!lead.message} className="flex-1 py-2 rounded-lg border border-blue-500/20 bg-blue-500/[0.07] hover:bg-blue-500/[0.15] text-blue-400 text-xs font-semibold transition-all disabled:opacity-30">{lead.message ? t('actions.view') : t('actions.noMessage')}</button>
                                                        <button onClick={() => setConfirmLead(lead)} className="flex-1 py-2 rounded-lg border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/[0.15] text-red-400 text-xs font-semibold transition-all">{t('actions.delete')}</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>

                            {processed.length === 0 && search && (
                                <div className="flex flex-col items-center py-16 gap-3">
                                    <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                                    <p className="text-gray-600 text-sm">{t('noResults')} <span className="text-gray-400 font-medium">&quot;{search}&quot;</span></p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {leads.length > 0 && (
                        <div className="flex flex-col items-center gap-3">
                            {visibleCount < processed.length
                                ? <button onClick={() => setVisibleCount(p => p + 10)} className="px-8 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] text-gray-400 hover:text-white text-sm font-semibold transition-all duration-200">{t('loadMore')}</button>
                                : <p className="text-[11px] uppercase tracking-[0.14em] text-gray-700 font-semibold">{t('allLeadsLoaded', { count: processed.length })}</p>
                            }
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    )
}
