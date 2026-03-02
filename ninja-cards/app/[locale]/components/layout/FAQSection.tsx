"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQSection() {
    const t = useTranslations("LayoutFAQ");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const items = ["one", "two", "three", "four", "five"];

    return (
        <section className="relative py-32 bg-black text-white overflow-hidden">
            {/* Ambient glow effects */}
            {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" /> */}

            <div className="relative max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>
                    </motion.div>
                    <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* FAQ items */}
                <div className="space-y-5">
                    {items.map((key, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group"
                            >
                                <div
                                    className={`relative rounded-2xl border transition-all duration-300 ${isOpen
                                        ? "border-orange/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 shadow-xl shadow-orange/10"
                                        : "border-gray-700/50 bg-gray-900/50 hover:border-gray-600/50"
                                        } backdrop-blur-xl`}
                                >
                                    {/* Shine effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        className="relative w-full flex justify-between items-center p-6 text-left"
                                    >
                                        <span className={`font-semibold text-lg transition-colors ${isOpen ? "text-white" : "text-gray-200 group-hover:text-white"
                                            }`}>
                                            {t(`items.${key}.question`)}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown
                                                className={`w-6 h-6 transition-colors ${isOpen ? "text-orange" : "text-gray-400 group-hover:text-gray-300"
                                                    }`}
                                            />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-gray-700/30 pt-4">
                                                    {t(`items.${key}.answer`)}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
