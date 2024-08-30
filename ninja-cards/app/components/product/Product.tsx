import React, { useState } from 'react';
import CustomCardDesigner from './CustomCardDesigner';
import {
    FaCheckCircle,
    FaMobileAlt,
    FaLeaf,
    FaShippingFast,
    FaBarcode,
    FaCreditCard,
    FaTree,
    FaWrench
} from 'react-icons/fa';

type Review = {
    name: string;
    rating: number;
    comment: string;
};

type ProductProps = {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    features: string[];
    benefits: string[];
    nfcType: string;
    reviews: Review[];
};

const Product: React.FC<ProductProps> = ({
    title,
    description,
    price,
    imageUrl,
    features,
    benefits,
    nfcType,
    reviews,
}) => {
    const [showReviews, setShowReviews] = useState(false);

    return (
        <div className="min-h-screen pt-20 bg-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Details */}
                <div className="space-y-8">
                    <div className="relative">
                        <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                        <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-lg">
                            New
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold">{title}</h2>
                        <p className="mt-2 text-3xl font-semibold text-green-500">{price}</p>
                        <p className="mt-4 text-gray-300 leading-relaxed">{description}</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                            onClick={() => alert('Added to Cart!')}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                            onClick={() => alert('Proceeding to Checkout!')}
                        >
                            Buy Now
                        </button>
                    </div>
                    <div className="space-y-8">

                        <div>
                            <div>
                                <h3 className="text-xl font-semibold">Product Benefits</h3>
                                <ul className="mt-4 space-y-4">
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>In stock, ready to ship</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaBarcode className="text-green-500" />
                                        <span>Powered by NFC & QR code</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaWrench className="text-green-500" />
                                        <span>Setup on delivery</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaCreditCard className="text-green-500" />
                                        <span>Card Size: 85.6 mm x 53.98 mm</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaMobileAlt className="text-green-500" />
                                        <span>iOS & Android compatible</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>Made of high-grade PVC</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaShippingFast className="text-green-500" />
                                        <span>Free Tracked Shipping</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-lg">
                                        <FaLeaf className="text-green-500" />
                                        <span>Tree planted for every card sold</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Customization Section */}

                <CustomCardDesigner />

            </div>
        </div>
    );
};

export default Product;
