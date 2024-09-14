import React, { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomCardDesigner from './CustomCardDesigner';
import { FaCheckCircle, FaMobileAlt, FaLeaf, FaShippingFast, FaBarcode, FaCreditCard, FaWrench } from 'react-icons/fa';
import Slider from 'react-slick';  // Carousel package

type ProductProps = {
    title: string;
    description: string;
    price: string;
    imageUrls: string[];
};

const Product: React.FC<ProductProps> = ({
    title,
    description,
    price,
    imageUrls,
}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="min-h-screen pt-20  text-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Details */}
                <div className="space-y-8">
                    {/* Image Carousel */}
                    <Slider {...settings}>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-lg">
                                    Ново
                                </div>
                                <img src={url} alt={`Product Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                            </div>
                        ))}
                    </Slider>

                    {/* Product Info */}
                    <div>
                        <h2 className="text-4xl font-bold">{title}</h2>
                        <p className="mt-2 text-3xl font-semibold text-green-500">{price}</p>
                        <p className="mt-4 text-gray-300 leading-relaxed">{description}</p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold">Product Benefits</h3>
                            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaCheckCircle className="text-green-500 text-3xl" />
                                    <span>На склад, готов за изпращане</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaBarcode className="text-green-500 text-3xl" />
                                    <span>Използва се NFC и QR код</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaWrench className="text-green-500 text-3xl" />
                                    <span>Настройка преди доставката</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaCreditCard className="text-green-500 text-3xl" />
                                    <span>Размер на картата: 85,6 мм x 53,98 мм</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaMobileAlt className="text-green-500 text-3xl" />
                                    <span>Съвместима с iOS и Android</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaCheckCircle className="text-green-500 text-3xl" />
                                    <span>Изработена от висококачествено PVC</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaShippingFast className="text-green-500 text-3xl" />
                                    <span>Безплатна доставка</span>
                                </li>
                                <li className="flex items-center space-x-3 text-lg">
                                    <FaLeaf className="text-green-500 text-3xl" />
                                    <span>Засадено дърво за всяка продадена карта</span>
                                </li>
                            </ul>

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
