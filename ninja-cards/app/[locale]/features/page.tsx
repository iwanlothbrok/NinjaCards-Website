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
            { threshold: 0.2 }
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
                hidden: { opacity: 0, y: 60 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-20 py-16 md:py-24 space-y-8 md:space-y-0"
        >
            <motion.div
                className="w-full md:w-2/5 mb-8 md:mb-0 md:mr-12"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange via-amber-600 to-orange rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <img
                        src={imagePath}
                        alt={mainHeader}
                        className="relative w-full h-auto rounded-2xl shadow-2xl object-cover border border-gray-800"
                    />
                </div>
            </motion.div>

            <motion.div
                className="w-full md:w-3/5 md:px-12 text-center md:text-left"
                variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: -50 },
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h4 className="text-xs md:text-sm text-orange font-semibold uppercase mb-3 tracking-[0.2em] opacity-90">
                    {header}
                </h4>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {mainHeader}
                </h2>
                <p className="text-base md:text-xl text-gray-400 leading-relaxed mb-8 font-light">
                    {description}
                </p>

                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="group inline-flex items-center bg-gradient-to-r from-orange to-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-orange/50 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-orange/50 focus:outline-none"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
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
            { threshold: 0.2 }
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
                hidden: { opacity: 0, y: 60 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto flex flex-col md:flex-row-reverse items-center px-6 md:px-20 py-16 md:py-24 space-y-8 md:space-y-0"
        >
            <motion.div
                className="w-full md:w-2/5 mb-8 md:mb-0 md:ml-12"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange via-amber-600 to-orange rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <img
                        src={imagePath}
                        alt={mainHeader}
                        className="relative w-full h-auto rounded-2xl shadow-2xl object-cover border border-gray-800"
                    />
                </div>
            </motion.div>

            <motion.div
                className="w-full md:w-3/5 md:px-12 text-center md:text-left"
                variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: 50 },
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h4 className="text-xs md:text-sm text-orange font-semibold uppercase mb-3 tracking-[0.2em] opacity-90">
                    {header}
                </h4>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {mainHeader}
                </h2>
                <p className="text-base md:text-xl text-gray-400 leading-relaxed mb-8 font-light">
                    {description}
                </p>

                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        className="group inline-flex items-center bg-gradient-to-r from-orange to-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-orange/50 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-orange/50 focus:outline-none"
                        aria-label={`Learn more about ${mainHeader}`}
                    >
                        {buttonText}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                )}
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
                        buttonLink=""
                    />
                    <FeatureItemLeftImage
                        header={t("features.header4")}
                        mainHeader={t("features.mainHeader4")}
                        description={t("features.description4")}
                        imagePath="/features/04.png"
                        buttonText={t("features.buttonText4")}
                        buttonLink=""
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
