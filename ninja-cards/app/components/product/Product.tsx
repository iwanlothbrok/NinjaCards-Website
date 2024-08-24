import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import CustomCardDesigner from './CustomCardDesigner';

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
        <div className="min-h-screen mt-96">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Details */}
                <div>
                    <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
                    <h2 className="text-4xl font-bold text-gray-100 mt-4">{title}</h2>
                    <p className="mt-2 text-2xl font-semibold text-blue-600">{price}</p>
                    <p className="mt-4 text-gray-200">{description}</p>

                    <div className="mt-8 flex space-x-4">
                        <button
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
                            onClick={() => alert('Added to Cart!')}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
                            onClick={() => alert('Proceeding to Checkout!')}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Customization Section */}
                <div>
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-white">Design Your NFC Card</h3>

                        {/* Insert the CustomCardDesigner component here */}
                        <CustomCardDesigner />
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-200">Product Details</h3>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-200">Features</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200">
                                {features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-200">Benefits</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-200">
                                {benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-200">Customer Reviews</h4>
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-200 transition-colors duration-300"
                                onClick={() => setShowReviews(!showReviews)}
                            >
                                {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                            </button>
                            {showReviews && (
                                <div className="mt-4 space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                                            <p className="text-lg font-semibold text-gray-200">{review.name}</p>
                                            <p className="mt-1 text-yellow-500">
                                                {'★'.repeat(review.rating)}{' '}
                                                <span className="text-gray-200">{review.rating}/5</span>
                                            </p>
                                            <p className="mt-2 text-gray-200">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
