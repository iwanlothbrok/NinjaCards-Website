"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const Hero: React.FC = () => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const t = useTranslations("HeroPage");

    useEffect(() => {
        const currentSection = sectionRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsImageLoaded(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (currentSection) observer.observe(currentSection);
        return () => {
            if (currentSection) observer.unobserve(currentSection);
        };
    }, []);
    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-cover bg-center overflow-hidden"
        >
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                    backgroundImage: isImageLoaded ? "url(/Metal-Hybrid-Silver.png)" : "none",
                    filter: "blur(2px)",
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />

            {/* Subtle Animated Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange/10 via-transparent to-yellow-600/10 animate-pulse" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                {/* Animated Title */}
                <motion.h1
                    className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                        {t("hero.titlePrefix")}{" "}
                    </span>
                    <span className="bg-gradient-to-r from-orange via-yellow-500 to-orange bg-clip-text text-transparent animate-pulse">
                        {t("hero.titleHighlight")}
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl leading-relaxed font-light tracking-wide"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                >
                    {t("hero.subtitlePrefix")}
                    <span className="font-semibold bg-gradient-to-r from-orange to-yellow-500 bg-clip-text text-transparent">
                        {" "}{t("hero.subtitleHighlight")}
                    </span>
                    {t("hero.subtitleSuffix")}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col md:flex-row gap-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                    <Link href="/plans">
                        <button className="relative bg-gradient-to-r from-orange to-yellow-600 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-orange/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange/50 backdrop-blur-sm">
                            <span className="relative z-10">{t("hero.buyNow")}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
                        </button>
                    </Link>
                    <Link href="/features">
                        <button className="relative bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30">
                            {t("hero.learnMore")}
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
