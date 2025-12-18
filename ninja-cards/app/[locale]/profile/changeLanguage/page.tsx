"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

export default function LanguageSwitcher() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const t = useTranslations("LanguageSwitcher");

    const [language, setLanguage] = useState<string>(user?.language || "bg");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        setLanguage(user.language || "bg");
    }, [user?.id]);

    const showAlert = (message: string, title: string, color: Alert["color"]) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const changeLanguage = async (lng: string) => {
        if (!user?.id || lng === language) return;

        setLoading(true);
        setLanguage(lng);

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/updateLanguage`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, language: lng }),
            });

            const result = await res.json().catch(() => null);

            if (!res.ok) {
                showAlert(
                    result?.error || t("errors.updateFail"),
                    t("alerts.errorTitle"),
                    "red"
                );
                return;
            }

            setUser(result);
            router.refresh(); // важно за next-intl
        } catch {
            showAlert(t("errors.updateFail"), t("alerts.errorTitle"), "red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <img src="/load.gif" className="w-24 h-24 animate-spin" />
                </div>
            )}

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
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Alert */}
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

                    {/* Card */}
                    <motion.section
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
                    >
                        <div className="flex justify-center gap-6">
                            <LanguageButton
                                active={language === "bg"}
                                onClick={() => changeLanguage("bg")}
                                label={`🇧🇬 ${t("bulgarian")}`}
                            />
                            <LanguageButton
                                active={language === "en"}
                                onClick={() => changeLanguage("en")}
                                label={`🇬🇧 ${t("english")}`}
                            />
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                            >
                                {t("buttons.back")}
                            </button>
                        </div>
                    </motion.section>
                </div>
            </motion.div>
        </>
    );
}

function LanguageButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${active
                ? "bg-amber-600 text-black shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
        >
            {label}
        </button>
    );
}
