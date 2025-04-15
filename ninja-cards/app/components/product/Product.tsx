// File: /components/Product.tsx

'use client'

import React, { FormEvent, useState } from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import DropdownSection from './DropdownSection'
import BenefitItem from './BenefitItem'
import CustomCardDesigner from './CustomCardDesigner'
import { BASE_API_URL } from '@/utils/constants'
import {
    FaCheckCircle, FaMobileAlt, FaBarcode,
    FaCreditCard, FaWrench, FaShieldAlt, FaGlobe
} from 'react-icons/fa'

type ProductProps = {
    title: string
    price: string
    imageUrls: string[]
    back: string
    oldPrice: number
    front: string
    qrColor: string
}

const Product: React.FC<ProductProps> = ({
    title,
    price,
    oldPrice,
    imageUrls,
    back,
    front,
    qrColor,
}) => {
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [isShippingOpen, setIsShippingOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isQuestionOpen, setIsQuestionOpen] = useState(false)

    const handleCustomize = () => setIsCustomizeOpen(true)

    return (
        <div className="min-md-screen pt-20 text-white bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-screen-2xl mx-auto py-16 px-6 lg:px-20">
                <div className="w-full max-w-5xl mx-auto">
                    <div className="relative">
                        <Slider
                            dots
                            infinite
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            autoplay
                            autoplaySpeed={3000}
                            arrows={false}
                            className="rounded-xl overflow-hidden shadow-2xl"
                        >
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={url}
                                        alt={`Product Image ${index + 1}`}
                                        className="w-full object-cover mx-auto"
                                        style={{
                                            maxHeight: window.innerWidth >= 768 ? '532px' : '300px',
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <p className="text-white text-lg font-semibold">
                                            {`Пример: ${index + 1}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        <div className="absolute top-0 left-0 bg-orange text-white px-4 py-2 rounded-br-lg shadow-lg">
                            Най-продаван продукт!
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white mt-8 text-center">{title}</h1>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        {oldPrice > 0 && <p className="text-3xl text-red-500 line-through">{oldPrice} лв.</p>}
                        <p className="text-5xl font-bold text-green-500">{price} лв.</p>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleCustomize}
                            className="px-10 py-4 text-2xl rounded-full font-bold shadow-lg bg-gradient-to-r from-orange to-yellow-500 hover:from-orange-500 hover:to-orange-600 transition duration-300 w-full lg:w-auto"
                        >
                            Персонализирай Картата
                        </button>
                        <p className="mt-4 text-gray-300 text-sm">
                            Поръчайте сега и получете безплатна доставка!
                        </p>
                    </div>

                    <div className="mt-12">
                        <Benefits />
                    </div>

                    <div className="mt-12 space-y-6">

                        <DropdownSection title="Описание" isOpen={isDescriptionOpen} setIsOpen={setIsDescriptionOpen}>
                            <ul className="text-gray-300 leading-relaxed space-y-4">
                                <li>
                                    <strong>Ninja Card PVC Smart Business Card</strong> - персонализирайте първото си впечатление
                                </li>
                                <li>
                                    Направете всяко представяне важно с Ninja Card PVC Smart Business Card - модерен, персонализиран инструмент за безпроблемно и запомнящо се създаване на контакти. Създадена за професионалисти, които ценят иновациите и личното брандиране, тази интелигентна карта съчетава технологията със стила, за да повиши присъствието ви.
                                </li>
                                <li>
                                    <strong>Персонализируема предна и задна част:</strong>
                                    <ul className="list-disc ml-6">
                                        <li>
                                            <strong>Дизайн:</strong> Изберете цветовете на марката си или качете собствено произведение на изкуството, за да персонализирате двете страни на картата.
                                        </li>
                                        <li>
                                            <strong>Интегриране на лого:</strong> Добавете фирменото си лого на предната и задната страна, за да подсилите идентичността на марката.
                                        </li>
                                        <li>
                                            <strong>Икони за QR код и NFC:</strong> Персонализирайте външния вид на картата си с брандирани QR и NFC елементи за изчистена, модерна естетика.
                                        </li>
                                        <li>
                                            <strong>Професионални детайли:</strong> Включете името си, титлата си и информация за контакт, за да направите силно и надеждно представяне.
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </DropdownSection>
                        <DropdownSection title="Информация за доставката" isOpen={isShippingOpen} setIsOpen={setIsShippingOpen}>
                            <p className="text-gray-300 leading-relaxed">
                                Предлагаме доставка до всяка точка на България. Визитките се изработват в рамките на 3 до 5 работни дни – внимателно подготвени и предварително настроени, така че да ги използвате веднага.                            </p>
                        </DropdownSection>
                        <DropdownSection title="Как да добавя данните си?" isOpen={isDetailsOpen} setIsOpen={setIsDetailsOpen}>
                            <p className="text-gray-300 leading-relaxed">
                                След като получите визитката я активирате с първото сканиране, и активирате профила си ще Ви изпрати към нашите ресурси и клипове, които ще Ви помогнат.
                            </p>
                        </DropdownSection>
                        <DropdownSection title="Имате въпрос?" isOpen={isQuestionOpen} setIsOpen={setIsQuestionOpen}>
                            <p className="text-gray-300 leading-relaxed">
                                Свържете се с нас <Link href="/contact" className="text-orange underline">ТУК</Link>.
                                Нашият екип е готов да ви помогне!
                            </p>
                        </DropdownSection>
                    </div>
                </div>
            </div>

            {isCustomizeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-[#1f222a] p-8 rounded-lg w-full max-w-5xl text-white relative shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setIsCustomizeOpen(false)}
                            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500"
                        >
                            ✕
                        </button>
                        <CustomCardDesigner back={back} front={front} color={qrColor} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Product
function Benefits() {
    return (
        <div className="mt-10">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BenefitItem
                    title="Бърза изработка"
                    subtitle="Вашата визитка ще бъде готова в рамките на 3–5 работни дни."
                    icon={FaWrench}
                />
                <BenefitItem
                    title="Еднократно плащане"
                    subtitle="Плащате само веднъж и използвате картата без допълнителни такси."
                    icon={FaCreditCard}
                />
                <BenefitItem
                    title="Компактен и елегантен дизайн"
                    subtitle="Размерът е стандартен – 85.6мм x 53.98мм, подходящ за всякакви портфейли."
                    icon={FaMobileAlt}
                />
                <BenefitItem
                    title="Технология NFC и QR код"
                    subtitle="Споделяйте контактите си лесно и бързо чрез докосване или сканиране."
                    icon={FaBarcode}
                />
                <BenefitItem
                    title="Готова за употреба"
                    subtitle="Картата пристига при вас напълно готова за работа. Просто я активирайте."
                    icon={FaCheckCircle}
                />
                <BenefitItem
                    title="Съвместимост с всички устройства"
                    subtitle="Работи с iOS и Android устройства, включително по-стари модели."
                    icon={FaGlobe}
                />
            </ul>
        </div>
    )
}
