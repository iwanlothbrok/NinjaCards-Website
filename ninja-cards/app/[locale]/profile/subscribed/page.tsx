'use client'

import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";

interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}

const UserLeadsTable: React.FC = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleCount, setVisibleCount] = useState(6);
    const [successMsg, setSuccessMsg] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const t = useTranslations("leads");

    const loadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/subscribed/${user?.id}`)
                if (!res.ok) throw new Error(t("errors.load"))
                const data = await res.json()
                setLeads(data.leads)
            } catch (err) {
                console.error(err)
                setError(t("errors.generic"))
            } finally {
                setLoading(false)
            }
        }
        if (user?.id) fetchLeads()
    }, [user?.id, t])

    const downloadCSV = () => {
        window.location.href = `${BASE_API_URL}/api/subscribed/csv/${user?.id}?format=csv`
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <img src="/load.gif" alt={t("loading")} className="w-24 h-24 animate-spin" />
        </div>
    )
    if (error) return (
        <div className="flex justify-center items-center  h-32">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
    )
    if (!leads.length) return (
        <div className="flex justify-center items-center mt-32 h-32">
            <p className="text-red-500 text-2xl">{t("empty")}</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="w-full max-w-5xl mx-auto mt-32 p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700">
                <h2 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wide py-4">
                    📋 {t("title")}
                </h2>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <button
                        onClick={downloadCSV}
                        className="bg-gradient-to-r from-orange to-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-yellow-700 hover:to-yellow-600 transition duration-200 shadow-md"
                    >
                        {t("downloadCsv")}
                    </button>
                </div>

                {successMsg && (
                    <div className="text-green-400 text-sm mb-4 text-center">{successMsg}</div>
                )}

                <div className="space-y-6">
                    {leads.slice(0, visibleCount).map((lead) => (
                        <div
                            key={lead.id}
                            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden animate-fade-in"
                        >
                            <div className="absolute top-0 right-0 m-2 flex items-center gap-1 text-gray-300 text-sm px-3 py-1 bg-gray-700/80 backdrop-blur-sm rounded-bl-xl">
                                📅 {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">{t("fields.name")}</p>
                                    <p className="text-lg text-white font-normal">{lead.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">{t("fields.phone")}</p>
                                    <p className="text-lg text-white font-normal">{lead.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">{t("fields.email")}</p>
                                    <p className="text-lg text-white font-normal break-all">{lead.email || '-'}</p>
                                </div>
                                <div className="sm:col-span-2 md:col-span-3">
                                    <p className="text-sm text-gray-400">{t("fields.message")}</p>
                                    <p className="text-lg text-white font-normal whitespace-pre-line break-words">{lead.message || '-'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={async () => {
                                        try {
                                            setDeletingId(lead.id);
                                            const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${lead.id}`, {
                                                method: 'DELETE',
                                            });
                                            if (!res.ok) throw new Error(t("errors.delete"))
                                            setLeads((prev) => prev.filter((l) => l.id !== lead.id));
                                            setSuccessMsg(t("success.delete"));
                                            setTimeout(() => setSuccessMsg(''), 3000);
                                        } catch (err) {
                                            console.error(err);
                                            setError(t("errors.deleteFail"));
                                        } finally {
                                            setDeletingId(null);
                                        }
                                    }}
                                    disabled={deletingId === lead.id}
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deletingId === lead.id ? t("deleting") : t("delete")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {visibleCount < leads.length ? (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={loadMore}
                            className="text-sm text-white bg-gray-700 hover:bg-gray-600 transition px-5 py-2 rounded-md shadow-md"
                        >
                            {t("loadMore")}
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        📭 {t("allLoaded")}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserLeadsTable
