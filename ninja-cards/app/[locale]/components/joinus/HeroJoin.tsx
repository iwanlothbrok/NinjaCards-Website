'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const HeroJoin: React.FC = () => {
    const t = useTranslations("HeroJoin");

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden pt-36 py-20 px-4 sm:px-6 lg:px-8">
            {/* Subtle Animated Gradient */}

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                {/* Main Heading */}
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                        {t("title.line1")}{" "}
                    </span>
                    <span className="bg-gradient-to-r from-orange via-yellow-500 to-orange bg-clip-text text-transparent animate-pulse">
                        {t("title.line2")}
                    </span>
                </motion.h1>

                {/* Membership Types */}
                <motion.div
                    className="flex justify-center items-center gap-8 md:gap-16 mb-16 text-2xl md:text-3xl font-bold tracking-widest"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <span className="text-white hover:text-orange transition-colors duration-300">{t("tagline.0")}</span>
                    <span className="bg-gradient-to-r from-orange to-yellow-500 bg-clip-text text-transparent">{t("tagline.1")}</span>
                    <span className="text-white hover:text-orange transition-colors duration-300">{t("tagline.2")}</span>
                </motion.div>

                {/* Product Image */}
                <motion.div
                    className="mb-16 flex justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                    <div className="relative max-w-5xl w-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-yellow-600/20 blur-3xl rounded-full" />
                        <img
                            src="/join-us.png"
                            alt="NinjaCards Memberships"
                            className="relative max-w-full h-auto w-full drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
                        {t("description.main")}{" "}
                        <span className="font-semibold bg-gradient-to-r from-orange to-yellow-500 bg-clip-text text-transparent">
                            {t("description.highlight")}
                        </span>
                    </p>
                    <p className="text-2xl md:text-3xl text-white font-bold">
                        {t("description.free")}
                    </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    className="mt-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                >
                    <button className="relative bg-gradient-to-r from-orange to-yellow-600 text-white px-12 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-orange/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange/50 backdrop-blur-sm">
                        <span className="relative z-10">{t("cta.primary")}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroJoin;