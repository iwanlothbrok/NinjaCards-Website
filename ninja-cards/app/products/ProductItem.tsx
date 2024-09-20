"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProductItemProps {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    type: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, imageUrl, name, price, type }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 50, scale: 0.95 },
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            {/* Image Section */}
            <div className="w-full h-64 bg-gray-400 rounded-t-lg overflow-hidden">
                <Link href={`/products/${type}/${id}`}>
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-center object-cover transition-transform duration-500 transform group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-orange-400">
                    {name}
                </h2>
                <p className="text-lg font-semibold text-gray-300 mt-2">${price.toFixed(2)}</p>

                {/* Call to Action */}
                <Link href={`/products/${type}/${id}`}>
                    <span className="mt-5 inline-block px-6 py-3 bg-orange text-white font-medium rounded-lg shadow-md hover:bg-orange hover:shadow-lg transition-transform transform hover:scale-110">
                        Научи Повече
                    </span>
                </Link>
            </div>
        </motion.div>
    );
};

export default ProductItem;
