"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Header from "../components/layout/Header";

interface FeatureProps {
    header: string;
    mainHeader: string;
    imagePath: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const FeatureItemLeftImage: React.FC<FeatureProps> = ({
    header,
    mainHeader,
    description,
    imagePath,
    buttonText,
    buttonLink,
}) => {
    const controls = useAnimation();
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        controls.start("visible");
                    } else {
                        controls.start("hidden");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [controls]);

    return (
        <motion.div
            ref={sectionRef}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 0.5 }}
            className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20"
        >
            <motion.div
                className="w-full md:w-2/5 mb-8 md:mb-0 md:mr-5"
                whileHover={{ scale: 1.05 }}
            >
                <img
                    src={imagePath}
                    alt={mainHeader}
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
            </motion.div>

            <motion.div
                className="w-full md:w-3/5 md:px-20 text-center md:text-left"
                variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: -50 },
                }}
                transition={{ duration: 0.7 }}
            >
                <h4 className="text-sm md:text-lg text-gray-400 uppercase mb-2 tracking-wider">
                    {header}
                </h4>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-100 mb-4">
                    {mainHeader}
                </h2>
                <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6">
                    {description}
                </p>

                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="inline-block bg-orange text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300 focus:ring-4 focus:ring-orange"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                    </a>
                )}
            </motion.div>
        </motion.div>
    );
};

const FeatureItemRightImage: React.FC<FeatureProps> = ({
    header,
    mainHeader,
    description,
    imagePath,
    buttonText,
    buttonLink,
}) => {
    const controls = useAnimation();
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        controls.start("visible");
                    } else {
                        controls.start("hidden");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [controls]);

    return (
        <motion.div
            ref={sectionRef}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 0.5 }}
            className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20"
        >
            <motion.div
                className="w-full md:w-3/5 md:px-20 text-center md:text-left"
                variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: 50 },
                }}
                transition={{ duration: 0.7 }}
            >
                <h4 className="text-sm md:text-lg text-gray-400 uppercase mb-2 tracking-wider">
                    {header}
                </h4>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-100 mb-4">
                    {mainHeader}
                </h2>
                <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6">
                    {description}
                </p>

                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="inline-block bg-orange text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300 focus:ring-4 focus:ring-orange"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                    </a>
                )}
            </motion.div>

            <motion.div
                className="w-full md:w-2/5 mb-8 md:mb-0 md:ml-12"
                whileHover={{ scale: 1.05 }}
            >
                <img
                    src={imagePath}
                    alt={mainHeader}
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
            </motion.div>
        </motion.div>
    );
};

export default function Features() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
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
                        header="Профил"
                        mainHeader="Персонализиране на профила"
                        description="Създайте уникална и професионална дигитална визитка с NinjaCard! Персонализирайте профила си напълно според вашите нужди и направете силно първо впечатление.

Добавете до 30 социални мрежи, изберете персонални цветове и сменете профилната и коричната си снимка с едно докосване.

Вашият NinjaCard профил ви дава свободата да управлявате контактите си, социалните мрежи и брандинга в реално време!"
                        imagePath="/features/05.png"
                        buttonText=""
                        buttonLink=""
                    />

                    <FeatureItemRightImage
                        header="Статистика"
                        mainHeader="Анализ на профила"
                        description="Следете представянето на вашата NinjaCard в реално време! Получете детайлна статистика за посещенията на профила, изтеглянията на контакти и ангажираността на вашите клиенти.

Вижте колко хора са разгледали вашия профил, свалили са контактите ви или са кликнали върху вашите социални мрежи. С анализите на NinjaCard вие винаги сте информирани и можете да подобрите ефективността на вашата дигитална визитка."
                        imagePath="/features/06.png"
                        buttonText=""
                        buttonLink=""
                    />
                </>
            )}
        </div>
    )
}
