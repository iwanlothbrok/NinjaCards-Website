'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from "../../context/AuthContext"
import { useTranslations } from "next-intl"

interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
    lead,
    onConfirm,
    onCancel,
    loading,
}: {
    lead: Lead
    onConfirm: () => void
    onCancel: () => void
    loading: boolean
}) {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onCancel])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: "blur(12px)", background: "rgba(5,7,12,0.75)" }}
                onClick={onCancel}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0E1117 0%, #080A0F 100%)" }}
                >
                    {/* Red glow at top */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Top border accent */}
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

                        {/* Title + lead info */}
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-white tracking-tight">Delete Lead</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                This action cannot be undone. The following lead will be permanently removed.
                            </p>
                        </div>

                        {/* Lead preview card */}
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
                            {lead.phone && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-500">Phone</span>
                                    <span className="text-sm text-gray-300">{lead.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-300 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 rounded-full border border-white/30 border-t-white animate-spin" />
                                        Deleting...
                                    </>
                                ) : "Delete Lead"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Message Modal ─────────────────────────────────────────────────────────────
function MessageModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backdropFilter: "blur(12px)", background: "rgba(5,7,12,0.75)" }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0E1117 0%, #080A0F 100%)" }}
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                    <div className="p-7 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-500/70 mb-1">Message</p>
                                <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                                {lead.email && <p className="text-sm text-gray-500 mt-0.5">{lead.email}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0"
                            >
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
                                <a
                                    href={`mailto:${lead.email}`}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold text-center transition-all shadow-lg shadow-amber-500/20"
                                >
                                    Reply via Email
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-gray-300 text-sm font-semibold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, color = "amber" }: { label: string; value: string | number; color?: "amber" | "blue" | "emerald" }) {
    const colors = {
        amber: "border-amber-500/20 text-amber-400",
        blue: "border-blue-500/20 text-blue-400",
        emerald: "border-emerald-500/20 text-emerald-400",
    }
    return (
        <div className={`flex flex-col items-center px-5 py-3 rounded-xl border bg-white/[0.03] ${colors[color]}`}>
            <span className="text-xl font-bold tabular-nums">{value}</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-gray-500 mt-0.5">{label}</span>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UserLeadsTable() {
    const { user } = useAuth()
    const t = useTranslations("leads")

    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleCount, setVisibleCount] = useState(10)
    const [successMsg, setSuccessMsg] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmLead, setConfirmLead] = useState<Lead | null>(null)
    const [messageLead, setMessageLead] = useState<Lead | null>(null)
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    useEffect(() => {
        if (!user?.id) return
            ; (async () => {
                try {
                    const res = await fetch(`${BASE_API_URL}/api/subscribed/${user.id}`)
                    if (!res.ok) throw new Error()
                    const data = await res.json()
                    setLeads(data.leads || [])
                } catch {
                    setError(t("errors.generic"))
                } finally {
                    setLoading(false)
                }
            })()
    }, [user?.id, t])

    const handleDelete = async () => {
        if (!confirmLead) return
        try {
            setDeletingId(confirmLead.id)
            const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${confirmLead.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            setLeads(prev => prev.filter(l => l.id !== confirmLead.id))
            setSuccessMsg(t("success.delete"))
            setTimeout(() => setSuccessMsg(''), 3500)
        } catch {
            setError(t("errors.deleteFail"))
        } finally {
            setDeletingId(null)
            setConfirmLead(null)
        }
    }

    const downloadCSV = () => {
        window.location.href = `${BASE_API_URL}/api/subscribed/csv/${user?.id}?format=csv`
    }

    // Derived: filtered + sorted
    const processed = useMemo(() => {
        let result = leads
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(l =>
                l.name.toLowerCase().includes(q) ||
                l.email?.toLowerCase().includes(q) ||
                l.phone?.includes(q)
            )
        }
        return [...result].sort((a, b) => {
            const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            return sortOrder === 'newest' ? diff : -diff
        })
    }, [leads, search, sortOrder])

    // Stats
    const withEmail = leads.filter(l => l.email).length
    const withPhone = leads.filter(l => l.phone).length
    const withMessage = leads.filter(l => l.message).length

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080A0F] gap-5">
                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                    <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
                </div>
                <p className="text-[10.5px] uppercase tracking-[0.2em] text-gray-600 font-semibold">Loading leads</p>
            </div>
        )
    }

    if (error && !leads.length) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Modals */}
            {confirmLead && (
                <DeleteModal
                    lead={confirmLead}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmLead(null)}
                    loading={deletingId === confirmLead.id}
                />
            )}
            {messageLead && (
                <MessageModal lead={messageLead} onClose={() => setMessageLead(null)} />
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8 text-gray-200"
                style={{
                    background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F",
                }}
            >
                {/* Grid texture */}
                <div
                    className="fixed inset-0 -z-10 pointer-events-none"
                    style={{
                        opacity: 0.018,
                        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
                {/* Ambient glow */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto space-y-14">

                    {/* ── Page Header ──────────────────────────────────────── */}
                    <motion.header
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
                    >
                        <div className="space-y-1">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">
                                {t("subtitle")}
                            </p>
                            <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
                                {t("title")}
                            </h1>
                        </div>
                        <button
                            onClick={downloadCSV}
                            className="self-start sm:self-auto inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all duration-200 shadow-lg shadow-amber-500/20 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t("downloadCsv")}
                        </button>
                    </motion.header>

                    {/* ── Stats Row ──────────────────────────────────────────── */}
                    {leads.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-wrap gap-3"
                        >
                            <StatChip label={t("totalLeads")} value={leads.length} color="amber" />
                            <StatChip label={t("withEmail")} value={withEmail} color="blue" />
                            <StatChip label={t("withPhone")} value={withPhone} color="emerald" />
                            <StatChip label={t("withMessage")} value={withMessage} color="amber" />
                        </motion.div>
                    )}

                    {/* ── Success toast ───────────────────────────────────────── */}
                    <AnimatePresence>
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Empty state ──────────────────────────────────────────── */}
                    {!leads.length && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-32 gap-4"
                        >
                            <div className="w-16 h-16 rounded-2xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center">
                                <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{t("empty")}</p>
                        </motion.div>
                    )}

                    {/* ── Search + Sort Controls ───────────────────────────────── */}
                    {leads.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            {/* Search */}
                            <div className="relative flex-1">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={t("search") || "Search by name, email or phone…"}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Sort toggle */}
                            <div className="flex p-1 gap-1 rounded-xl bg-black/30 border border-white/[0.055] w-fit">
                                {(['newest', 'oldest'] as const).map(o => (
                                    <button
                                        key={o}
                                        onClick={() => setSortOrder(o)}
                                        className={`px-4 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-200 capitalize
                                            ${sortOrder === o
                                                ? "bg-amber-500 text-black shadow-md shadow-amber-500/15"
                                                : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Table ────────────────────────────────────────────────── */}
                    {leads.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="rounded-2xl border border-white/[0.055] overflow-hidden"
                            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" }}
                        >
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_auto] gap-6 px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                                {[t("fields.name"), t("fields.email"), t("fields.phone"), t("actions.text")].map((h, i) => (
                                    <div
                                        key={h}
                                        className={`text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500 ${i === 3 ? "text-right" : ""}`}
                                    >
                                        {h}
                                    </div>
                                ))}
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-white/[0.04]">
                                <AnimatePresence>
                                    {processed.slice(0, visibleCount).map((lead, idx) => (
                                        <motion.div
                                            key={lead.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{ delay: idx * 0.03, duration: 0.25 }}
                                            className="px-6 py-5 hover:bg-white/[0.025] transition-colors duration-200 group"
                                        >
                                            {/* Desktop */}
                                            <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_auto] gap-6 items-center">
                                                <div>
                                                    <p className="text-white font-semibold text-sm">{lead.name}</p>
                                                    <p className="text-[11px] text-gray-600 mt-0.5 tabular-nums">
                                                        {new Date(lead.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                                    </p>
                                                </div>
                                                <p className="text-gray-400 text-sm truncate">{lead.email || <span className="text-gray-700">—</span>}</p>
                                                <p className="text-gray-400 text-sm">{lead.phone || <span className="text-gray-700">—</span>}</p>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => lead.message && setMessageLead(lead)}
                                                        disabled={!lead.message}
                                                        className="px-3.5 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/[0.07] hover:bg-blue-500/[0.15] text-blue-400 text-[11.5px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        {t("actions.view")}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmLead(lead)}
                                                        className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/[0.15] text-red-400 text-[11.5px] font-semibold transition-all"
                                                    >
                                                        {t("actions.delete")}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile */}
                                            <div className="md:hidden space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-semibold">{lead.name}</p>
                                                        <p className="text-[11px] text-gray-600 mt-0.5">
                                                            {new Date(lead.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                                        </p>
                                                    </div>
                                                    {lead.message && (
                                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-wide text-amber-500/70">
                                                            {t("fields.message")}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-600 mb-0.5">{t("fields.email")}</p>
                                                        <p className="text-gray-300 truncate">{lead.email || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-600 mb-0.5">{t("fields.phone")}</p>
                                                        <p className="text-gray-300">{lead.phone || "—"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => lead.message && setMessageLead(lead)}
                                                        disabled={!lead.message}
                                                        className="flex-1 py-2 rounded-lg border border-blue-500/20 bg-blue-500/[0.07] hover:bg-blue-500/[0.15] text-blue-400 text-xs font-semibold transition-all disabled:opacity-30"
                                                    >
                                                        {lead.message ? t("actions.view") : t("actions.noMessage")}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmLead(lead)}
                                                        className="flex-1 py-2 rounded-lg border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/[0.15] text-red-400 text-xs font-semibold transition-all"
                                                    >
                                                        {t("actions.delete")}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* No search results */}
                            {processed.length === 0 && search && (
                                <div className="flex flex-col items-center py-16 gap-3">
                                    <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-sm">No leads match <span className="text-gray-400 font-medium">&quot;{search}&quot;</span></p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Load more / all loaded ───────────────────────────────── */}
                    {leads.length > 0 && (
                        <div className="flex flex-col items-center gap-3">
                            {visibleCount < processed.length ? (
                                <button
                                    onClick={() => setVisibleCount(p => p + 10)}
                                    className="px-8 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] text-gray-400 hover:text-white text-sm font-semibold transition-all duration-200"
                                >
                                    {t("loadMore")}
                                </button>
                            ) : (
                                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-700 font-semibold">
                                    {t("allLeadsLoaded", { count: processed.length })}
                                </p>
                            )}
                        </div>
                    )}

                </div>
            </motion.div>
        </>
    )
}