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
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 text-center max-w-4xl">
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

            <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-orange/30 hover:border-orange/50 transition-all duration-300">
                {/* Input Section */}
                <div className="mb-8 sm:mb-12">
                    <label className="block text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4" htmlFor="cardsSold">
                        {t('label')}
                    </label>

                    {/* Mobile-First Input Controls */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <button
                                aria-label="Decrease"
                                className=" bg-amber-600 hover:bg-amber-500 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl hover:from-orange/90 hover:to-orange/90 focus:outline-none focus:ring-4 focus:ring-orange/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-xl font-bold"
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
                                className="w-28 sm:w-32 lg:w-40 px-4 py-3 sm:py-4 text-black border-2 border-orange rounded-xl sm:rounded-2xl shadow-lg focus:ring-4 focus:ring-orange/50 focus:border-orange text-xl sm:text-2xl lg:text-3xl text-center bg-white font-bold transition-all duration-300"
                                aria-describedby="cardsSoldHelp"
                            />
                            <button
                                aria-label="Increase"
                                className=" bg-amber-600 hover:bg-amber-500 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl hover:from-orange/90 hover:to-orange/90 focus:outline-none focus:ring-4 focus:ring-orange/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-xl font-bold"
                                onClick={() => handleInput(cardsSold + 1)}
                                disabled={cardsSold >= MAX_CARDS}
                            >
                                +
                            </button>
                        </div>

                        {/* Full-width Slider */}
                        <div className="w-full px-2">
                            <input
                                type="range"
                                min={MIN_CARDS}
                                max={MAX_CARDS}
                                value={cardsSold}
                                onChange={(e) => handleInput(Number(e.target.value))}
                                className="w-full h-3 bg-gradient-to-r from-orange/30 to-orange/50 rounded-full cursor-pointer accent-orange appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                                aria-label="Cards Sold Range"
                            />
                        </div>
                    </div>

                    <div id="cardsSoldHelp" className="text-xs sm:text-sm text-gray-300 mt-3 text-center">
                        {t('help', { min: MIN_CARDS, max: MAX_CARDS })}
                    </div>
                    {inputError && <div className="text-xs sm:text-sm text-orange mt-2 text-center font-semibold">{inputError}</div>}
                </div>

                {/* Impact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-orange/20 via-orange/10 to-transparent rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-orange/40 hover:border-orange hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                    >
                        <p className="text-orange font-semibold mb-2 sm:mb-3 text-sm sm:text-base uppercase tracking-wide">{t('money')}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{formatCurrency(moneySaved)}</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-green-500/40 hover:border-green-500 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                    >
                        <p className="text-green-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base uppercase tracking-wide">{t('trees')}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{treesSaved}</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-blue-500/40 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm sm:col-span-2 lg:col-span-1"
                    >
                        <p className="text-blue-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base uppercase tracking-wide">{t('co2')}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{co2Saved} <span className="text-xl sm:text-2xl">kg</span></p>
                    </motion.div>
                </div>

                {/* Impact Stats Footer */}
                <footer className="mt-8 sm:mt-12 text-center text-orange/80 text-xs sm:text-sm lg:text-base font-medium">{t('footer')}</footer>

                {/* Reset Button */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                    <button
                        className="bg-gradient-to-r from-orange to-amber-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-2xl hover:from-orange/90 hover:to-orange/90 focus:outline-none focus:ring-4 focus:ring-orange/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105"
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
