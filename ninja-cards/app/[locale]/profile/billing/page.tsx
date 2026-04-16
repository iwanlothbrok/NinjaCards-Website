"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useAuth } from "../../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import type { Subscription } from "@/types/subscription";
import type { Invoice as InvoiceItem } from "@/types/invoice";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { getCanonicalPlanId, getPlanDisplayName } from "@/lib/planCatalog";
import MonetizationStatusPanel from "../../components/profile/MonetizationStatusPanel";

type MeResponse = {
    userId: string;
    email: string | null;
    subscription: Subscription | null;
};

function formatStatus(status?: string | undefined) {
    switch (status) {
        case "active":
            return "Active";
        case "trialing":
            return "Trial";
        case "past_due":
            return "Payment due";
        case "unpaid":
            return "Unpaid";
        case "paused":
            return "Paused";
        case "cancelled":
            return "Cancelled";
        default:
            return "No subscription";
    }
}

export default function AccountBillingPage() {
    const { user } = useAuth();
    const locale = useLocale();
    const [me, setMe] = useState<MeResponse | null>(null);
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = useTranslations("Billing");

    useEffect(() => {
        const cardOrderState =
            typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("cardOrder")
                : null;
        if (cardOrderState === "success") {
            toast.success("Card checkout completed. We queued your personalized card for fulfillment.");
        }
        if (cardOrderState === "cancelled") {
            toast("Card checkout was cancelled.");
        }
    }, []);

    const fetchMe = async (userId: string) => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/subscription/me`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error();
            return await res.json();
        } catch {
            toast.error("Failed to load subscription");
            return null;
        }
    };

    const fetchInvoices = async (userId: string) => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/invoices/list`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            return data.invoices || [];
        } catch {
            toast.error("Failed to load invoices");
            return [];
        }
    };

    const openBillingPortal = async (userId: string) => {
        try {
            setPortalLoading(true);
            const res = await fetch(`${BASE_API_URL}/api/payments/portal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch {
            toast.error("Failed to open billing portal");
        } finally {
            setPortalLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            setLoading(true);
            const meRes = await fetchMe(user.id);
            const invRes = await fetchInvoices(user.id);
            if (!meRes) setError("Failed to load billing data");
            setMe(meRes);
            setInvoices(invRes);
            setLoading(false);
        })();
    }, [user?.id]);

    const sub = me?.subscription;
    const isActive = sub && (["active", "trialing"] as unknown as Array<typeof sub.status>).includes(sub.status);
    const canonicalPlan = getCanonicalPlanId(sub?.plan);
    const displayPlan = getPlanDisplayName(sub?.plan);

    return (
        <>
            {(loading || portalLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <img src="/load.gif" alt="" className="w-24 h-24 animate-spin" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-orange to-amber-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mb-4">
                            {t("subtitle")}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-orange/20 to-amber-400/30 shadow-lg border border-amber-600/30 hover:border-amber-500/50 transition">
                                <span className="text-lg font-semibold text-amber-400">
                                    {t("premium.cta")}
                                </span>
                                <br />
                                <span className="ml-2 text-gray-300 text-sm">
                                    {t("premium.benefits")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subscription */}
                    <motion.section
                        className="rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-600/20 p-8 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex-1">
                            <span
                                className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold shadow ${isActive
                                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                    : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                                    }`}
                            >
                                {formatStatus(sub?.status as string | undefined)}
                            </span>

                            {sub?.plan && (
                                <p className="mt-4 text-gray-300 text-sm">
                                    {t("subscription.plan")}:{" "}
                                    <span className="font-bold text-amber-400 text-lg">{displayPlan}</span>
                                </p>
                            )}

                            {/* Upgrade CTAs */}
                            {canonicalPlan === "FREE" && (
                                <div className="mt-6 space-y-3">
                                    <div className="p-5 rounded-xl bg-gradient-to-r from-red-600/20 via-orange/15 to-amber-400/20 border border-red-600/40 shadow-lg hover:shadow-red-500/20 transition">
                                        <p className="text-lg font-bold text-red-400 mb-2">
                                            {t("upgrade.cta")}
                                        </p>
                                        <p className="text-gray-300 mb-4 text-sm">
                                            {t("upgrade.description")}
                                        </p>
                                        <button
                                            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 via-orange to-red-700 text-white font-bold transition hover:scale-105 hover:shadow-lg shadow-lg"
                                            onClick={() => window.location.href = "/lp-1"}
                                        >
                                            {t("upgrade.button")}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!sub?.plan && (
                                <div className="mt-6 space-y-3">
                                    <div className="p-5 rounded-xl bg-gradient-to-r from-amber-600/20 via-orange/15 to-amber-400/20 border border-amber-600/40 shadow-lg">
                                        <p className="text-lg font-bold text-amber-400 mb-2">
                                            {t("upgrade.cta")}
                                        </p>
                                        <p className="text-gray-300 mb-4 text-sm">
                                            {t("upgrade.description")}
                                        </p>
                                        <button
                                            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-orange to-amber-600 text-black font-bold transition hover:scale-105 hover:shadow-lg shadow-lg"
                                            onClick={() => window.location.href = "/lp-1"}
                                        >
                                            {t("upgrade.button")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                            <button
                                onClick={() => user?.id && openBillingPortal(user.id)}
                                disabled={!user?.id}
                                className="w-full md:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange hover:from-amber-500 hover:to-orange text-black font-bold transition shadow-lg hover:shadow-xl"
                            >
                                {t("subscription.managePayments")}
                            </button>
                            <button
                                onClick={() => window.location.href = "/lp-1"}
                                className="w-full md:w-auto px-8 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-amber-400 font-semibold transition shadow-lg border border-amber-600/30"
                            >
                                {t("subscription.viewPlans")}
                            </button>
                        </div>
                    </motion.section>

                    <MonetizationStatusPanel mode="compact" />

                    {/* Invoices */}
                    <motion.section
                        className="rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-600/20 p-8 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{t("invoices.title")}</span>
                            <span className="inline-block px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 text-xs font-bold border border-amber-600/30">
                                {invoices.length > 0 ? t("invoices.count", { count: invoices.length }) : t("invoices.empty")}
                            </span>
                        </h2>

                        {invoices.length === 0 ? (
                            <p className="text-gray-400 text-center py-12">
                                {t("invoices.empty")}
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm rounded-xl overflow-hidden shadow-lg">
                                    <thead className="text-gray-300 border-b border-amber-600/20 bg-gray-900/60">
                                        <tr>
                                            <th className="py-4 px-4 text-left font-bold">{t("invoices.date")}</th>
                                            <th className="py-4 px-4 text-left font-bold">{t("invoices.amount")}</th>
                                            <th className="py-4 px-4 text-left font-bold">{t("invoices.currency")}</th>
                                            <th className="py-4 px-4 text-left font-bold">{t("invoices.invoice")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-gray-800 hover:bg-amber-600/10 transition"
                                            >
                                                <td className="py-4 px-4">
                                                    {new Date(row.createdAt).toLocaleDateString(
                                                        locale === "bg" ? "bg-BG" : "en-GB"
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-amber-400">
                                                    {row.amountPaid}
                                                </td>
                                                <td className="py-4 px-4 uppercase text-gray-400">{row.currency}</td>
                                                <td className="py-4 px-4">
                                                    <a
                                                        href={row.hostedInvoiceUrl}
                                                        target="_blank"
                                                        className="text-amber-400 hover:text-amber-300 hover:underline font-bold transition"
                                                    >
                                                        {t("invoices.view")} →
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.section>
                </div>
            </motion.div>
        </>
    );
}
