"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const t = useTranslations("AboutPage");
  console.log("Current locale:", t);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionControls = useAnimation();
  const headerControls = useAnimation();
  const featuresControls = useAnimation();
  const buttonControls = useAnimation();
  const imageControls = useAnimation();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === sectionRef.current) sectionControls.start("visible");
          if (entry.target === headerRef.current) headerControls.start("visible");
          if (entry.target === featuresRef.current) featuresControls.start("visible");
          if (entry.target === buttonRef.current) buttonControls.start("visible");
          if (entry.target === imageRef.current) imageControls.start("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    [sectionRef, headerRef, featuresRef, buttonRef, imageRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, [sectionControls, headerControls, featuresControls, buttonControls, imageControls]);

  const features = [
    t("features.instantShare"),
    t("features.customDesign"),
    t("features.durability"),
    t("features.contactless"),
    t("features.sixtyLinks"),
    t("features.allInOne"),
  ];

  return (
    <div className="bg-gradient-to-b from-black via-gray-950 to-black p-1">
      {/* Section Header */}
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={headerControls}
        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
        transition={{ duration: 0.8 }}
        className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100 mb-4 pt-10 space-y-4 text-center"
      >
        <motion.div
          initial="hidden"
          animate={headerControls}
          variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
          transition={{ duration: 0.6 }}
          className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 bg-[#202c47] rounded-full bg-opacity-70 hover:cursor-pointer hover:bg-opacity-50"
        >
          {t("header.badge")}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate={headerControls}
          variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
          transition={{ duration: 0.7 }}
          className="text-2xl font-semibold text-white sm:text-3xl"
        >
          {t("header.title")}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate={headerControls}
          variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
          transition={{ duration: 0.8 }}
          className="text-md text-gray-200 sm:text-lg"
        >
          {t("header.subtitle")}
        </motion.p>
      </motion.div>

      <div className="relative text-white flex flex-col md:flex-row items-center justify-evenly p-8 md:p-16">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={sectionControls}
          variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -50 } }}
          transition={{ duration: 1 }}
          className="max-w-md about-section"
        >
          <motion.h2
            initial="hidden"
            animate={sectionControls}
            variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -50 } }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left leading-tight"
          >
            {t("section.titlePrefix")} <span className="text-orange">{t("section.titleHighlight")}</span>
          </motion.h2>

          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -50 } }}
            transition={{ duration: 0.9 }}
            className="text-gray-400 mb-6 text-center md:text-left leading-relaxed"
          >
            {t("section.p1")}
          </motion.p>

          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -50 } }}
            transition={{ duration: 1 }}
            className="text-gray-400 mb-8 text-center md:text-left leading-relaxed"
          >
            {t("section.p2Prefix")} <span className="text-orange">{t("section.titleHighlight")}</span> {t("section.p2Suffix")}
          </motion.p>

          {!isMobile && (
            <motion.div
              ref={featuresRef}
              initial="hidden"
              animate={featuresControls}
              variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
              transition={{ duration: 1.4 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm"
            >
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={featuresControls}
                  variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.5, delay: index * 0.4 }}
                  className="flex items-center"
                >
                  <span className="mr-2 text-lg text-green-500">✔</span> {item}
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            ref={buttonRef}
            initial="hidden"
            animate={buttonControls}
            variants={{ visible: { opacity: 1, scale: 1 }, hidden: { opacity: 0, scale: 0.9 } }}
            transition={{ duration: 1.4 }}
            className="mt-10 mb-8 flex justify-center md:justify-start"
          >
            <Link href="/products/cards">
              <button className="bg-gradient-to-r from-orange to-teal-600 text-white px-9 py-4 rounded-full transition-transform transform hover:scale-105 focus:outline-none shadow-xl">
                {t("cta.getCard")}
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* iPhone Mockup */}
        <motion.section
          ref={imageRef}
          initial="hidden"
          animate={imageControls}
          variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
          transition={{ duration: 1.5 }}
          className="relative flex items-center justify-center w-[300px] h-[600px] bg-cover bg-center transform transition-transform duration-500 hover:scale-105"
        >
          <img
            src="/realMockup.png"
            alt={t("alt.profileScreenshot")}
            className="absolute w-[99%] h-[100%] object-cover shadow-2xl transform transition-transform duration-500 hover:scale-100"
          />
        </motion.section>

        {isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm my-8">
            {features.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2 text-lg text-green-500">✔</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
