import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/Metal-Hybrid-Silver.png)' }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-90" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                {/* Animated Title */}
                <motion.h1
                    className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    ПРЕМИУМ <span className='text-orange'>ДИГИТАЛНА ВИЗИТКА</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Най-мощният инструмент за създаване на контакти.<span className='text-orange'> Подобрете бизнеса си</span> с нашите NFC продукти.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col md:flex-row gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <Link href="/contact">
                        <button className="bg-orange text-white  px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-orange to-yellow-600 transition-transform transform hover:scale-105 focus:outline-none">
                            ПОРЪЧАЙ СЕГА
                        </button>
                    </Link>
                    <Link href="#features">
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-white to-gray-200 hover:text-black transition-transform transform hover:scale-105 focus:outline-none">
                            НАУЧИ ПОВЕЧЕ
                        </button>
                    </Link>
                </motion.div>
            </div>
         

        </section >
    );
};

export default Hero;
