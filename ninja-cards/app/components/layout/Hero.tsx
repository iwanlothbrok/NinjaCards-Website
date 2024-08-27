import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/nfc-card.webp)' }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                {/* Animated Title */}
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Welcome to Smart NFC Cards
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-2xl mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Innovative solutions for modern needs
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <Link href="/contact">
                        <button className="bg-orange text-white px-6 py-3 rounded-full text-lg hover:bg-orange transition-transform transform hover:scale-105">
                            Get Yours Now
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none fill-orange">
                <svg className="absolute bottom-0 left-0 w-full h-auto fill-orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#0099ff" className='fill-orange' d="M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,160C672,128,768,128,864,160C960,192,1056,256,1152,256C1248,256,1344,192,1392,160L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        <animate
                            attributeName="d"
                            dur="10s"
                            repeatCount="indefinite"
                            values="
        M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,160C672,128,768,128,864,160C960,192,1056,256,1152,256C1248,256,1344,192,1392,160L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
        M0,160L48,192C96,224,192,288,288,288C384,288,480,224,576,192C672,160,768,160,864,192C960,224,1056,288,1152,288C1248,288,1344,224,1392,192L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
        M0,192L48,224C96,256,192,320,288,320C384,320,480,256,576,224C672,192,768,192,864,224C960,256,1056,320,1152,320C1248,320,1344,256,1392,224L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
        M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,160C672,128,768,128,864,160C960,192,1056,256,1152,256C1248,256,1344,192,1392,160L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
      " />
                    </path>
                </svg>




            </div>
        </section >
    );
};

export default Hero;
