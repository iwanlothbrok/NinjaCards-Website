import React, { useState } from 'react';
import { FaCheckCircle, FaMobileAlt, FaBarcode, FaCreditCard, FaWrench, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import DropdownSection from './DropdownSection';
import BenefitItem from './BenefitItem';
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
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isShippingOpen, setIsShippingOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isQuestionOpen, setIsQuestionOpen] = useState(false);

    return (
        <div className="min-h-screen pt-20 text-white">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10 ">
                    <Slider {...settings}>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex justify-center items-center overflow-hidden p-4">
                                <img src={url} alt={`Product Image ${index + 1}`} className="h-96 rounded-lg shadow-lg object-cover" />
                            </div>
                        ))}
                    </Slider>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-orange-400">{title}</h2>
                        <div className="flex items-center space-x-4">
                            {oldPrice && <p className="text-4xl text-red-500 line-through">{oldPrice} лв.</p>}
                            <p className="text-3xl font-semibold text-green-600">{price} лв.</p>
                        </div>
                    </div>

                    <Benefits />

                    <DropdownSection title="Описание" isOpen={isDescriptionOpen} setIsOpen={setIsDescriptionOpen}>
                        <p>  Тази лимитирана серия визитни картички с поддръжка на NFC предлага елегантно и модерно решение за традиционните мрежи. Просто докоснете картата си до всеки NFC-съвместим смартфон или позволете на другите да сканират вградения QR код, за да прехвърлите незабавно данни за контакт, уебсайтове или профили в социалните мрежи.Изработена от първокласно PVC, картата е проектирана за издръжливост и дълготрайна употреба.
                            Ninja Cards предлага широки възможности за персонализиране, което ви позволява да създадете карта, която перфектно представя вашата марка. Независимо дали сте фрийлансър, предприемач или корпоративен професионалист, тази интелигентна визитна картичка променя правилата на играта за ефективно установяване на контакти.</p>
                    </DropdownSection>

                    <DropdownSection title="Информация за доставката" isOpen={isShippingOpen} setIsOpen={setIsShippingOpen}>
                        <p>Безплатна доставка в цяла България. Вашата карта ще бъде изработена в рамките на 3 до 5 работни дни.</p>
                    </DropdownSection>

                    <DropdownSection title="Как да добавя данните си?" isOpen={isDetailsOpen} setIsOpen={setIsDetailsOpen}>
                        <p>Можете лесно да конфигурирате картата си с предоставените инструкции в този клип -{' '}
                            <Link className='text-orange' href="https://www.youtube.com/watch?v=vlpRHfQ-W3E&t=2s">ТУК</Link>
                        </p>
                    </DropdownSection>

                    <DropdownSection title="Имате въпрос?" isOpen={isQuestionOpen} setIsOpen={setIsQuestionOpen}>
                        <p>Имате въпрос? Обърнете се към нашия екип за поддръжка и ние ще ви отговорим в рамките на 24 часа.{' '}
                            <Link className='text-orange' href="/contact">ТУК</Link>
                        </p>
                    </DropdownSection>
                </div>

                <div className="p-6 rounded-lg shadow-lg bg-gray-800">
                    <CustomCardDesigner back={back} front={front} color={qrColor} />
                </div>
            </div>
        </div>
    );
};

export default Product;

function Benefits() {
    return (
        <div className="mt-8">
            <ul className="space-y-4">
                <BenefitItem icon={<FaCheckCircle />} text="От 1-3 дни за изработка" />
                <BenefitItem icon={<FaBarcode />} text="Използва се NFC и QR код" />
                <BenefitItem icon={<FaShieldAlt />} text="Няма абонамент - само едно плащане на картата" />
                <BenefitItem icon={<FaWrench />} text="Настройка на профила преди доставката" />
                <BenefitItem icon={<FaCreditCard />} text="Размер на картата: 85,6 мм x 53,98 мм" />
                <BenefitItem icon={<FaMobileAlt />} text="Съвместима с iOS и Android" />
                <BenefitItem icon={<FaGlobe />} text="Безплатна доставка" />
            </ul>
        </div>
    );
}
