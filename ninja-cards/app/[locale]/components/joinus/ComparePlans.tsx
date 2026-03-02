"use client";
import React from 'react';
import { Battery, Zap, Activity, Footprints, Volume2, Droplet, Heart, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import router from 'next/router';
import { addToCart, loadCartFromLocalStorage } from '@/lib/cart';

interface PlanFeature {
    icon: React.ReactNode;
    label: string;
    availableIn: ('SHINOBI' | 'SAMURAI' | 'SHOGUN' | 'FREE TRIAL')[];
}

interface Plan {
    name: 'SHINOBI' | 'SAMURAI' | 'SHOGUN' | 'FREE TRIAL';
    includes: string[];
    image: string;
    priceForMonth: string;
    priceForYear: string;
    buttonText: string;
    gradient: string;
    monthlyPriceId?: string;
    yearlyPriceId?: string;
    badge?: string;
    popular?: boolean;
}

const ComparePlans: React.FC = () => {
    const t = useTranslations("ComparePlans");
    const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
    const [alert, setAlert] = React.useState<string | null>(null);
    const router = useRouter();
    const allFeatures: PlanFeature[] = [
        { icon: <Battery className="w-5 h-5" />, label: t('features.0.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Zap className="w-5 h-5" />, label: t('features.1.label'), availableIn: ['SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Activity className="w-5 h-5" />, label: t('features.2.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Footprints className="w-5 h-5" />, label: t('features.3.label'), availableIn: ['FREE TRIAL', 'SHINOBI', 'SAMURAI', 'SHOGUN'] },
        { icon: <Volume2 className="w-5 h-5" />, label: t('features.4.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Droplet className="w-5 h-5" />, label: t('features.5.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Heart className="w-5 h-5" />, label: t('features.6.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Heart className="w-5 h-5" />, label: t('features.7.label'), availableIn: ['SAMURAI', 'SHOGUN'] },
        { icon: <Heart className="w-5 h-5" />, label: t('features.8.label'), availableIn: ['SHOGUN'] },
        { icon: <Heart className="w-5 h-5" />, label: t('features.9.label'), availableIn: ['SHOGUN'] },
    ];

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
            priceForMonth: t('plans.1.priceForMonth'),
            priceForYear: t('plans.1.priceForYear'),
            buttonText: t('plans.1.button'),
            gradient: 'from-gray-800 to-gray-900',
            monthlyPriceId: "",
            yearlyPriceId: ""
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
            priceForMonth: t('plans.2.priceForMonth'),
            priceForYear: t('plans.2.priceForYear'),
            buttonText: t('plans.2.button'),
            gradient: 'from-orange via-yellow-600 to-orange',
            badge: t('plans.2.badge'),
            popular: true,
            monthlyPriceId: "price_1T4dKABMFJ6zM7JJt4Qyj9H1",
            yearlyPriceId: "price_1T4dLDBMFJ6zM7JJKwbJIErp"
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
            priceForMonth: t('plans.3.priceForMonth'),
            priceForYear: t('plans.3.priceForYear'),
            buttonText: t('plans.3.button'),
            gradient: 'from-gray-900 via-orange to-yellow-600',
            badge: t('plans.3.badge'),
            monthlyPriceId: "",
            yearlyPriceId: ""
        },
    ];

    const showToast = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(null), 1500);
    };

    const handleCheckout = async (name: string, price: number, monthlyPriceId: string, yearlyPriceId: string) => {

        const cartItems = loadCartFromLocalStorage();
        if (cartItems && cartItems.items && cartItems.items.length > 0) {
            const hasDesignItem = cartItems.items.some(item => item.type === 'subscription');

            if (hasDesignItem) {
                showToast(t('alertAlreadyInCart'));
                await new Promise(resolve => setTimeout(resolve, 2000));
                router.push('/cart');
                return;
            }
        }

        let cart = loadCartFromLocalStorage();
        let isFree = false;
        if (price === 0) {
            isFree = true;
        }

        addToCart(cart, {
            type: "subscription",
            name: `${name}`,
            photoUrl: `/join-us.png`,
            quantity: 1,
            subscriptionType: billingCycle,
            price: price,
            isFree: isFree,
            priceId: `${billingCycle === "monthly" ? monthlyPriceId : yearlyPriceId}`
        })

        showToast(t('alertSuccsess'));
        await new Promise(resolve => setTimeout(resolve, 500));
        if (cartItems && cartItems.items && cartItems.items.length > 0) {
            const hasDesignItem = cartItems.items.some(item => item.type === 'design');
            router.push(hasDesignItem ? '/cart' : '/cards');
        } else {
            router.push('/cards');
        }

    };

    return (
        <section className="relative py-32 px-4 bg-black overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
            </div>
            {alert && (
                <div className="fixed inset-0 flex items-start justify-center z-[9999] pointer-events-none">
                    <motion.div
                        initial={{ y: -60, opacity: 0, scale: 0.95 }}
                        animate={{ y: 40, opacity: 1, scale: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl border-4 border-white/30 font-bold text-lg flex items-center gap-3 pointer-events-auto"
                    >
                        <span>{alert}</span>
                    </motion.div>
                </div>
            )}
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)',
                    backgroundSize: '60px 60px'
                }} className="absolute inset-0" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Premium Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-orange/20 to-yellow-600/20 border border-orange/30 rounded-full">
                        <span className="text-orange text-xs font-bold tracking-widest uppercase">{t("badge") || "Premium Plans"}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                        <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                            {t("header.titlePrimary")}{" "}
                        </span>
                        <span className="bg-gradient-to-r from-orange via-yellow-500 to-orange bg-clip-text text-transparent drop-shadow-lg">
                            {t("header.titleHighlight")}
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {t("header.subtitle")}
                    </p>
                </motion.div>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mb-12"
                >
                    <span className={`text-base font-semibold transition-all ${billingCycle === "monthly" ? "text-white scale-110" : "text-gray-500"}`}>
                        {t("monthly") || "Monthly"}
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                        className="relative w-16 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 transition-all hover:shadow-lg hover:shadow-orange/20 border border-gray-600"
                    >
                        <motion.div
                            animate={{ x: billingCycle === "monthly" ? 2 : 30 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange via-yellow-500 to-orange shadow-xl shadow-orange/50"
                        />
                    </button>
                    <span className={`text-base font-semibold transition-all ${billingCycle === "yearly" ? "text-white scale-110" : "text-gray-500"}`}>
                        {t("yearly") || "Yearly"}
                    </span>
                    {billingCycle === "yearly" && (
                        <motion.span
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs font-bold border border-green-500/40 shadow-lg shadow-green-500/20"
                        >
                            {t("save20") || "Save 20%"}
                        </motion.span>
                    )}
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            className={`relative group ${plan.popular ? 'md:scale-[1.05]' : ''}`}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                        >
                            {/* Premium Glow */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500 -z-10`} />

                            <div className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border ${plan.popular
                                ? 'border-orange/50 bg-gradient-to-br from-orange/5 via-black to-black shadow-2xl shadow-orange/20'
                                : 'border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-black'
                                } hover:border-orange/80 transition-all duration-500 h-full flex flex-col group ${plan.name === 'SHINOBI' ? 'opacity-50 pointer-events-none' : ''}`}>

                                {/* Premium Badge */}
                                {plan.badge && (
                                    <motion.div
                                        className="absolute top-3 left-1 mb-2 -translate-x-1/2 z-20"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                    >
                                        <span className={`bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold px-5 py-2 rounded-full shadow-xl shadow-orange/20 uppercase tracking-widest`}>
                                            {plan.badge}
                                        </span>
                                    </motion.div>
                                )}

                                {plan.name === 'SHINOBI' && (
                                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 rounded-3xl">
                                        <span className="text-white font-bold text-lg">{t('comingSoon') || 'Coming Soon'}</span>
                                    </div>
                                )}

                                {/* Premium Header */}
                                <div className={`relative px-8 py-10 bg-gradient-to-br ${plan.gradient} ${plan.popular ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-opacity duration-300`}>
                                    <h3 className="text-3xl font-black text-white text-center mb-2 tracking-wider drop-shadow-lg">
                                        {plan.name}
                                    </h3>
                                    <div className="text-center">
                                        <p className={`text-white/95 text-center font-bold text-xl mb-2 ${(plan.name === 'SAMURAI' || plan.name === 'SHINOBI') ? 'line-through text-red-500' : ''
                                            }`}>
                                            {billingCycle === "monthly" ? plan.priceForMonth : plan.priceForYear}
                                        </p>
                                        {(plan.name === 'SAMURAI' || plan.name === 'SHINOBI') && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 shadow-lg shadow-green-500/10"
                                            >
                                                <span className="text-green-300 text-xs font-bold tracking-wider uppercase drop-shadow-sm">
                                                    {t('freeFirstMonth')}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Image Container */}
                                <div className="relative h-48 bg-gradient-to-b from-gray-900/50 to-black/50 flex items-center justify-center px-6 border-b border-gray-800/30">
                                    <Image
                                        src={plan.image}
                                        alt={plan.name}
                                        width={300}
                                        height={220}
                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Includes Section */}
                                <div className="px-8 py-4 space-y-2 border-b border-gray-800/30 bg-gray-900/20 scrollbar-hide">
                                    {plan.includes.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Check className="w-4 h-4 text-orange flex-shrink-0 mt-0.5 drop-shadow-lg" />
                                            <span className="text-gray-300 text-xs font-medium">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Features */}
                                <div className="px-8 py-4 space-y-3 flex-grow scrollbar-hide">
                                    {allFeatures.map((feature, i) => {
                                        const hasFeature = feature.availableIn.includes(plan.name);
                                        return (
                                            <motion.div
                                                key={i}
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                            >
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${hasFeature
                                                    ? 'bg-gradient-to-br from-orange/30 to-orange/10 text-orange shadow-lg shadow-orange/20'
                                                    : 'bg-gray-800/30 text-gray-600'
                                                    }`}>
                                                    {hasFeature ? (
                                                        <Check className="w-3 h-3" />
                                                    ) : (
                                                        <X className="w-3 h-3" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-xs font-semibold transition-all duration-300 ${hasFeature
                                                        ? 'text-gray-200'
                                                        : 'text-gray-500 line-through'
                                                        }`}>
                                                        {feature.label}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Premium Button */}
                                <div className="px-8 py-6">
                                    <button
                                        disabled={plan.name === 'SHINOBI'}
                                        onClick={() => {
                                            const priceString = billingCycle === "monthly" ? plan.priceForMonth : plan.priceForYear;
                                            const price = priceString === "Free" || billingCycle === "monthly" ? 0 : parseFloat(priceString.match(/[\d.]+/)?.[0] || '0');
                                            handleCheckout(plan.name, price, plan.monthlyPriceId || "", plan.yearlyPriceId || "");
                                        }}
                                        className={`block w-full bg-gradient-to-r ${plan.gradient} text-white font-bold text-xs py-3 px-4 rounded-full hover:shadow-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-center uppercase tracking-widest ${plan.name === 'SHINOBI' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {plan.buttonText}
                                    </button>
                                    {plan.name === 'SAMURAI' && (
                                        <p className="text-orange text-xs text-center mt-3 font-semibold">
                                            {t('plans.2.miniDescription')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComparePlans;