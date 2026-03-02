// app/(wherever)/ChooseCard.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { addToCart, loadCartFromLocalStorage } from '@/lib/cart';
import { useTranslations } from 'next-intl';

interface CardStyle {
    key: string;
    label: string;
    src: string;
    priceId?: string;
}

interface SelectedCard {
    style: CardStyle;
    quantity: number;
    addedAt: number;
}

const UNIT_PRICE_EUR = 20;
const FREE_PRICE_EUR = 0;

const SPECIAL_KEYS = new Set(['black', 'bamboo']);

type PricingLine = {
    key: string;
    label: string;
    quantity: number;
    freeUnits: number;
    paidUnits: number;
    unitPrice: number;
    lineTotal: number;
};

function computePricing(selectedCards: SelectedCard[]): { lines: PricingLine[]; total: number } {
    const sorted = [...selectedCards].sort((a, b) => a.addedAt - b.addedAt);

    let freeRemaining = 1;

    const lines: PricingLine[] = sorted.map((card) => {
        const isSpecial = SPECIAL_KEYS.has(card.style.key);

        const freeUnits = !isSpecial && freeRemaining > 0 ? 1 : 0;
        if (freeUnits > 0) freeRemaining -= 1;

        const paidUnits = Math.max(0, card.quantity - freeUnits);
        const unitPrice = isSpecial ? UNIT_PRICE_EUR : UNIT_PRICE_EUR;
        const lineTotal = (isSpecial ? card.quantity : paidUnits) * UNIT_PRICE_EUR + freeUnits * FREE_PRICE_EUR;

        return {
            key: card.style.key,
            label: card.style.label,
            quantity: card.quantity,
            freeUnits,
            paidUnits,
            unitPrice,
            lineTotal,
        };
    });

    const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    return { lines, total };
}

const ChooseCard: React.FC = () => {
    const t = useTranslations('ChooseCard');
    const freeCardPriceId = 'price_1T4dPuBMFJ6zM7JJhVKEFFGm';

    const cardStyles: CardStyle[] = [
        { key: 'pulse-green', label: t('cards.pulseGreen'), src: '/cards/circles-green.png', priceId: freeCardPriceId },
        { key: 'black', label: t('cards.personalized'), src: '/cards/personalized.png', priceId: 'price_1T4dQrBMFJ6zM7JJQtd86e3T' },
        { key: 'pulse-orange', label: t('cards.pulseOrange'), src: '/cards/circles-orange.png', priceId: freeCardPriceId },
        { key: 'women-colors', label: t('cards.flow'), src: '/cards/women-colors.png', priceId: freeCardPriceId },
        { key: 'inferno', label: t('cards.inferno'), src: '/cards/gradient-lines-red.png', priceId: freeCardPriceId },
        { key: 'money', label: t('cards.legacy'), src: '/cards/money.png', priceId: freeCardPriceId },
        { key: 'sky', label: t('cards.galaxy'), src: '/cards/sky.png', priceId: freeCardPriceId },
        { key: 'gradient', label: t('cards.softGradient'), src: '/cards/gradient.png', priceId: freeCardPriceId },
    ];

    const now = Date.now();

    const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([
        { style: cardStyles[0], quantity: 1, addedAt: now },
    ]);
    const [previewCard, setPreviewCard] = useState<CardStyle>(cardStyles[0]);
    const [alert, setAlert] = useState<string | null>(null);

    const showToast = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(null), 2500);
    };

    const { lines, total: totalPrice } = useMemo(() => computePricing(selectedCards), [selectedCards]);

    const addCard = (style: CardStyle) => {
        setSelectedCards((prev) => {
            const existing = prev.find((c) => c.style.key === style.key);
            if (existing) {
                return prev.map((c) => (c.style.key === style.key ? { ...c, quantity: c.quantity + 1 } : c));
            }
            return [...prev, { style, quantity: 1, addedAt: Date.now() }];
        });
        setPreviewCard(style);
    };

    const removeCard = (key: string) => {
        setSelectedCards((prev) => prev.filter((c) => c.style.key !== key));
    };

    const handleAddToCart = async () => {
        const cart = loadCartFromLocalStorage();

        const { lines: computedLines } = computePricing(selectedCards);

        computedLines.forEach((line) => {
            const style = selectedCards.find((c) => c.style.key === line.key)?.style;
            if (!style) return;

            const isSpecial = SPECIAL_KEYS.has(style.key);

            if (line.freeUnits > 0 && !isSpecial) {
                addToCart(cart, {
                    type: 'design',
                    name: style.label,
                    photoUrl: style.src,
                    quantity: line.freeUnits,
                    price: FREE_PRICE_EUR,
                    isFree: true,
                    priceId: style.priceId || freeCardPriceId,
                });
            }

            const paidQty = isSpecial ? line.quantity : line.paidUnits;
            if (paidQty > 0) {
                addToCart(cart, {
                    type: 'design',
                    name: style.label,
                    photoUrl: style.src,
                    quantity: paidQty,
                    price: UNIT_PRICE_EUR,
                    isFree: false,
                    priceId: style.priceId || freeCardPriceId,
                });
            }
        });

        showToast(t('toast.added'));
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const cartItems = cart.items;
        const hasSubscription = cartItems.some((item) => item.type === 'subscription');

        window.location.href = hasSubscription ? '/cart' : '/plans';
    };

    const pricingSubtitle = t('pricing.subtitleFreeFirst', { price: FREE_PRICE_EUR });

    return (
        <div className="min-h-screen bg-black text-white pt-44 py-32 px-4">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {alert && (
                <div className="fixed inset-0 flex items-start justify-center z-[9999] pointer-events-none">
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 40, opacity: 1 }}
                        className="bg-gradient-to-r from-amber-400 to-orange text-black px-8 py-4 rounded-2xl shadow-2xl border border-amber-300/50 font-bold text-lg pointer-events-auto backdrop-blur-xl"
                    >
                        {alert}
                    </motion.div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-20">
                    <h1 className="text-7xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange bg-clip-text text-transparent mb-6 tracking-tight">
                        {t('hero.title')}
                    </h1>
                    <div className="flex justify-center gap-2 mb-6">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-orange to-transparent rounded-full" />
                        <div className="w-12 h-1 bg-gradient-to-l from-amber-400 to-transparent rounded-full" />
                    </div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">{pricingSubtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                <div className="relative w-full aspect-[85/55] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-gray-950">
                                    <Image src={previewCard.src} alt={previewCard.label} fill className="object-cover" priority />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-3 bg-gray-900/30 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all"
                            >
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-light">{t('preview.label')}</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange bg-clip-text text-transparent">
                                    {previewCard.label}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2 space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                                {t('choose.title')}
                                <div className="h-1 flex-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cardStyles.map((style) => {
                                    const isSelected = selectedCards.some((c) => c.style.key === style.key);
                                    return (
                                        <motion.button
                                            key={style.key}
                                            whileHover={{ scale: 1.08, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addCard(style)}
                                            className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-amber-400 shadow-xl shadow-amber-400/30' : 'hover:ring-2 hover:ring-amber-400/50'
                                                }`}
                                        >
                                            <Image src={style.src} alt={style.label} width={150} height={100} className="w-full aspect-[3/2] object-cover" />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center">
                                                <p className="text-white font-semibold text-sm text-center px-2">{style.label}</p>
                                                {isSelected && (
                                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-amber-300 text-2xl mt-2">
                                                        ✓
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 space-y-6"
                        >
                            <h3 className="text-xl font-bold">{t('selection.title', { count: selectedCards.length })}</h3>

                            {selectedCards.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">{t('selection.empty')}</p>
                            ) : (
                                <div className="space-y-3">
                                    {lines.map((line) => (
                                        <motion.div
                                            key={line.key}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all group"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">{line.label}</p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {line.freeUnits > 0 ? (
                                                        t.rich('selection.lineWithFree', {
                                                            qty: line.quantity,
                                                            paidQty: line.paidUnits,
                                                            price: UNIT_PRICE_EUR,
                                                            total: line.lineTotal,
                                                            free: (chunks) => <span className="text-amber-300 font-semibold">{chunks}</span>,
                                                            paidPart: line.paidUnits > 0 ? t('selection.paidPart', { paidQty: line.paidUnits, price: UNIT_PRICE_EUR }) : '',
                                                        })
                                                    ) : (
                                                        t('selection.lineNoFree', {
                                                            total: line.lineTotal,
                                                            paidQty: line.paidUnits,
                                                            price: UNIT_PRICE_EUR,
                                                            qty: line.quantity,
                                                        })
                                                    )}
                                                </p>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => removeCard(line.key)}
                                                className="text-red-400/60 hover:text-red-400 font-bold ml-4 transition-colors"
                                            >
                                                ✕
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6 ">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange bg-clip-text text-transparent ">
                                    {t('features.title')}
                                </h3>
                                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: '✨', key: 'quality' },
                                    { icon: '🎨', key: 'design' },
                                    { icon: '⚡', key: 'fast' },
                                    { icon: '🛡️', key: 'secure' },
                                ].map((feature) => (
                                    <motion.div
                                        key={feature.key}
                                        whileHover={{ y: -6 }}
                                        className="relative group bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative space-y-3">
                                            <p className="text-4xl">{feature.icon}</p>
                                            <p className="font-bold text-white text-sm uppercase tracking-wide">{t(`features.${feature.key}`)}</p>
                                            <p className="text-xs text-gray-400 leading-relaxed font-light">{t(`features.${feature.key}Desc`)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-amber-500/10 via-orange/5 to-transparent border border-amber-500/30 rounded-2xl p-5 m-2 mb-12 mt-24 lg:mt-12 space-y-8 backdrop-blur-xl lg:relative fixed bottom-0 left-0 right-0 lg:rounded-2xl rounded-t-2xl "
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-light text-gray-200">{t('total.label')}</span>
                                <motion.span
                                    key={totalPrice}
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    className="text-5xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange bg-clip-text text-transparent"
                                >
                                    €{totalPrice}
                                </motion.span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 25px 50px rgba(251, 146, 60, 0.3)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddToCart}
                                disabled={selectedCards.length === 0}
                                className="w-full bg-gradient-to-r from-amber-400 via-orange to-amber-600 text-gray-900 font-extrabold py-5 rounded-xl shadow-xl hover:shadow-orange-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9" />
                                </svg>
                                {t('actions.addAll')}
                            </motion.button>

                            <p className="text-center text-sm text-gray-400 font-light">{t('shipping.note', { amount: 100 })}</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ChooseCard;