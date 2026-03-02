"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface FreeTrialProps {
    onStartTrial?: () => void;
}

const FreeTrial: React.FC<FreeTrialProps> = ({ onStartTrial }) => {
    const t = useTranslations("FreeTrial");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This ensures the code only runs on the client side
        setIsClient(true);
    }, []);

    const handleClick = () => {
        if (isClient) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
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
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange/20 to-yellow-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16">
                        {/* Phone Image Section */}
                        <motion.div
                            className="flex justify-center lg:justify-start"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative group/phone">
                                {/* Phone Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange via-yellow-500 to-orange blur-3xl opacity-30 group-hover/phone:opacity-50 transition-opacity duration-500" />

                                <div className="relative">
                                    <Image
                                        src="/realMockup-05.png"
                                        alt="App Preview"
                                        width={300}
                                        height={600}
                                        className="w-full max-w-sm drop-shadow-2xl transform group-hover/phone:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Section */}
                        <motion.div
                            className="flex flex-col space-y-6"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 w-fit">
                                <span className="bg-gradient-to-r from-orange to-yellow-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                    {t("badge.label")}
                                </span>
                                <span className="text-gray-400 text-xs font-semibold tracking-widest">
                                    {t("badge.subLabel")}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                                <span className="bg-gradient-to-r from-orange via-yellow-500 to-orange bg-clip-text text-transparent">
                                    {t("title")}
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {t("description")}
                            </p>


                            {/* Button Glow */}
                            {/* <div className="absolute -inset-1 bg-gradient-to-r from-orange via-yellow-500 to-orange blur opacity-75 group-hover/btn:opacity-100 transition duration-300" /> */}

                            {/* Button Content */}
                            <button
                                type="button"
                                onClick={handleClick}
                                className="relative bg-gradient-to-r from-orange to-yellow-600 px-8 py-4 rounded-full font-bold text-white shadow-lg transform group-hover/btn:scale-105 transition-all duration-300"
                            >
                                <span className="flex items-center gap-2">
                                    {t("buttonText")}
                                    <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
                                        →
                                    </span>
                                </span>
                            </button>

                            {/* Additional Info */}
                            <div className="flex items-center gap-3 pt-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-yellow-600 border-2 border-gray-900"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {t("socialProof.text")}{" "}
                                    <span className="text-white font-semibold">{t("socialProof.highlight")}</span>{" "}
                                    {t("socialProof.suffix")}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FreeTrial;
