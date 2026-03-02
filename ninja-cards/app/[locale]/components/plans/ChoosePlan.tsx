"use client";
import React, { useCallback } from 'react';
import { Battery, Zap, Activity, Footprints, Volume2, Droplet, Heart, Check, X, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface PlanFeature {
    icon: React.ReactNode;
    label: string;
    availableIn: ('SHINOBI' | 'SAMURAI' | 'SHOGUN' | 'FREE TRIAL')[];
}

interface Plan {
    name: 'SHINOBI' | 'SAMURAI' | 'SHOGUN' | 'FREE TRIAL';
    includes: string[];
    image: string;
    price: string;
    buttonText: string;
    gradient: string;
    badge?: string;
    popular?: boolean;
}

const ComparePlans: React.FC = () => {
    const t = useTranslations("ComparePlans");

    const allFeatures: PlanFeature[] = [
        { icon: <Battery className="w-5 h-5" />, label: t('features.0.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Zap className="w-5 h-5" />, label: t('features.1.label'), availableIn: ['SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Activity className="w-5 h-5" />, label: t('features.2.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Footprints className="w-5 h-5" />, label: t('features.3.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Volume2 className="w-5 h-5" />, label: t('features.4.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Droplet className="w-5 h-5" />, label: t('features.5.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Heart className="w-5 h-5" />, label: t('features.6.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Flame className="w-5 h-5" />, label: t('features.7.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Sparkles className="w-5 h-5" />, label: t('features.8.label'), availableIn: ['SHOGUN'] },
        { icon: <Check className="w-5 h-5" />, label: t('features.9.label'), availableIn: ['SHOGUN'] },
    ];

    const checkFeatureAvailability = useCallback((feature: PlanFeature, planName: string): boolean => {
        return feature.availableIn.includes(planName as 'SHINOBI' | 'SAMURAI' | 'SHOGUN' | 'FREE TRIAL');
    }, []);

    const plans: Plan[] = [
        {
            name: 'SHINOBI',
            includes: [
                t('plans.1.includes.0'),
                t('plans.1.includes.1'),
                t('plans.1.includes.2'),
                t('plans.1.includes.3')
            ],
            image: '/join-us.png',
            price: t('plans.1.price'),
            buttonText: t('plans.1.button'),
            gradient: 'from-slate-700 via-slate-800 to-slate-900',
        },
        {
            name: 'SAMURAI',
            includes: [
                t('plans.2.includes.0'),
                t('plans.2.includes.1'),
                t('plans.2.includes.2'),
                t('plans.2.includes.3'),
                t('plans.2.includes.4'),
                t('plans.2.includes.5')
            ],
            image: '/join-us.png',
            price: t('plans.2.price'),
            buttonText: t('plans.2.button'),
            gradient: 'from-orange-500 via-amber-500 to-yellow-500',
            badge: t('plans.2.badge'),
            popular: true,
        },
        {
            name: 'SHOGUN',
            includes: [
                t('plans.3.includes.0'),
                t('plans.3.includes.1'),
                t('plans.3.includes.2'),
                t('plans.3.includes.3'),
                t('plans.3.includes.4'),
                t('plans.3.includes.5')
            ],
            image: '/join-us.png',
            price: t('plans.3.price'),
            buttonText: t('plans.3.button'),
            gradient: 'from-violet-600 via-purple-600 to-indigo-600',
            badge: t('plans.3.badge'),
        },
    ];

    return (
        <section className="relative py-40 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
            {/* Premium Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)',
                    backgroundSize: '80px 80px'
                }} className="absolute inset-0" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block mb-8 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-violet-600/20 border border-orange-500/40 rounded-full backdrop-blur-xl">
                        <span className="text-orange-400 text-xs font-bold tracking-widest uppercase drop-shadow-lg">{t("badge") || "Exclusive Plans"}</span>
                    </div>
                    <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter">
                        <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent block mb-2">
                            {t("header.titlePrimary")}
                        </span>
                        <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                            {t("header.titleHighlight")}
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        {t("header.subtitle")}
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 auto-rows-max">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            className={`relative group h-full ${plan.popular ? 'md:row-span-1' : ''}`}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            {/* Premium Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${plan.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 -z-10`} />
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700 -z-10`} />

                            <div className={`relative rounded-2xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 h-full flex flex-col ${plan.popular
                                ? 'border-orange-400/60 bg-gradient-to-br from-orange-950/20 via-black to-black shadow-2xl shadow-orange-500/10 md:scale-105 origin-center'
                                : 'border-gray-700/40 bg-gradient-to-br from-gray-900/30 to-black hover:border-gray-600/60'
                                }`}>

                                {/* Badge */}
                                {plan.badge && (
                                    <motion.div
                                        className="absolute -top-1 left-6 z-20"
                                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                    >
                                        <div className={`bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl shadow-orange-500/30 uppercase tracking-widest`}>
                                            {plan.badge}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Header */}
                                <div className={`relative px-8 py-12 bg-gradient-to-br ${plan.gradient} ${plan.popular ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'} transition-opacity duration-300`}>
                                    <h3 className="text-4xl font-black text-white text-center mb-4 tracking-wider drop-shadow-lg">
                                        {plan.name}
                                    </h3>
                                    <p className="text-white/90 text-center font-bold text-2xl drop-shadow-lg">
                                        {plan.price}
                                    </p>
                                </div>

                                {/* Image Container */}
                                <div className="relative bg-gradient-to-b from-gray-900/40 to-black/60 flex items-center justify-center px-6 py-8 border-b border-gray-700/20 min-h-48">
                                    <Image
                                        src={plan.image}
                                        alt={plan.name}
                                        width={300}
                                        height={200}
                                        className="object-contain group-hover:scale-150 transition-transform duration-500 drop-shadow-lg"
                                    />
                                </div>

                                {/* Includes Section */}
                                <div className="px-8 py-6 space-y-3 border-b border-gray-700/20 bg-gray-900/10">
                                    {plan.includes.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5 drop-shadow-lg" />
                                            <span className="text-gray-300 text-sm font-medium leading-relaxed">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Features */}
                                <div className="px-8 py-6 space-y-3 flex-grow">
                                    {allFeatures.map((feature, i) => {
                                        const hasFeature = checkFeatureAvailability(feature, plan.name);
                                        return (
                                            <motion.div
                                                key={i}
                                                className="flex items-center gap-3"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                            >
                                                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${hasFeature
                                                    ? 'bg-gradient-to-br from-orange-400/40 to-orange-600/20 text-orange-300 shadow-lg shadow-orange-500/20'
                                                    : 'bg-gray-700/20 text-gray-600'
                                                    }`}>
                                                    {hasFeature ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium transition-all duration-300 ${hasFeature
                                                    ? 'text-gray-200'
                                                    : 'text-gray-500 line-through'
                                                    }`}>
                                                    {feature.label}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* CTA Button */}
                                <div className="px-8 py-8">
                                    <Link
                                        href="/joinus"
                                        className={`group/btn relative block w-full bg-gradient-to-r ${plan.gradient} text-white font-bold text-sm py-4 px-6 rounded-xl hover:shadow-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-center uppercase tracking-wider overflow-hidden`}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {plan.name === 'SAMURAI' ? '🚀 Unlock All Features' : plan.buttonText}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                    {plan.name === 'SAMURAI' && (
                                        <p className="text-orange-400 text-xs text-center mt-4 font-semibold">
                                            ✓ Best Value for Professionals
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <motion.div
                    className="mt-24 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <p className="text-gray-400 text-lg mb-2">Need a custom plan?</p>
                    <Link href="/contact" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors inline-flex items-center gap-2">
                        Contact our sales team <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparePlans;