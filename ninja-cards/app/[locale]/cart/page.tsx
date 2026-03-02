'use client';
import React, { useState, useEffect } from 'react';
import { removeFromCart, loadCartFromLocalStorage } from '@/lib/cart';
import type { Cart, CartItem } from '@/lib/cart';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { loadStripe } from "@stripe/stripe-js";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

const Cart = () => {
    const t = useTranslations("CartPage");
    const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0, freeItemsCount: 0 });
    const { user } = useAuth();

    useEffect(() => {
        const savedCart = loadCartFromLocalStorage();
        setCart(savedCart);
    }, []);

    const handleRemoveFromCart = (index: number) => {
        const updatedCart = removeFromCart(cart, index);
        setCart(updatedCart);
    };

    const hasPlan = cart.items.some(item => (item as CartItem).type === 'subscription');
    const hasDesign = cart.items.some(item => (item as CartItem).type === 'design');

    async function handlePaymentClick() {
        const items = cart.items
            .filter((i) => !!i.priceId)
            .map((i) => ({
                type: i.type,
                priceId: i.priceId!,
                quantity: i.quantity ?? 1,
            }));

        const payload: any = { items };
        if (user?.id) payload.userId = user.id;
        if (user?.email) payload.email = user.email;

        try {
            const { data } = await axios.post(`${BASE_API_URL}/api/payments/create-checkout-session`, payload);
            const stripe = await stripePromise;

            if (stripe && data?.id) {
                const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
                if (error && data?.url) window.location.assign(data.url);
            } else if (data?.url) {
                window.location.assign(data.url);
            } else {
                throw new Error("Missing checkout redirect");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            alert(t("errors.checkoutFailed"));
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center py-12 px-4 pt-28">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-200 via-orange to-amber-400 bg-clip-text text-transparent mb-3 tracking-tight">
                        {t("header.title")}
                    </h1>
                    <p className="text-lg text-slate-400">{t("header.subtitle")}</p>
                </div>

                {/* Main Cart Container */}
                <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-700/50">
                    {(!cart.items || cart.items.length === 0) ? (
                        // Empty Cart State
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-6xl mb-6 opacity-50">{t("empty.icon")}</div>
                            <h3 className="text-2xl font-bold text-slate-200 mb-2">{t("empty.title")}</h3>
                            <p className="text-slate-400 mb-8">{t("empty.subtitle")}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <button
                                    className="py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-400 to-orange hover:shadow-lg hover:shadow-amber-500/40 text-slate-900 border-2 border-amber-300/50 transition-all duration-300 hover:scale-105"
                                    onClick={() => window.location.href = '/plans'}
                                >
                                    {t("empty.primaryCta")}
                                </button>
                                <button
                                    className="py-4 rounded-xl font-bold text-lg bg-slate-700 hover:bg-slate-600 text-slate-100 border-2 border-slate-600/50 transition-all duration-300"
                                    onClick={() => window.location.href = '/'}
                                >
                                    {t("empty.secondaryCta")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Order Items */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-100 mb-6">{t("summary.title")}</h2>
                                {cart.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-2xl px-6 py-5 border border-slate-700/80 hover:border-amber-500/30 transition-colors duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 w-full">
                                            <img
                                                src={item.photoUrl}
                                                alt={item.name}
                                                className="w-32 h-24 object-cover rounded-lg border border-amber-500/30 shadow-lg flex-shrink-0"
                                            />
                                            <div className="space-y-2 flex-1">
                                                <p className="font-bold text-xl bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                                                    {item.name}
                                                    {item.subscriptionType && (
                                                        <span className="px-3 ml-2 py-1 text-sm bg-amber-500/20 rounded-full text-amber-300 border border-amber-500/30">
                                                            {t(`summary.subscriptionType.${item.subscriptionType}`)}
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                                    <span>{t("summary.qty")}: <span className="font-semibold text-amber-300">{item.quantity}</span></span>
                                                    <span>{t("summary.price")}: <span className="font-semibold text-amber-300">
                                                        {item.isFree ? (item.type === 'subscription' ? t("summary.free30Days") : t("summary.freeLabel")) : `€${item.price.toFixed(2)}`}
                                                    </span></span>

                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(index)}
                                            className="w-full md:w-auto px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-all duration-300"
                                        >
                                            {t("summary.remove")}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Upsell Plans Section */}
                            {!hasPlan && (
                                <div className="border-t border-slate-700/50 pt-8">
                                    <h3 className="text-lg font-bold text-slate-100 mb-2">{t("upsellPlans.title")}</h3>
                                    <p className="text-slate-400 text-sm mb-5">{t("upsellPlans.subtitle")}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="bg-gradient-to-br from-amber-500/10 via-orange/5 to-amber-600/10 rounded-2xl p-6 border-2 border-amber-500/30 hover:border-amber-400/60 transition-colors duration-300">
                                            <h4 className="text-lg font-bold text-amber-100 mb-2">{t("upsellPlans.shinobi.title")}</h4>
                                            <p className="text-slate-300 text-sm mb-4">{t("upsellPlans.shinobi.description")}</p>
                                            <ul className="text-xs text-slate-300 space-y-2 mb-5">
                                                {t.raw("upsellPlans.shinobi.bullets").map((bullet: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2"><span className="text-amber-400">✓</span> {bullet}</li>
                                                ))}
                                            </ul>
                                            <button
                                                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange hover:shadow-2xl hover:shadow-amber-500/50 text-slate-900 border-2 border-amber-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                                                onClick={() => window.location.href = '/plans'}
                                            >
                                                {t("upsellPlans.shinobi.cta")}
                                            </button>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange/10 via-amber-500/5 to-orange/10 rounded-2xl p-6 border-2 border-orange/30 hover:border-orange-400/60 transition-colors duration-300 relative">
                                            <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-orange text-slate-900 px-4 py-1 rounded-full text-xs font-bold">{t("upsellPlans.samurai.badge")}</div>
                                            <h4 className="text-lg font-bold text-orange mb-2">{t("upsellPlans.samurai.title")}</h4>
                                            <p className="text-slate-300 text-sm mb-4">{t("upsellPlans.samurai.description")}</p>
                                            <ul className="text-xs text-slate-300 space-y-2 mb-5">
                                                {t.raw("upsellPlans.samurai.bullets").map((bullet: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2"><span className="text-orange">✓</span> {bullet}</li>
                                                ))}
                                            </ul>
                                            <button
                                                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-orange to-amber-400 hover:shadow-2xl hover:shadow-orange/50 text-slate-900 border-2 border-orange/50 transition-all duration-300 hover:scale-105 active:scale-95"
                                                onClick={() => window.location.href = '/plans'}
                                            >
                                                {t("upsellPlans.samurai.cta")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!hasDesign && (
                                <div className="border-t border-slate-700/50 pt-8">
                                    <button
                                        onClick={() => window.location.href = '/cards'}
                                        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-400 via-orange to-amber-500 hover:shadow-2xl hover:shadow-amber-500/50 text-slate-900 border-2 border-amber-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        {t("upsellDesigns.cta")}
                                    </button>
                                </div>
                            )}

                            {/* Order Totals */}
                            <div className="border-t border-slate-700/50 pt-8 bg-gradient-to-r from-slate-800/30 to-slate-700/20 rounded-xl p-6">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>{t("totals.subtotal")}:</span>
                                        <span className="font-semibold">€{cart.totalPrice === undefined ? 0 : cart.totalPrice.toFixed(2)}</span>
                                    </div>
                                    {cart.freeItemsCount > 0 && (
                                        <div className="flex justify-between items-center text-orange">
                                            <span>{t("totals.complimentaryItems")}:</span>
                                            <span className="font-semibold">{cart.freeItemsCount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-lg font-bold border-t border-slate-600/50 pt-3">
                                        <span className="text-slate-100">{t("totals.total")}:</span>
                                        <span className="bg-gradient-to-r from-amber-300 to-orange bg-clip-text text-transparent text-2xl">
                                            €{cart.totalPrice === undefined ? 0 : cart.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handlePaymentClick}
                                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-400 via-orange to-amber-500 hover:shadow-2xl hover:shadow-amber-500/50 text-slate-900 border-2 border-amber-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    {t("checkout.button")}
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    {t("checkout.note")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex justify-center gap-8 flex-wrap text-slate-400 text-sm">
                    {t.raw("trust.items").map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">{item}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Cart;
