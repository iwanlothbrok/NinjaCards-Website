"use client"
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';

interface FeatureProps {
    header: string;
    mainHeader: string;
    imagePath: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const FeatureItemLeftImage: React.FC<FeatureProps> = ({ header, mainHeader, description, imagePath, buttonText, buttonLink }) => {
    return (
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20">
            {/* Image Section */}
            <div className="w-full md:w-2/5 mb-8 md:mb-0 md:mr-5">
                <img
                    src={imagePath}
                    alt={mainHeader}
                    className="w-full h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 md:px-20 text-center md:text-left">
                <h4 className="text-sm md:text-lg text-gray-400 uppercase mb-2 tracking-wider">
                    {header}
                </h4>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-100 mb-4">
                    {mainHeader}
                </h2>
                <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6">
                    {description}
                </p>

                {/* Button Section */}
                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="inline-block bg-orange text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300 focus:ring-4 focus:ring-orange"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    );
};


const FeatureItemRightImage: React.FC<FeatureProps> = ({ header, mainHeader, description, imagePath, buttonText, buttonLink }) => {
    return (
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20">
            {/* Content Section */}
            <div className="w-full md:w-3/5 md:px-20 text-center md:text-left">
                <h4 className="text-sm md:text-lg text-gray-400 uppercase mb-2 tracking-wider">
                    {header}
                </h4>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-100 mb-4">
                    {mainHeader}
                </h2>
                <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6">
                    {description}
                </p>

                {/* Button Section */}
                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="inline-block bg-orange text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300  focus:ring-4 focus:ring-orange"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                    </a>
                )}
            </div>

            {/* Image Section */}
            <div className="w-full md:w-2/5 mb-8 md:mb-0 md:ml-12">
                <img
                    src={imagePath}
                    alt={mainHeader}
                    className="w-full h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
        </div>
    );
};

