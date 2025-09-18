'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const DEFAULT_CARDS = 50;
const MIN_CARDS = 1;
const MAX_CARDS = 5000;

const formatCurrency = (num: number) =>
    num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const formatNumber = (num: number) =>
    num.toLocaleString(undefined, { maximumFractionDigits: 0 });

const NinjaCardImpact = () => {
    const t = useTranslations('Impact');

    const [cardsSold, setCardsSold] = useState(DEFAULT_CARDS);
    const [inputError, setInputError] = useState('');

    const handleInput = (val: number) => {
        if (val < MIN_CARDS || val > MAX_CARDS) {
            setInputError(t('inputError', { min: MIN_CARDS, max: MAX_CARDS }));
        } else {
            setInputError('');
            setCardsSold(val);
        }
    };

    const moneySaved = cardsSold * 40;
    const treesSaved = (cardsSold * 0.14).toFixed(0);
    const co2Saved = (cardsSold * 4).toFixed(0);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white py-16">
            <div className="mb-8 space-y-4 text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                    }}
                    transition={{ duration: 0.6 }}
                    className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40"
                >
                    {t('badge')}
                </motion.div>

                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                    }}
                    transition={{ duration: 0.7 }}
                    className="text-2xl font-semibold text-white sm:text-3xl"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                    }}
                    transition={{ duration: 0.8 }}
                    className="text-md text-gray-100 sm:text-lg"
                >
                    {t('subtitle')}
                </motion.p>
            </div>

            <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-orange">
                {/* Input Section */}
                <div className="mb-10">
                    <label className="block text-white font-semibold mb-2" htmlFor="cardsSold">
                        {t('label')}
                    </label>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            aria-label="Decrease"
                            className="bg-orange text-white px-3 py-2 rounded-l-lg hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-orange transition disabled:opacity-50"
                            onClick={() => handleInput(cardsSold - 1)}
                            disabled={cardsSold <= MIN_CARDS}
                        >
                            -
                        </button>
                        <input
                            id="cardsSold"
                            type="number"
                            min={MIN_CARDS}
                            max={MAX_CARDS}
                            value={cardsSold}
                            onChange={(e) => handleInput(Number(e.target.value))}
                            className="w-24 px-3 py-2 text-black border border-orange rounded-none shadow-sm focus:ring-2 focus:ring-orange focus:border-orange text-lg text-center bg-white"
                            aria-describedby="cardsSoldHelp"
                        />
                        <button
                            aria-label="Increase"
                            className="bg-orange text-white px-3 py-2 rounded-r-lg hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-orange transition disabled:opacity-50"
                            onClick={() => handleInput(cardsSold + 1)}
                            disabled={cardsSold >= MAX_CARDS}
                        >
                            +
                        </button>
                        <input
                            type="range"
                            min={MIN_CARDS}
                            max={MAX_CARDS}
                            value={cardsSold}
                            onChange={(e) => handleInput(Number(e.target.value))}
                            className="flex-1 h-2 bg-orange rounded-lg cursor-pointer accent-orange ml-4"
                            aria-label="Cards Sold Range"
                        />
                    </div>
                    <div id="cardsSoldHelp" className="text-xs text-white mt-1">
                        {t('help', { min: MIN_CARDS, max: MAX_CARDS })}
                    </div>
                    {inputError && <div className="text-xs text-orange mt-1">{inputError}</div>}
                </div>

                {/* Impact Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-orange/20 rounded-xl p-6 shadow-lg border border-orange hover:shadow-xl transition">
                        <p className="text-orange font-semibold mb-1">{t('money')}</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(moneySaved)}</p>
                    </div>
                    <div className="bg-orange/20 rounded-xl p-6 shadow-lg border border-orange hover:shadow-xl transition">
                        <p className="text-orange font-semibold mb-1">{t('trees')}</p>
                        <p className="text-2xl font-bold text-white">{treesSaved}</p>
                    </div>
                    <div className="bg-orange/20 rounded-xl p-6 shadow-lg border border-orange hover:shadow-xl transition">
                        <p className="text-orange font-semibold mb-1">{t('co2')}</p>
                        <p className="text-2xl font-bold text-white">{co2Saved} kg</p>
                    </div>
                </div>

                {/* Impact Stats Footer */}
                <footer className="mt-10 text-center text-orange text-sm">{t('footer')}</footer>

                {/* Reset Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        className="bg-orange text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-orange transition disabled:opacity-60"
                        onClick={() => handleInput(DEFAULT_CARDS)}
                        disabled={cardsSold === DEFAULT_CARDS}
                    >
                        {t('reset')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NinjaCardImpact;
