'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from "../../context/AuthContext"
import { useTranslations } from "next-intl"
import Image from 'next/image'

interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}

function Info({ label, value, multiline }: { label: string; value?: string; multiline?: boolean }) {
    return (
        <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className={`text-gray-200 ${multiline ? "whitespace-pre-line break-words" : ""}`}>
                {value || "-"}
            </p>
        </div>
    )
}

export default function UserLeadsTable() {
    const { user } = useAuth()
    const t = useTranslations("leads")

    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleCount, setVisibleCount] = useState(6)
    const [successMsg, setSuccessMsg] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        if (!user?.id) return

        const fetchLeads = async () => {
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
        }

        fetchLeads()
    }, [user?.id, t])

    const downloadCSV = () => {
        window.location.href = `${BASE_API_URL}/api/subscribed/csv/${user?.id}?format=csv`
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <Image src="/load.gif" alt="Loading..." width={96} height={96} className="animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <p className="text-red-400 text-lg">{error}</p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-32 sm:pt-36 px-4 md:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-gray-200"
        >
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-base">
                            {t("subtitle")}
                        </p>
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-orange text-black font-semibold transition shadow-lg hover:shadow-orange-500/20"
                    >
                        📥 {t("downloadCsv")}
                    </button>
                </motion.div>

                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm"
                    >
                        ✓ {successMsg}
                    </motion.div>
                )}

                {/* Empty */}
                {!leads.length && (
                    <div className="text-center py-24">
                        <p className="text-6xl mb-4">📭</p>
                        <p className="text-gray-400 text-lg">{t("empty")}</p>
                    </div>
                )}

                {/* Table View */}
                {leads.length > 0 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-4 gap-6 px-8 py-5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-800/50 font-semibold text-gray-300 text-sm uppercase tracking-wide">
                            <div>{t("fields.name")}</div>
                            <div>{t("fields.email")}</div>
                            <div>{t("fields.phone")}</div>
                            <div className="text-right">{t("actions.text")}</div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-gray-800/50">
                            {leads.slice(0, visibleCount).map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 hover:bg-gray-800/20 transition duration-200"
                                >
                                    {/* Mobile Card */}
                                    <div className="md:hidden space-y-3 mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{t("fields.name")}</p>
                                                <p className="text-white font-semibold">{lead.name}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{t("fields.email")}</p>
                                            <p className="text-gray-300">{lead.email || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{t("fields.phone")}</p>
                                            <p className="text-gray-300">{lead.phone || "-"}</p>
                                        </div>
                                        {lead.message && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{t("fields.message")}</p>
                                                <p className="text-gray-400 text-sm whitespace-pre-line break-words">{lead.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Table Row */}
                                    <div className="hidden md:grid grid-cols-4 gap-6 items-center">
                                        <div>
                                            <p className="text-white font-medium">{lead.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-gray-400 text-sm">{lead.email || "-"}</div>
                                        <div className="text-gray-400 text-sm">{lead.phone || "-"}</div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => lead.message && window.alert(lead.message)}
                                                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium transition"
                                                disabled={!lead.message}
                                            >
                                                {t("actions.view")}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setDeletingId(lead.id)
                                                        const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${lead.id}`, { method: 'DELETE' })
                                                        if (!res.ok) throw new Error()
                                                        setLeads((prev) => prev.filter((l) => l.id !== lead.id))
                                                        setSuccessMsg(t("success.delete"))
                                                        setTimeout(() => setSuccessMsg(''), 3000)
                                                    } catch {
                                                        setError(t("errors.deleteFail"))
                                                    } finally {
                                                        setDeletingId(null)
                                                    }
                                                }}
                                                disabled={deletingId === lead.id}
                                                className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium transition disabled:opacity-50"
                                            >
                                                {deletingId === lead.id ? t("actions.deleting") : t("actions.delete")}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile Actions */}
                                    <div className="md:hidden flex gap-2 mt-4">
                                        <button
                                            onClick={() => lead.message && window.alert(lead.message)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium transition"
                                            disabled={!lead.message}
                                        >
                                            {lead.message ? t("actions.view") : t("actions.noMessage")}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setDeletingId(lead.id)
                                                    const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${lead.id}`, { method: 'DELETE' })
                                                    if (!res.ok) throw new Error()
                                                    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
                                                    setSuccessMsg(t("success.delete"))
                                                    setTimeout(() => setSuccessMsg(''), 3000)
                                                } catch {
                                                    setError(t("errors.deleteFail"))
                                                } finally {
                                                    setDeletingId(null)
                                                }
                                            }}
                                            disabled={deletingId === lead.id}
                                            className="flex-1 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium transition disabled:opacity-50"
                                        >
                                            {deletingId === lead.id ? "..." : t("actions.delete")}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Load more */}
                {visibleCount < leads.length ? (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => setVisibleCount((p) => p + 6)}
                            className="px-8 py-3 rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 text-gray-300 font-medium transition"
                        >
                            ⬇️ {t("loadMore")}
                        </button>
                    </div>
                ) : leads.length > 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                        ✓ {t("allLoaded")}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
