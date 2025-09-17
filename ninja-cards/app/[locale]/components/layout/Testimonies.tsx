"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const Showcase: React.FC = () => {
  const t = useTranslations("ShowcasePage");
  console.log("Current locale:", t);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex items-center justify-center py-10 px-6 bg-gray-950"
    >
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 opacity-10 animate-pulse blur-3xl"></div>

      {/* Container */}
      <div className="relative max-w-6xl w-full flex flex-col items-center text-center">
        <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
          <div className="mb-8 space-y-4 text-center">
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40"
            >
              {t("header.badge")}
            </motion.div>

            <motion.h1
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.7 }}
              className="text-2xl font-semibold text-white sm:text-3xl"
            >
              {t("header.title")}
            </motion.h1>

            <motion.p
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.8 }}
              className="text-md text-gray-100 sm:text-lg"
            >
              {t("header.subtitle")}
            </motion.p>
          </div>
        </div>

        {/* Image */}
        <motion.img
          src="/clients.jpg"
          alt={t("alt.showcase")}
          className="w-[100%] sm:w-[80%] md:w-[80%] h-auto rounded-lg shadow-lg border-4 border-orange"
          whileHover={{ scale: 1.05 }}
        />
      </div>
    </motion.section>
  );
};

export default Showcase;
