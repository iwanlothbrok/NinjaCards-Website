"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Feature {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    gradient: string;
    membershipType: string;
    badge?: string;
}

const ExploreFeatures: React.FC = () => {
    const t = useTranslations("ExploreFeatures");
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Build features array from translations
    const features: Feature[] = [
        {
            id: 1,
            title: t("features.0.title"),
            subtitle: t("features.0.subtitle"),
            description: t("features.0.description"),
            image: '/features/01-digital.png',
            gradient: 'from-orange via-yellow-600 to-orange',
            membershipType: t("features.0.availability"),
            badge: t("features.0.badge")
        },
        {
            id: 2,
            title: t("features.1.title"),
            subtitle: t("features.1.subtitle"),
            description: t("features.1.description"),
            image: '/features/02-analyse.png',
            gradient: 'from-orange via-yellow-600 to-orange',
            membershipType: t("features.1.availability"),
            badge: t("features.1.badge")
        },
        {
            id: 3,
            title: t("features.2.title"),
            subtitle: t("features.2.subtitle"),
            description: t("features.2.description"),
            image: '/features/03-branding.png',
            gradient: 'from-gray-900 via-orange to-yellow-600',
            membershipType: t("features.2.availability")
        },
        {
            id: 4,
            title: t("features.3.title"),
            subtitle: t("features.3.subtitle"),
            description: t("features.3.description"),
            image: '/features/04-admin.png',
            gradient: 'from-gray-900 via-orange to-yellow-600',
            membershipType: t("features.3.availability"),
            badge: t("features.3.badge")
        },
        {
            id: 5,
            title: t("features.4.title"),
            subtitle: t("features.4.subtitle"),
            description: t("features.4.description"),
            image: '/features/05-nfc.png',
            gradient: 'from-gray-900 via-orange to-yellow-600',
            membershipType: t("features.4.availability"),
        },
        {
            id: 6,
            title: t("features.5.title"),
            subtitle: t("features.5.subtitle"),
            description: t("features.5.description"),
            image: '/features/06-leads.png',
            gradient: 'from-gray-900 via-orange to-yellow-600',
            membershipType: t("features.5.availability"),
            badge: t("features.5.badge")
        },
        {
            id: 7,
            title: t("features.6.title"),
            subtitle: t("features.6.subtitle"),
            description: t("features.6.description"),
            image: '/features/07-info.png',
            gradient: 'from-orange via-yellow-600 to-orange',
            membershipType: t("features.6.availability"),
        }
    ];

    const scrollToSlide = (index: number) => {
        setCurrentSlide(index);
        if (containerRef.current) {
            const cardWidth = 360;
            containerRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = 360;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentSlide(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange/5 via-transparent to-yellow-600/5" />
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
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
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t("header.subtitle")}
                    </p>
                </motion.div>

                <div className="relative">
                    <div
                        ref={containerRef}
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4 -mx-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                className="flex-none w-[340px] snap-center group"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 hover:border-orange/50 transition-all duration-300">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange/20 to-yellow-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                                    {feature.badge && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="bg-gradient-to-r from-orange to-yellow-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                {feature.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="relative h-[400px] overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-cover mix-blend-overlay opacity-40"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                            <div>
                                                <p className="text-white/80 text-sm font-semibold mb-2 tracking-wide">
                                                    {feature.title}
                                                </p>
                                                <h3 className="text-white text-2xl font-black leading-tight drop-shadow-lg">
                                                    {feature.subtitle}
                                                </h3>
                                            </div>

                                            <button className="self-end w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20">
                                                <span className="text-white text-2xl font-light">→</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 backdrop-blur-sm bg-black/40">
                                        <p className="text-gray-400 text-sm mb-3">
                                            {feature.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("availableText")}</span>
                                            <span className="text-xs font-bold tracking-wider px-4 py-1.5 rounded-full bg-gradient-to-r from-orange via-yellow-600 to-orange text-white shadow-lg">
                                                {feature.membershipType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? 'bg-gradient-to-r from-orange to-yellow-600 w-12'
                                    : 'bg-gray-700 w-2 hover:bg-gray-600'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExploreFeatures;
