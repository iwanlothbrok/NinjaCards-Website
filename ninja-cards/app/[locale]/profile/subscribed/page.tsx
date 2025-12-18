'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
                <img src="/load.gif" className="w-24 h-24 animate-spin" />
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
            className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
        >
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={downloadCSV}
                        className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold transition"
                    >
                        {t("downloadCsv")}
                    </button>
                </div>

                {successMsg && (
                    <div className="text-green-400 text-center text-sm">
                        {successMsg}
                    </div>
                )}

                {/* Empty */}
                {!leads.length && (
                    <div className="text-center text-gray-500 py-20">
                        📭 {t("empty")}
                    </div>
                )}

                {/* Leads */}
                <div className="space-y-6">
                    {leads.slice(0, visibleCount).map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">{t("fields.name")}</p>
                                    <p className="text-lg text-white">{lead.name}</p>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Info label={t("fields.phone")} value={lead.phone} />
                                <Info label={t("fields.email")} value={lead.email} />
                                <div className="sm:col-span-2">
                                    <Info label={t("fields.message")} value={lead.message} multiline />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
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
                                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50"
                                >
                                    {deletingId === lead.id ? t("deleting") : t("delete")}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load more */}
                {visibleCount < leads.length ? (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setVisibleCount((p) => p + 6)}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                        >
                            {t("loadMore")}
                        </button>
                    </div>
                ) : leads.length > 0 && (
                    <div className="text-center text-gray-500 text-sm">
                        {t("allLoaded")}
                    </div>
                )}
            </div>
        </motion.div>
    )
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
