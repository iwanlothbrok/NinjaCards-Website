// File: /components/Product.tsx

'use client'

import React, { useState } from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import DropdownSection from './DropdownSection'
import BenefitItem from './BenefitItem'
import CustomCardDesigner from './CustomCardDesigner'
import { FaCheckCircle, FaMobileAlt, FaBarcode, FaCreditCard, FaWrench, FaGlobe } from 'react-icons/fa'
import { useTranslations } from 'next-intl'

type ProductProps = {
    title: string
    price: string
    imageUrls: string[]
    back: string
    oldPrice: number
    front: string
    type: string
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
    type
}) => {
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [isShippingOpen, setIsShippingOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isQuestionOpen, setIsQuestionOpen] = useState(false)

    const t = useTranslations('Product')

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
                                    {index === 2 ? (
                                        <video
                                            src={url}
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            className="w-full object-cover mx-auto"
                                            style={{
                                                maxHeight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '532px' : '300px'
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`Product Image ${index + 1}`}
                                            className="w-full object-cover mx-auto"
                                            style={{
                                                maxHeight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '532px' : '300px'
                                            }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <p className="text-white text-lg font-semibold">
                                            {t('example', { index: index + 1 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        <div className="absolute top-0 left-0 bg-orange text-white px-4 py-2 rounded-br-lg shadow-lg">
                            {t('badge')}
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
                            {t('customize')}
                        </button>
                        <p className="mt-4 text-gray-300 text-sm">
                            {t('freeShipping')}
                        </p>
                    </div>

                    <div className="mt-12">
                        <Benefits />
                    </div>

                    <div className="mt-12 space-y-6">
                        {/* Description */}
                        <DropdownSection title={t('sections.description')} isOpen={isDescriptionOpen} setIsOpen={setIsDescriptionOpen}>
                            <ul className="text-gray-300 leading-relaxed space-y-4">
                                <li>
                                    <strong>{t('description.title')}</strong> - {t('description.subtitle')}
                                </li>
                                <li>{t('description.paragraph1')}</li>
                                <li>
                                    <strong>{t('description.customizable')}</strong>
                                    <ul className="list-disc ml-6">
                                        <li><strong>{t('description.design')}</strong></li>
                                        <li><strong>{t('description.logo')}</strong></li>
                                        <li><strong>{t('description.qr')}</strong></li>
                                        <li><strong>{t('description.contact')}</strong></li>
                                    </ul>
                                </li>
                            </ul>
                        </DropdownSection>

                        {/* Shipping */}
                        <DropdownSection title={t('sections.shipping')} isOpen={isShippingOpen} setIsOpen={setIsShippingOpen}>
                            <p className="text-gray-300 leading-relaxed">{t('shipping')}</p>
                        </DropdownSection>

                        {/* Details */}
                        <DropdownSection title={t('sections.details')} isOpen={isDetailsOpen} setIsOpen={setIsDetailsOpen}>
                            <p className="text-gray-300 leading-relaxed">{t('details')}</p>
                        </DropdownSection>

                        {/* Questions */}
                        <DropdownSection title={t('sections.questions')} isOpen={isQuestionOpen} setIsOpen={setIsQuestionOpen}>
                            <p className="text-gray-300 leading-relaxed">
                                {t('questions.before')}{' '}
                                <Link href="/contact" className="text-orange underline">{t('questionsLink')}</Link>
                                {' '}{t('questions.after')}
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
    const t = useTranslations('Product.benefits')
    return (
        <div className="mt-10">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BenefitItem title={t('fast.title')} subtitle={t('fast.subtitle')} icon={FaWrench} />
                <BenefitItem title={t('payment.title')} subtitle={t('payment.subtitle')} icon={FaCreditCard} />
                <BenefitItem title={t('design.title')} subtitle={t('design.subtitle')} icon={FaMobileAlt} />
                <BenefitItem title={t('tech.title')} subtitle={t('tech.subtitle')} icon={FaBarcode} />
                <BenefitItem title={t('ready.title')} subtitle={t('ready.subtitle')} icon={FaCheckCircle} />
                <BenefitItem title={t('compatibility.title')} subtitle={t('compatibility.subtitle')} icon={FaGlobe} />
            </ul>
        </div>
    )
}
