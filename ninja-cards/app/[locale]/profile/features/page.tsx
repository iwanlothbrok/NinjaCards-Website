"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BASE_API_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

export default function FeaturesComponent() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const t = useTranslations("CardSettings");

    const [isDirect, setIsDirect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        fetchUserDetails(user.id);
    }, [user?.id]);

    const fetchUserDetails = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setIsDirect(data.isDirect);
        } catch {
            showAlert(t("errors.loadUser"), t("alert.errorTitle"), "red");
        } finally {
            setLoading(false);
        }
    };

    const updateIsDirect = async (value: boolean) => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/updateIsDirect`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, isDirect: value }),
            });

            const result = await res.json().catch(() => null);

            if (!res.ok) {
                showAlert(result?.error || t("errors.updateFail"), t("alert.errorTitle"), "red");
                return;
            }

            setIsDirect(value);
            setUser?.(result.user);
            showAlert(t("messages.updated"), t("keywords.success"), "green");
        } catch {
            showAlert(t("errors.updateFail"), t("alert.errorTitle"), "red");
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, title: string, color: Alert["color"]) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    if (isDirect === null) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <img src="/load.gif" className="w-24 h-24 animate-spin" />
            </div>
        );
    }

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
                            {t("heading")}
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

                    {/* Settings Card */}
                    <motion.section
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-6"
                    >
                        {/* Toggle */}
                        <label className="flex items-center gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDirect}
                                onChange={(e) => updateIsDirect(e.target.checked)}
                                className="w-5 h-5 accent-amber-500"
                                disabled={loading}
                            />
                            <div>
                                <p className="text-lg font-semibold text-white">
                                    {t("options.directDownload")}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {isDirect ? t("options.directOn") : t("options.directOff")}
                                </p>
                            </div>
                        </label>

                        {/* Info */}
                        <div className="rounded-xl bg-gray-900/60 border border-gray-700 p-4 text-sm text-gray-300">
                            <p className="font-semibold mb-2 text-gray-200">
                                {t("info.title")}
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                <li>{t(isDirect ? "info.direct.1" : "info.indirect.1")}</li>
                                <li>{t(isDirect ? "info.direct.2" : "info.indirect.2")}</li>
                                <li>{t(isDirect ? "info.direct.3" : "info.indirect.3")}</li>
                            </ul>

                        </div>

                        {/* Actions */}
                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                            >
                                {t("actions.back")}
                            </button>
                        </div>
                    </motion.section>
                </div>
            </motion.div>
        </>
    );
}
