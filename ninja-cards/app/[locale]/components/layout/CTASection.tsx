"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function CTASection() {
    const t = useTranslations("CTA");
    const router = useRouter();

    const icons = {
        one: Sparkles,
        two: Zap,
        three: Shield
    };

    return (
        <section className="relative py-10 bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden">
            {/* Enhanced premium glow background */}
            {/* <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-orange/30 via-yellow-500/30 to-orange/30 blur-[200px] animate-pulse" />
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/15 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px]" />
            </div> */}

            {/* Floating particles with varied sizes */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-br from-orange/40 to-yellow-500/40 rounded-full"
                        style={{
                            width: `${2 + Math.random() * 3}px`,
                            height: `${2 + Math.random() * 3}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Grid pattern overlay */}
            {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" /> */}

            <div className="relative max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 backdrop-blur-3xl p-16 md:p-20 text-center space-y-12 shadow-[0_0_100px_rgba(251,146,60,0.15)]"
                >
                    {/* Multi-layer inner glow */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-orange/10 via-transparent to-purple-500/10 pointer-events-none" />
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-orange/5 to-transparent pointer-events-none" />

                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                        />
                    </div>

                    {/* Border glow animation */}
                    <motion.div
                        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(251,146,60,0.2)',
                                '0 0 40px rgba(251,146,60,0.4)',
                                '0 0 20px rgba(251,146,60,0.2)',
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                        {/* Premium badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange/20 to-yellow-500/20 border border-orange/30 backdrop-blur-sm mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-orange" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-orange to-yellow-300 bg-clip-text text-transparent">
                                Premium Experience
                            </span>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
                            {t("subtitle")}
                        </p>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
                            {["one", "two", "three"].map((key, index) => {
                                const Icon = icons[key as keyof typeof icons];
                                return (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + index * 0.15, duration: 0.8 }}
                                        whileHover={{ y: -8, scale: 1.03 }}
                                        className="group relative rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 p-8 hover:border-orange/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(251,146,60,0.3)]"
                                    >
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange/0 via-orange/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange/20 to-yellow-500/20 border border-orange/30 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                <Icon className="w-8 h-8 text-orange" />
                                            </div>
                                            <p className="text-white font-bold mb-3 text-xl tracking-tight">
                                                {t(`benefits.${key}.title`)}
                                            </p>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {t(`benefits.${key}.text`)}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12">
                            <motion.button
                                onClick={() => router.push("/plans")}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-orange via-yellow-500 to-orange bg-size-200 text-black font-bold text-lg shadow-[0_20px_60px_-15px_rgba(251,146,60,0.6)] hover:shadow-[0_25px_70px_-15px_rgba(251,146,60,0.8)] transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 tracking-wide">{t("actions.primary")}</span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange to-yellow-400 opacity-0 group-hover:opacity-100"
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </motion.button>

                            <motion.button
                                onClick={() => router.push("/profileDetails/ninjacards")}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-12 py-6 rounded-2xl border-2 border-white/30 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.2)]"
                            >
                                <span className="tracking-wide">{t("actions.secondary")}</span>
                            </motion.button>
                        </div>

                        {/* Trust note with icon */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-8 font-light"
                        >
                            <Shield className="w-4 h-4" />
                            <p>{t("note")}</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
