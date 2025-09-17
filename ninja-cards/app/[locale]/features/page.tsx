"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Header from "../components/layout/Header";
import { useTranslations } from "next-intl";

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
            className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20 space-y-8 md:space-y-0"
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
            className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-20 mb-14 md:mb-20 space-y-8 md:space-y-0"
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
    const t = useTranslations("Features");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full bg-gradient-to-b from-black to-gray-950 text-white">
            <Header
                pageInformation={t("header.pageInformation")}
                textOne={t("header.textOne")}
                textTwo={t("header.textTwo")}
                textThree={t("header.textThree")}
            />

            {isMobile ? (
                <>
                    <FeatureItemLeftImage
                        header={t("features.header1")}
                        mainHeader={t("features.mainHeader1")}
                        description={t("features.description1")}
                        imagePath="/features/01.png"
                        buttonText={t("features.buttonText1")}
                        buttonLink="https://www.ninjacardsnfc.com/profileDetails/1"
                    />
                    <FeatureItemLeftImage
                        header={t("features.header2")}
                        mainHeader={t("features.mainHeader2")}
                        description={t("features.description2")}
                        imagePath="/features/02.png"
                        buttonText={t("features.buttonText2")}
                        buttonLink=""
                    />
                    <FeatureItemLeftImage
                        header={t("features.header3")}
                        mainHeader={t("features.mainHeader3")}
                        description={t("features.description3")}
                        imagePath="/features/03.png"
                        buttonText={t("features.buttonText3")}
                        buttonLink="https://www.ninjacardsnfc.com/profile"
                    />
                    <FeatureItemLeftImage
                        header={t("features.header4")}
                        mainHeader={t("features.mainHeader4")}
                        description={t("features.description4")}
                        imagePath="/features/04.png"
                        buttonText={t("features.buttonText4")}
                        buttonLink="https://www.ninjacardsnfc.com/profile?tab=profileQr"
                    />
                    <FeatureItemLeftImage
                        header={t("features.header5")}
                        mainHeader={t("features.mainHeader5")}
                        description={t("features.description5")}
                        imagePath="/features/05.png"
                        buttonText={t("features.buttonText5")}
                        buttonLink=""
                    />
                    <FeatureItemLeftImage
                        header={t("features.header6")}
                        mainHeader={t("features.mainHeader6")}
                        description={t("features.description6")}
                        imagePath="/features/06.png"
                        buttonText={t("features.buttonText6")}
                        buttonLink=""
                    />
                </>
            ) : (
                <>
                    <FeatureItemLeftImage
                        header={t("features.header1")}
                        mainHeader={t("features.mainHeader1")}
                        description={t("features.description1")}
                        imagePath="/features/01.png"
                        buttonText={t("features.buttonText1")}
                        buttonLink="https://www.ninjacardsnfc.com/profileDetails/1"
                    />
                    <FeatureItemRightImage
                        header={t("features.header2")}
                        mainHeader={t("features.mainHeader2")}
                        description={t("features.description2")}
                        imagePath="/features/02.png"
                        buttonText={t("features.buttonText2")}
                        buttonLink=""
                    />
                    <FeatureItemLeftImage
                        header={t("features.header3")}
                        mainHeader={t("features.mainHeader3")}
                        description={t("features.description3")}
                        imagePath="/features/03.png"
                        buttonText={t("features.buttonText3")}
                        buttonLink="https://www.ninjacardsnfc.com/profile"
                    />
                    <FeatureItemRightImage
                        header={t("features.header4")}
                        mainHeader={t("features.mainHeader4")}
                        description={t("features.description4")}
                        imagePath="/features/04.png"
                        buttonText={t("features.buttonText4")}
                        buttonLink="https://www.ninjacardsnfc.com/profile?tab=profileQr"
                    />
                    <FeatureItemLeftImage
                        header={t("features.header5")}
                        mainHeader={t("features.mainHeader5")}
                        description={t("features.description5")}
                        imagePath="/features/05.png"
                        buttonText={t("features.buttonText5")}
                        buttonLink=""
                    />
                    <FeatureItemRightImage
                        header={t("features.header6")}
                        mainHeader={t("features.mainHeader6")}
                        description={t("features.description6")}
                        imagePath="/features/06.png"
                        buttonText={t("features.buttonText6")}
                        buttonLink=""
                    />
                </>
            )}
        </div>
    );
}
