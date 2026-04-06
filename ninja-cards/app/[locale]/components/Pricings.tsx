"use client";

import { Key, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";
import { Link, useRouter } from '@/navigation';
import { addToCart, loadCartFromLocalStorage } from "@/lib/cart";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);


export default function Pricing() {
    const router = useRouter();
    const t = useTranslations("Pricing");
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const handleCheckout = async (name: string) => {
        router.push('/plans');
    };

    return (
        <div id="pricing" className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Loading overlay */}
            {loadingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                        <img src="/load.gif" alt="" className="w-24 h-24" />
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange rounded-full blur-xl opacity-50" />
                        </div>
                        <p className="text-white text-lg font-medium bg-gradient-to-r from-amber-400 to-orange bg-clip-text text-transparent">
                            {t("processing")}
                        </p>
                    </div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative pt-10 sm:pt-12 px-2 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-7xl mx-auto space-y-10 pb-10">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-2">
                                <span className="bg-gradient-to-r from-amber-200 via-orange to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
                                    {t("title")}
                                </span>
                            </h1>
                        </motion.div>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-4 flex-wrap"
                    >
                        <span className={`text-base font-semibold transition-all ${billingCycle === "monthly" ? "text-white scale-110" : "text-gray-500"}`}>
                            {t("monthly")}
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="relative w-16 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 transition-all hover:shadow-lg hover:shadow-amber-500/20 border border-gray-600"
                        >
                            <motion.div
                                animate={{ x: billingCycle === "monthly" ? 2 : 30 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 via-orange to-amber-500 shadow-xl shadow-amber-500/50"
                            />
                        </button>
                        <span className={`text-base font-semibold transition-all ${billingCycle === "yearly" ? "text-white scale-110" : "text-gray-500"}`}>
                            {t("yearly")}
                        </span>
                        {billingCycle === "yearly" && (
                            <motion.span
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs font-bold border border-green-500/40 shadow-lg shadow-green-500/20"
                            >
                                {t("save20")}
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto items-start">
                        {["shinobi", "samurai", "shogun"].map((planKey, idx) => {
                            const plan = t.raw(`plans.${planKey}`);
                            const currentPriceId = plan.priceId[billingCycle];
                            const currentPrice = plan.price[billingCycle];
                            const isLoading = loadingPlan === currentPriceId;
                            const isPopular = planKey === "samurai";
                            const isCustom = !currentPriceId;

                            // Skip rendering custom price plans
                            // if (isCustom) return null;

                            return (
                                <motion.div
                                    key={planKey}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                                    whileHover={{ y: isPopular ? -8 : -4 }}
                                    className={`relative rounded-2xl p-4 transition-all duration-500 ${isPopular
                                        ? "bg-gradient-to-br from-amber-500/20 via-orange/10 to-amber-600/20 border-2 border-amber-500 shadow-2xl shadow-amber-500/40 md:scale-105 md:z-10"
                                        : "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/70 hover:border-gray-600 backdrop-blur-sm"
                                        }`}
                                >
                                    {isPopular && (
                                        <>
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange to-amber-500 text-black text-xs font-black shadow-xl shadow-amber-500/50 border-2 border-amber-300">
                                                {t("mostPopular")}
                                            </div>
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange/20 blur-2xl -z-10" />
                                        </>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className={`text-2xl font-bold mb-2 ${isPopular ? "text-transparent bg-gradient-to-r from-amber-300 to-orange bg-clip-text" : "text-white"}`}>
                                                {plan.title}
                                            </h3>
                                            <p className="text-gray-400 text-md leading-relaxed">
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="flex items-baseline gap-2 py-2">
                                            <span className={`text-3xl font-black ${isPopular ? "text-transparent bg-gradient-to-r from-amber-300 via-orange to-amber-400 bg-clip-text" : "text-white"}`}>
                                                €{currentPrice}
                                            </span>
                                            <span className="text-gray-400 text-base font-medium">
                                                / {billingCycle === "monthly" ? t("month") : t("year")}
                                            </span>
                                        </div>

                                        <ul className="space-y-2">
                                            {plan.features.map((feature: string, i: number) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.15 + i * 0.05 }}
                                                    className="flex items-start gap-2 text-gray-300 text-sm"
                                                >
                                                    <span className={`text-lg mt-0.5 ${isPopular ? "text-amber-400" : "text-green-400"}`}>✓</span>
                                                    <span className="leading-relaxed">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <motion.button
                                            whileHover={{ scale: isLoading ? 1 : 1.03 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.97 }}
                                            disabled={isLoading}
                                            onClick={() => handleCheckout(plan.title)}
                                            className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 ${isLoading
                                                ? "bg-gray-600 cursor-not-allowed opacity-50"
                                                : isPopular
                                                    ? "bg-gradient-to-r from-amber-400 via-orange to-amber-500 hover:shadow-2xl hover:shadow-amber-500/60 text-black border-2 border-amber-300"
                                                    : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border border-gray-500 hover:shadow-lg"
                                                }`}
                                        >
                                            {isLoading ? t("processing") : t("subscribe")}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Enterprise/Team CTA */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-10"
                    >
                        <div className="relative max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-black border-2 border-amber-500/30 backdrop-blur-md overflow-hidden">
                            {/* Premium glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange/10 to-amber-600/10 blur-2xl -z-10" />
                            <div className="absolute top-0 left-1/4 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-orange/20 rounded-full blur-3xl -z-10" />

                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10"
                            >
                                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-amber-400/20 to-orange/20 border border-amber-500/40">
                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Enterprise</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black mb-2">
                                    <span className="bg-gradient-to-r from-amber-200 via-orange to-amber-400 bg-clip-text text-transparent">
                                        {t("enterprise.title") || "Need more than 100 cards?"}
                                    </span>
                                </h3>
                                <p className="text-gray-300 text-base md:text-lg mb-4 max-w-xl mx-auto leading-relaxed">
                                    {t("enterprise.description") || "Contact us for custom corporate plans with volume discounts and dedicated support."}
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange to-amber-500 text-black font-bold text-base shadow-2xl shadow-amber-500/50 border-2 border-amber-300 transition-all duration-300 overflow-hidden hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {t("enterprise.button") || "Contact Sales"}
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
