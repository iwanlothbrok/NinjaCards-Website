"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const cases = [
    { key: "sales", emoji: "💼", gradient: "from-blue-500 to-cyan-500" },
    { key: "marketing", emoji: "🎤", gradient: "from-purple-500 to-pink-500" },
    { key: "consultants", emoji: "🧑‍💻", gradient: "from-green-500 to-emerald-500" },
    { key: "entrepreneurs", emoji: "🏠", gradient: "from-orange to-red-500" },
];

export default function RealUseCases() {
    const t = useTranslations("RealUseCases");

    return (
        <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange/20 via-transparent to-transparent"></div> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((item, index) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative"
                        >
                            {/* Gradient glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`}></div>

                            {/* Card */}
                            <div className="relative rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-8 hover:border-gray-600 transition-all duration-300 h-full shadow-2xl">
                                {/* Emoji with gradient background */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 text-3xl shadow-lg`}>
                                    {item.emoji}
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white">
                                    {t(`${item.key}.title`)}
                                </h3>

                                <ul className="space-y-3 text-gray-300">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-xs font-bold mt-0.5`}>✓</span>
                                            <span className="text-sm leading-relaxed">{t(`${item.key}.points.${i}`)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
