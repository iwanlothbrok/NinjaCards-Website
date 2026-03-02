'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface MembershipTier {
    name: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    gradient: string;
    highlighted?: boolean;
    badge?: string;
    note?: string;
}

export default function ChooseMembership() {
    const t = useTranslations("ChoosePlan");

    const membershipTiers: MembershipTier[] = [
        {
            name: t("plans.shinobi.name"),
            price: t("plans.shinobi.price"),
            period: t("plans.shinobi.period"),
            gradient: "from-gray-900 to-gray-800",
            features: [
                t("plans.shinobi.features.0"),
                t("plans.shinobi.features.1"),
                t("plans.shinobi.features.2"),
                t("plans.shinobi.features.3"),
                t("plans.shinobi.features.4")
            ],
            buttonText: t("plans.shinobi.button"),
            badge: t("plans.shinobi.badge") || undefined,
            note: t("plans.shinobi.note") || undefined
        },
        {
            name: t("plans.samurai.name"),
            price: t("plans.samurai.price"),
            period: t("plans.samurai.period"),
            gradient: "from-orange via-yellow-600 to-orange",
            features: [
                t("plans.samurai.features.0"),
                t("plans.samurai.features.1"),
                t("plans.samurai.features.2"),
                t("plans.samurai.features.3"),
                t("plans.samurai.features.4"),
                t("plans.samurai.features.5")
            ],
            buttonText: t("plans.samurai.button"),
            highlighted: true,
            badge: t("plans.samurai.badge"),
            note: t("plans.samurai.note")
        },
        {
            name: t("plans.shogun.name"),
            price: t("plans.shogun.price"),
            period: t("plans.shogun.period"),
            gradient: "from-gray-900 via-orange to-yellow-600",
            features: [
                t("plans.shogun.features.0"),
                t("plans.shogun.features.1"),
                t("plans.shogun.features.2"),
                t("plans.shogun.features.3"),
                t("plans.shogun.features.4"),
                t("plans.shogun.features.5"),
                t("plans.shogun.features.6"),
                t("plans.shogun.features.7")
            ],
            buttonText: t("plans.shogun.button"),
            badge: t("plans.shogun.badge"),
            note: t("plans.shogun.note")
        }
    ];

    // Animate entrance after HeroJoin
    return (
        <motion.section
            className="relative py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange/5 via-transparent to-yellow-600/5" />
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {t("header.titlePrimary")}{" "}
                        </span>
                        <span className="bg-gradient-to-r from-orange via-yellow-500 to-orange bg-clip-text text-transparent">
                            {t("header.titleHighlight")}
                        </span>
                    </h2>
                    <button className="text-sm text-gray-400 hover:text-orange transition-colors duration-300 border-b border-gray-700 hover:border-orange pb-1">
                        {t("header.compare")}
                    </button>
                </motion.div>

                {/* Membership Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {membershipTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            className="relative group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            {/* Glow Effect */}
                            {tier.highlighted && (
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange to-yellow-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                            )}

                            <div className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-all duration-300 ${tier.highlighted
                                ? 'bg-gradient-to-br from-gray-900/90 to-black/90 border-orange/50 transform scale-105'
                                : 'bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800 hover:border-gray-700'
                                }`}>
                                {/* Badge */}
                                {tier.badge && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-orange to-yellow-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            {tier.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-black tracking-widest mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {tier.name}
                                    </h3>

                                    {/* Card Preview */}
                                    <div className={`relative aspect-video rounded-2xl mb-6 bg-gradient-to-br ${tier.gradient} p-1 overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="relative h-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm drop-shadow-lg">
                                                {tier.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-2">
                                        <span className={`text-5xl font-black ${tier.highlighted
                                            ? 'bg-gradient-to-r from-orange to-yellow-500 bg-clip-text text-transparent'
                                            : 'text-white'
                                            }`}>
                                            {tier.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">{tier.period}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-sm">
                                            <span className={`mr-3 mt-0.5 ${tier.highlighted ? 'text-orange' : 'text-gray-500'
                                                }`}>
                                                ✓
                                            </span>
                                            <span className={`${idx === 0 && tier.highlighted
                                                ? 'font-bold text-white'
                                                : 'text-gray-300'
                                                }`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button className={`relative w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${tier.highlighted
                                    ? 'bg-gradient-to-r from-orange to-yellow-600 text-white shadow-2xl hover:shadow-orange/50 focus:ring-orange/50'
                                    : 'bg-white text-black hover:bg-gray-200 focus:ring-white/50'
                                    }`}>
                                    {tier.buttonText}
                                </button>

                                {tier.note && (
                                    <p className="text-center text-xs mt-4 text-gray-400">
                                        {tier.note}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <p className="text-sm text-gray-500">
                        {t("footer.question")}{' '}
                        <button className="text-orange hover:text-yellow-500 transition-colors duration-300 underline">
                            {t("footer.link")}
                        </button>
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
}