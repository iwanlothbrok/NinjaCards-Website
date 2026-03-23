"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";

type SlugStatus = "idle" | "checking" | "available" | "taken";

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

export default function SlugPage() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [slug, setSlug] = useState("");
    const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (user?.slug) setSlug(user.slug);
    }, [user]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (slug.length < 3) {
            setSlugStatus("idle");
            return;
        }

        // If slug hasn't changed from what's saved — no need to check
        if (slug === user?.slug) {
            setSlugStatus("available");
            return;
        }

        setSlugStatus("checking");
        debounceRef.current = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ slug });
                if (user?.id) params.set("excludeId", user.id);
                const res = await fetch(`${BASE_API_URL}/api/profile/checkSlug?${params}`);
                const data = await res.json();
                setSlugStatus(data.available ? "available" : "taken");
            } catch {
                setSlugStatus("idle");
            }
        }, 450);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [slug, user?.id, user?.slug]);

    const showAlert = (message: string, title: string, color: Alert["color"]) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/updateSlug`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ slug: slug.trim().toLowerCase() }),
            });

            const result = await res.json();

            if (!res.ok) {
                showAlert(result?.message || "Грешка при запис", "Грешка", "red");
                return;
            }

            const updatedUser = { ...user, slug: result.slug ?? null };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser as any);
            showAlert("Slug запазен успешно!", "Успех", "green");
        } catch {
            showAlert("Грешка при запис", "Грешка", "red");
        } finally {
            setLoading(false);
        }
    };

    const profileUrl = slug.length >= 3
        ? `https://www.ninjacardsnfc.com/bg/p/${slug}`
        : null;

    const canSave = slugStatus === "available" && slug.length >= 3;

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <img src="/load.gif" className="w-24 h-24" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                            Персонален линк
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Задай кратък URL към твоята дигитална визитка
                        </p>
                    </motion.div>

                    {alert && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`rounded-xl p-4 text-center font-medium ${alert.color === "green"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            <strong>{alert.title}:</strong> {alert.message}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Твоят slug
                            </label>
                            <div className={`flex items-center gap-2 rounded-lg bg-gray-900/60 border px-4 py-3 transition-colors ${slugStatus === "available" ? "border-green-500/50" : slugStatus === "taken" ? "border-red-500/50" : "border-gray-700"}`}>
                                <span className="text-gray-500 text-sm whitespace-nowrap">
                                    ninjacardsnfc.com/bg/p/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="ivan-petrov"
                                    className="flex-1 bg-transparent text-gray-200 focus:outline-none"
                                />
                                <SlugIndicator status={slugStatus} />
                            </div>
                            <SlugHint status={slugStatus} length={slug.length} />
                        </div>

                        {profileUrl && (
                            <div className="rounded-lg bg-gray-900/40 border border-gray-700/40 p-4">
                                <p className="text-xs text-gray-500 mb-1">Твоят кратък линк:</p>
                                <a
                                    href={profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:text-amber-300 break-all text-sm"
                                >
                                    {profileUrl}
                                </a>
                            </div>
                        )}

                        <div className="flex justify-between gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                            >
                                Назад
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!canSave}
                                className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Запази
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}

function SlugIndicator({ status }: { status: SlugStatus }) {
    if (status === "checking") {
        return <div className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-amber-400 animate-spin flex-shrink-0" />;
    }
    if (status === "available") {
        return <span className="text-green-400 text-sm flex-shrink-0">✓</span>;
    }
    if (status === "taken") {
        return <span className="text-red-400 text-sm flex-shrink-0">✗</span>;
    }
    return null;
}

function SlugHint({ status, length }: { status: SlugStatus; length: number }) {
    if (length === 0) {
        return <p className="text-xs text-gray-500 mt-2">Само малки букви, цифри и тирета. Минимум 3, максимум 40 символа.</p>;
    }
    if (length < 3) {
        return <p className="text-xs text-gray-500 mt-2">Минимум 3 символа.</p>;
    }
    if (status === "available") {
        return <p className="text-xs text-green-500 mt-2">Свободен — можеш да го запазиш.</p>;
    }
    if (status === "taken") {
        return <p className="text-xs text-red-400 mt-2">Вече се използва. Избери друг.</p>;
    }
    return null;
}
