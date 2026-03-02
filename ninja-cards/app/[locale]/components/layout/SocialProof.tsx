"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const logos = [
    { src: "/clients/home2you.svg", alt: "Home 2 You" },
    { src: "/clients/night-out.svg", alt: "Enterpreneurs Night Out" },
    { src: "/clients/postbank.svg", alt: "Postbank" },
    { src: "/clients/veliko-tarnovo.svg", alt: "Veliko Tarnovo" },
    { src: "/clients/winners.svg", alt: "Winners Group" },
    { src: "/clients/inv.png", alt: "Invest Club" },

];

export default function SocialProof() {
    const t = useTranslations("SocialProof");

    return (
        <section className="relative py-20 bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden">
            {/* Background effects
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" /> */}

            <div className="relative max-w-7xl mx-auto px-4 space-y-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-6"
                >

                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Logos slider with glow effect */}
                <div className="relative py-8">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

                    <div className="group overflow-hidden">
                        <motion.div
                            className="flex gap-20 items-center w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 30,
                                ease: "linear",
                            }}
                        >
                            {[...logos, ...logos].map((logo, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="flex items-center justify-center min-w-[180px] opacity-60 hover:opacity-100 transition-all duration-300"
                                >
                                    <div className="relative group/logo">
                                        <div className="absolute inset-0 bg-orange/20 blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300" />
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            className="relative h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 filter drop-shadow-2xl"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Counters with premium styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
                >
                    <Stat value="270+" label={t("stats.cards")} delay={0.1} />
                    <Stat value="15806" label={t("stats.scans")} delay={0.2} />
                    <Stat value="98%" label={t("stats.satisfaction")} delay={0.3} />
                </motion.div>
            </div>
        </section>
    );
}

function Stat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 p-8 hover:border-orange/50 transition-all duration-300"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange to-yellow-400 bg-clip-text text-transparent mb-3">
                    {value}
                </div>
                <p className="text-gray-300 text-base font-medium tracking-wide">{label}</p>
            </div>
        </motion.div>
    );
}
