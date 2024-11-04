import React, { FormEvent, useState } from 'react';
import { FaCheckCircle, FaMobileAlt, FaBarcode, FaCreditCard, FaWrench, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import DropdownSection from './DropdownSection';
import BenefitItem from './BenefitItem';
import CustomCardDesigner from './CustomCardDesigner';
import Slider from 'react-slick';
import Link from 'next/link';
import { BASE_API_URL } from '@/utils/constants';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

    const handleBuyNow = () => {
        setIsModalOpen(true);
    };

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; phone?: string } = {};

        if (!name) newErrors.name = "Моля, въведете вашите имена";
        if (!email) {
            newErrors.email = "Моля, въведете имейл адрес";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Невалиден имейл адрес";
        }
        if (!phone) {
            newErrors.phone = "Моля, въведете телефонен номер";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Невалиден телефонен номер";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const formData = {
            name,
            email,
            phone,
            subject: "added from buy now",
        };

        try {
            const response = await fetch(`${BASE_API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setName("");
                setEmail("");
                setPhone("");
                alert("Формулярът е изпратен успешно!");
            } else {
                alert("Възникна грешка при изпращането на формуляра.");
            }
        } catch (error) {
            alert("Грешка при свързването със сървъра.");
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen pt-20  text-white">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10 ">
                    <div className="w-full">
                        <Slider {...settings}>
                            {imageUrls.map((url, index) => (
                                <div key={index} className="p-2">
                                    <div className="flex justify-center items-center">
                                        <img
                                            src={url}
                                            alt={`Product Image ${index + 1}`}
                                            className="w-full rounded-lg shadow-lg object-cover"
                                            style={{
                                                height: window.innerWidth < 640 ? '18rem' : '28rem', // 12rem for mobile, 24rem for larger screens
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>

                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-orange-400">{title}</h2>
                        <div className="flex items-center space-x-4">
                            {oldPrice > 0 && <p className="text-4xl text-red-500 line-through">{oldPrice} лв.</p>}
                            <p className="text-3xl font-semibold text-green-600">{price} лв.</p>
                        </div>
                    </div>

                    <Benefits />
                    {/* Buy Now Button */}
                    <div className="mt-8 lg:mt-0 lg:relative lg:w-full">
                        <button
                            onClick={handleBuyNow}
                            className="w-full z-50 px-6 py-5 bg-orange text-white text-xl font-bold rounded-lg shadow-md 
                    hover:shadow-lg hover:scale-105 transform transition-all duration-300 
                   lg:static fixed inset-x-0 bottom-0 mb-1 lg:w-full lg:px-6 lg:py-3 lg:rounded-lg lg:shadow-md
                    lg:hover:shadow-lg lg:hover:scale-105"
                        >
                            Купи
                        </button>
                    </div>

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

                {isModalOpen && (
                    <div className="fixed inset-0 p-4 z-50 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
                            <h2 className="text-2xl font-bold mb-4 text-center">Въведете вашите данни и ние ще се свържем с Вас</h2>
                            <form className='' onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Три Имена"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700"
                                        aria-invalid={!!errors.name}
                                        aria-describedby="nameError"
                                    />
                                    {errors.name && <p id="nameError" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="email"
                                        placeholder="Имейл"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700"
                                        aria-invalid={!!errors.email}
                                        aria-describedby="emailError"
                                    />
                                    {errors.email && <p id="emailError" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        placeholder="Телефонен номер"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700"
                                        aria-invalid={!!errors.phone}
                                        aria-describedby="phoneError"
                                    />
                                    {errors.phone && <p id="phoneError" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full px-4 py-2 bg-orange rounded-lg font-bold hover:opacity-70 transition duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? "Изпращане..." : "Изпрати"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full px-4 py-2 bg-red-500 rounded-lg font-bold hover:bg-red-600 transition duration-200"
                                    >
                                        Откажи
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