export default function Features() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Check if the screen width is less than 768px (typical breakpoint for phones)
        };

        handleResize(); // Initial check

        window.addEventListener('resize', handleResize); // Listen for screen resize events

        return () => window.removeEventListener('resize', handleResize); // Cleanup event listener on unmount
    }, []);

    return (
        <div className="">
            <Header pageInformation='Функции' textOne='Споделяне' textTwo='Свързване' textThree='Успех' />

            {/* Conditionally render based on screen size */}
            {isMobile ? (
                <>
                    <FeatureItemRightImage
                        header="NFC & QR код"
                        mainHeader="Споделяне на контакти"
                        description="С NFC дигиталната визитка на NinjaCard, споделянето на вашите контакти става безпроблемно. Просто докоснете вашата NinjaCard NFC карта към друго устройство с NFC и вашият дигитален профил ще бъде споделен мигновено."
                        imagePath="/features/01.png"
                        buttonText="Примерен профил"
                        buttonLink="https://www.ninjacardsnfc.com/profileDetails/1"
                    />

                    <FeatureItemRightImage
                        header="Генериране на потенциални клиенти"
                        mainHeader="Уловете нови контакти"
                        description="Всяка NinjaCard NFC дигитална визитка разполага с мощен инструмент за генериране на нови контакти чрез бутона 'Разменете Контакти'. Тази функция ви позволява лесно да улавяте нови контакти, което я прави идеалния инструмент за разширяване на мрежата ви."
                        imagePath="/features/02.png"
                        buttonText=""
                        buttonLink=""
                    />

                    <FeatureItemRightImage
                        header="Лесни актуализации"
                        mainHeader="Актуализирайте информацията си в реално време"
                        description="С NinjaCard можете да актуализирате вашата контактна информация по всяко време, като гарантирате, че вашата мрежа винаги разполага с най-новата информация. Просто докоснете вашия телефон, за да споделите актуализирания профил мигновено."
                        imagePath="/features/03.png"
                        buttonText="Актуализирайте сега"
                        buttonLink="https://www.ninjacardsnfc.com/profile"
                    />

                    <FeatureItemRightImage
                        header="QR код"
                        mainHeader="Запазване и разпространяване на QR"
                        description="Ninja картата предлага възможност за изтегляне на QR код за вашата смарт визитка, което позволява лесно споделяне и достъпност на вашата информация. Тази функция рационализира процеса на достъп на клиенти и потребители до вашата информация и осигурява безпроблемно потребителско изживяване."
                        imagePath="/features/04.png"
                        buttonText="Виж Тук"
                        buttonLink="https://www.ninjacardsnfc.com/profile?tab=profileQr"
                    />

                    <FeatureItemRightImage
                        header="Цветове на визитка"
                        mainHeader="Персонализиране на профила"
                        description="Профилът на вашата смарт визитка предлага опции за персонализиране, които ви позволяват да променяте цветовете. Тази гъвкавост гарантира, че вашата визитна картичка отразява идентичността на марката ви и се отличава от останалите. С Ninja Cards можете да създадете уникален и професионален профил за вашата визитка."
                        imagePath="/features/05.png"
                        buttonText=""
                        buttonLink=""
                    />
                </>
            ) : (
                <>
                    <FeatureItemLeftImage
                        header="NFC & QR код"
                        mainHeader="Споделяне на контакти"
                        description="С NFC дигиталната визитка на NinjaCard, споделянето на вашите контакти става безпроблемно. Просто докоснете вашата NinjaCard NFC карта към друго устройство с NFC и вашият дигитален профил ще бъде споделен мигновено."
                        imagePath="/features/01.png"
                        buttonText="Примерен профил"
                        buttonLink="https://www.ninjacardsnfc.com/profileDetails/1"
                    />

                    <FeatureItemRightImage
                        header="Генериране на потенциални клиенти"
                        mainHeader="Уловете нови контакти"
                        description="Всяка NinjaCard NFC дигитална визитка разполага с мощен инструмент за генериране на нови контакти чрез бутона 'Разменете Контакти'. Тази функция ви позволява лесно да улавяте нови контакти, което я прави идеалния инструмент за разширяване на мрежата ви."
                        imagePath="/features/02.png"
                        buttonText=""
                        buttonLink=""
                    />

                    <FeatureItemLeftImage
                        header="Лесни актуализации"
                        mainHeader="Актуализирайте информацията си в реално време"
                        description="С NinjaCard можете да актуализирате вашата контактна информация по всяко време, като гарантирате, че вашата мрежа винаги разполага с най-новата информация. Просто докоснете вашия телефон, за да споделите актуализирания профил мигновено."
                        imagePath="/features/03.png"
                        buttonText="Актуализирайте сега"
                        buttonLink="https://www.ninjacardsnfc.com/profile"
                    />

                    <FeatureItemRightImage
                        header="QR код"
                        mainHeader="Запазване и разпространяване на QR"
                        description="Ninja картата предлага възможност за изтегляне на QR код за вашата смарт визитка, което позволява лесно споделяне и достъпност на вашата информация. Тази функция рационализира процеса на достъп на клиенти и потребители до вашата информация и осигурява безпроблемно потребителско изживяване."
                        imagePath="/features/04.png"
                        buttonText="Виж Тук"
                        buttonLink="https://www.ninjacardsnfc.com/profile?tab=profileQr"
                    />

                    <FeatureItemLeftImage
                        header="Цветове на визитка"
                        mainHeader="Персонализиране на профила"
                        description="Профилът на вашата смарт визитка предлага опции за персонализиране, които ви позволяват да променяте цветовете. Тази гъвкавост гарантира, че вашата визитна картичка отразява идентичността на марката ви и се отличава от останалите. С Ninja Cards можете да създадете уникален и професионален профил за вашата визитка."
                        imagePath="/features/05.png"
                        buttonText=""
                        buttonLink=""
                    />

                    <FeatureItemRightImage
                        header="Връзки"
                        mainHeader="Полета в профила ви"
                        description="В профилите на Ninja Card можете да използвате над 40 полета, за да споделяте цялата необходима информация за вашия бизнес."
                        imagePath="/features/06.png"
                        buttonText="Персонализирайте сега"
                        buttonLink="https://www.ninjacardsnfc.com/profile?tab=links"
                    />
                </>
            )}
        </div>
    );
}
