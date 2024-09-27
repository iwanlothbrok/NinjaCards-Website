import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsImageLoaded(true);
                        observer.unobserve(entry.target); // Stop observing once the image is loaded
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the component is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-cover bg-center"
            style={{
                backgroundImage: isImageLoaded ? 'url(/Metal-Hybrid-Silver.png)' : 'none',
                transition: 'background-image 0.5s ease-in-out',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-80" />

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
                        <button className="bg-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-orange to-yellow-600 transition-transform transform hover:scale-105 focus:outline-none">
                            ПОРЪЧАЙ СЕГА
                        </button>
                    </Link>
                    <Link href="/features">
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-white to-gray-200 hover:text-black transition-transform transform hover:scale-105 focus:outline-none">
                            НАУЧИ ПОВЕЧЕ
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;