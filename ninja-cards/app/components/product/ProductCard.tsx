import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ProductCardProps {
    id: string;
    imageUrl: string;
    name: string;
    description: string;
    type: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, imageUrl, name, description, type }) => {
    const controls = useAnimation();
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        controls.start('visible');
                    } else {
                        controls.start('hidden');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [controls]);

    return (
        <motion.div
            ref={cardRef}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 50, scale: 0.95 },
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            <div className="w-full h-64 bg-gray-300 rounded-t-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-center object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
            </div>
            <div className="p-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-orange">
                    {name}
                </h2>
                {description && (
                    <p className="text-md font-semibold text-white transition-colors duration-300 group-hover:text-orange">
                        {description}
                    </p>
                )}
                <a
                    href={`/products/${type}`}
                    className="mt-4 px-5 py-2 bg-orange text-white rounded-lg shadow hover:bg-opacity-50 transition-transform transform hover:scale-125"
                >
                    НАУЧИ ПОВЕЧЕ
                </a>
            </div>
            <a
                href={`/products/${type}`}
                className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 "
                style={{ cursor: 'pointer' }}
            >
                <span className="sr-only">ВИЖ {name}</span>
            </a>
        </motion.div>
    );
};

export const ProductGallery: React.FC = () => {
    return (
        <div className="bg-gradient-to-b z-0 from-black to-gray-950 py-16 p-1">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -30 },
                }}
                transition={{ duration: 1 }}
                className="text-center mb-16"
            >
                <motion.div
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -40 },
                    }}
                    transition={{ duration: 1.5 }}
                    className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-full bg-[#202c47] bg-opacity-60 hover:bg-opacity-50"
                >
                    Продукти
                </motion.div>
                <motion.h1
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -50 },
                    }}
                    transition={{ duration: 2 }}
                    className="text-3xl font-bold text-white sm:text-4xl"
                >
                    Открийте нашата гама от NFC продукти
                </motion.h1>
                <motion.p
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                    }}
                    transition={{ duration: 0.8 }}
                    className="text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto"
                >
                    Предлагаме разнообразие от NFC продукти, съобразени с вашите специфични нужди. Разгледайте нашата колекция и намерете идеалното решение за вашия бизнес.
                </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-16">
                <ProductCard
                    key={1}
                    id="nfcCards"
                    imageUrl="/cards/wa-1.png"
                    name="Смарт Визитки"
                    description="Персонализирани NFC визитки за модерен контакт."
                    type='cards'
                />

                <ProductCard
                    key={2}
                    id="googleReviews"
                    imageUrl="/cards/gr-1.png"
                    name="Ревюта"
                    description="Удобен начин за събиране на Google, Tripadvisor и други отзиви."
                    type='reviews'
                />


                <ProductCard
                    key={3}
                    id="stickers"
                    imageUrl="/cards/stickers.png"
                    name="Стикери"
                    description="Удобен начин за събиране на Google отзиви."
                    type='all'
                />
            </div>
        </div>
    );
};

export default ProductGallery;
