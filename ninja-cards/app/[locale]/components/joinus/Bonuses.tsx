'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface BonusCardProps {
    title: string;
    description: string;
    icon: string;
    index: number;
}

const BonusCard: React.FC<BonusCardProps> = ({ title, description, icon, index }) => {
    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange to-yellow-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

            <div className="relative rounded-2xl p-8 backdrop-blur-sm border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-orange/50 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                    {description}
                </p>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </motion.div>
    );
};

const Bonuses: React.FC = () => {
    const t = useTranslations("Bonuses");

    const bonuses = [0, 1, 2, 3, 4, 5].map(index => ({
        title: t(`items.${index}.title`),
        description: t(`items.${index}.description`),
        icon: t(`items.${index}.icon`)
    }));

    return (
        <section className="relative py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
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
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t("header.subtitle")}
                    </p>
                </motion.div>

                {/* Bonus Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bonuses.map((bonus, index) => (
                        <BonusCard
                            key={index}
                            title={bonus.title}
                            description={bonus.description}
                            icon={bonus.icon}
                            index={index}
                        />
                    ))}
                </div>

                {/* Footer CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <p className="text-gray-400 mb-6">
                        {t("cta.text")}
                    </p>
                    <button className="bg-gradient-to-r from-orange to-yellow-600 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-orange/50">
                        {t("cta.button")}
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Bonuses;
