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
    t("features.alwaysActive"),
    t("features.contactless"),
    t("features.sixtyLinks"),
    t("features.allInOne"),
  ];
  return (
    <div className="bg-gradient-to-b from-black via-gray-950 to-black p-0 overflow-hidden pt-20">
      {/* Section Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl md:text-6xl py-2 font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
          {t("header.title")}
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          {t("header.subtitle")}
        </p>
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
            className="text-4xl md:text-5xl font-extrabold mb-6 text-center md:text-left leading-tight"
          >
            {t("section.titlePrefix")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange via-amber-500 to-yellow-500">{t("section.titleHighlight")}</span>
          </motion.h2>

          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -50 } }}
            transition={{ duration: 0.9 }}
            className="text-gray-300 mb-6 text-center md:text-left leading-relaxed text-base"
          >
            {t("section.p1")}
          </motion.p>

          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -50 } }}
            transition={{ duration: 1 }}
            className="text-gray-300 mb-8 text-center md:text-left leading-relaxed text-base"
          >
            {t("section.p2Prefix")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500 font-semibold">{t("section.titleHighlight")}</span> {t("section.p2Suffix")}
          </motion.p>

          {!isMobile && (
            <motion.div
              ref={featuresRef}
              initial="hidden"
              animate={featuresControls}
              variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
              transition={{ duration: 1.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm w-full"
            >
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={featuresControls}
                  variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.5, delay: index * 0.4 }}
                  className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10 hover:border-orange/50 transition-all duration-300"
                >
                  <span className="mr-2 text-base sm:text-lg text-emerald-400 flex-shrink-0">✔</span>
                  <span className="text-gray-200 text-xs sm:text-sm break-words overflow-wrap-anywhere">{item}</span>
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
            <Link href="/plans">
              <button className="relative bg-gradient-to-r from-orange via-amber-500 to-yellow-500 text-white font-semibold px-10 py-4 rounded-full transition-all transform hover:scale-105 focus:outline-none shadow-2xl hover:shadow-orange/50 overflow-hidden group">
                <span className="relative z-10">{t("cta.getCard")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange/40 to-purple-600/40 blur-3xl rounded-full"></div>
          <img
            src="/realMockup.png"
            alt={t("alt.profileScreenshot")}
            className="relative z-10 w-[99%] h-[100%] object-cover shadow-2xl rounded-3xl transform transition-transform duration-500 hover:scale-100 border border-white/10"
          />
        </motion.section>

        {isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm my-8">
            {features.map((item, index) => (
              <div key={index} className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <span className="mr-2 text-lg text-emerald-400">✔</span>
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default About;
