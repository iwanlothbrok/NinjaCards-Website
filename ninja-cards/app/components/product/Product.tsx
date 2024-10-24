import React, { useState } from 'react';
import { FaCheckCircle, FaMobileAlt, FaLeaf, FaShippingFast, FaBarcode, FaCreditCard, FaWrench, FaShieldAlt, FaTruck, FaGlobe } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomCardDesigner from './CustomCardDesigner';
import Slider from 'react-slick';
import Link from 'next/link';

type ProductProps = {
    title: string;
    price: string;
    imageUrls: string[];
    back: string;
    oldPrice: number;
    front: string;
    qrColor: string;

};

const Product: React.FC<ProductProps> = ({
    title,
    price,
    oldPrice,
    imageUrls,
    back,
    front,
    qrColor
}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    // State for dropdown sections
    const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false);
    const [isShippingOpen, setIsShippingOpen] = useState<boolean>(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false);

    return (
        <div className="min-h-screen pt-20  text-white">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Product Details */}
                <div className="space-y-8">
                    {/* Image Carousel */}
                    <Slider {...settings}>
                        {imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className="relative flex justify-center items-center overflow-hidden"
                                style={{ height: '400px' }} // Set a fixed height for consistency
                            >
                                <img
                                    src={url}
                                    alt={`Product Image ${index + 1}`}
                                    className="h-full rounded-lg shadow-lg object-cover"
                                    style={{
                                        width: index === 0 ? 'auto' : '100%', // Adjust width of the first image to make it stand out
                                        transform: index === 0 ? 'scale(1.4)' : 'scale(1)', // Scale the first image to zoom slightly
                                        transition: 'transform 0.5s ease-in-out', // Smooth transition for zoom effect
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>


                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-orange-400">{title}</h2>

                        <div className="flex items-center space-x-4">
                            {/* Old price with strikethrough */}
                            {oldPrice > 0 && (
                                <p className="text-4xl  text-red-500 line-through">{oldPrice} лв.</p>
                            )}

                            {/* Current price */}
                            <p className="text-3xl font-semibold text-green-600">{price} лв.</p>


                        </div>
                    </div>
                    {/* Benefits Section */}
                    {Benefits()}

                    {/* Dropdown Information Sections */}
                    <div className="mt-8 space-y-4">
                        <div>
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="w-full text-left font-bold text-lg py-4 border-t border-b border-gray-600 flex justify-between items-center text-orange-400"
                            >
                                Описание
                                <span>{isDescriptionOpen ? '−' : '+'}</span>
                            </button>
                            {isDescriptionOpen && (
                                <div className="text-gray-300 mt-2 px-2">
                                    <p>
                                        Тази лимитирана серия визитни картички с поддръжка на NFC предлага елегантно и модерно решение за традиционните мрежи. Просто докоснете картата си до всеки NFC-съвместим смартфон или позволете на другите да сканират вградения QR код, за да прехвърлите незабавно данни за контакт, уебсайтове или профили в социалните мрежи.Изработена от първокласно PVC, картата е проектирана за издръжливост и дълготрайна употреба.

                                        Ninja Cards предлага широки възможности за персонализиране, което ви позволява да създадете карта, която перфектно представя вашата марка. Независимо дали сте фрийлансър, предприемач или корпоративен професионалист, тази интелигентна визитна картичка променя правилата на играта за ефективно установяване на контакти.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={() => setIsShippingOpen(!isShippingOpen)}
                                className="w-full text-left font-bold text-lg py-4 border-t border-b border-gray-600 flex justify-between items-center text-orange-400"
                            >
                                Информация за доставката
                                <span>{isShippingOpen ? '−' : '+'}</span>
                            </button>
                            {isShippingOpen && (
                                <div className="text-gray-300 mt-2 px-2">
                                    <p>
                                        Безплатна доставка в цяла България. Вашата карта ще бъде изработена в рамките на 1 до 3 работни дни.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                className="w-full text-left font-bold text-lg py-4 border-t border-b border-gray-600 flex justify-between items-center text-orange-400"
                            >
                                Как да добавя данните си?                                <span>{isDetailsOpen ? '−' : '+'}</span>
                            </button>
                            {isDetailsOpen && (
                                <div className="text-gray-300 mt-2 px-2">
                                    Можете лесно да конфигурирате картата си с предоставените инструкции в този клип -{' '}
                                    <Link className='text-orange' href="https://www.facebook.com">
                                        ТУК
                                    </Link>

                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={() => setIsQuestionOpen(!isQuestionOpen)}
                                className="w-full text-left font-bold text-lg py-4 border-t border-b border-gray-600 flex justify-between items-center text-orange-400"
                            >
                                Имате въпрос?
                                <span>{isQuestionOpen ? '−' : '+'}</span>
                            </button>
                            {isQuestionOpen && (
                                <div className="text-gray-300 mt-2 px-2">
                                    <p>
                                        Имате въпрос? Обърнете се към нашия екип за поддръжка и ние ще ви отговорим в рамките на 24 часа. Изпратете вашето запитване - {' '}
                                        <Link className='text-orange' href="/contact">
                                            ТУК
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Customization Section */}
                <div className="p-6 rounded-lg shadow-lg bg-gray-800">
                    <CustomCardDesigner back={back} front={front} color={qrColor} />
                </div>
            </div>
        </div >
    );
};

export default Product

function Benefits() {
    return <div className="mt-8">
        <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaCheckCircle />
                </span>
                <span>От 1-3 дни за изработка</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaBarcode />
                </span>
                <span>Използва се NFC и QR код</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaShieldAlt />
                </span>
                <span>Няма абонамент - само едно плащане на картата</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaWrench />
                </span>
                <span>Настройка на профила преди доставката</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaCreditCard />
                </span>
                <span>Размер на картата: 85,6 мм x 53,98 мм</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaMobileAlt />
                </span>
                <span>Съвместима с iOS и Android</span>
            </li>

            <li className="flex items-center space-x-3 text-lg">
                <span className="text-green-500">
                    <FaGlobe />
                </span>
                <span>Безплатна доставка</span>
            </li>
        </ul>
    </div>;
}
