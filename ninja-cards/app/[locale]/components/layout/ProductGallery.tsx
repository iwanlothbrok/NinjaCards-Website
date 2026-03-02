'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { addToCart, loadCartFromLocalStorage } from "@/lib/cart"; // Ensure this is the correct path
import { useRouter } from "@/navigation";
const styles = [
    { key: "black", label: "Personalized", src: "/cards/personalized.png" },
    { key: "pulse-green", label: "Ninja Pulse – Green", src: "/cards/circles-green.png" },
    { key: "pulse-orange", label: "Ninja Pulse – Orange", src: "/cards/circles-orange.png" },
    { key: "women-colors", label: "Ninja Flow", src: "/cards/women-colors.png" },
    { key: "inferno", label: "Ninja Inferno", src: "/cards/gradient-lines-red.png" },
    { key: "money", label: "Ninja Legacy", src: "/cards/money.png" },
    { key: "sky", label: "Ninja Galaxy", src: "/cards/sky.png" },
    { key: "gradient", label: "Ninja Soft Gradient", src: "/cards/gradient.png" },
];

export default function ProductGallery() {
    const t = useTranslations("GalleryBenefits");
    const [selectedStyle, setSelectedStyle] = useState(styles[0]);
    const [alert, setAlert] = useState<string | null>(null);
    const router = useRouter();
    // Toast logic
    const showToast = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(null), 2500);
    };


    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 px-4 bg-gradient-to-b from-black via-gray-950 to-black text-gray-200 relative overflow-hidden"
        >
            {alert && (
                <div className="fixed inset-0 flex items-start justify-center z-[9999] pointer-events-none">
                    <motion.div
                        initial={{ y: -60, opacity: 0, scale: 0.95 }}
                        animate={{ y: 40, opacity: 1, scale: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl border-4 border-white/30 font-bold text-lg flex items-center gap-3 pointer-events-auto"
                    >
                        <span>{alert}</span>
                    </motion.div>
                </div>
            )}
            <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange via-yellow-400 to-orange bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange to-amber-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                            <div className="relative w-[330px] h-[220px] sm:w-[460px] sm:h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 backdrop-blur-sm">
                                <Image
                                    src={selectedStyle.src}
                                    alt={selectedStyle.label}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                        {/* Add to Cart Button - moved below image for better focus */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-10 flex justify-center w-full"
                        >
                            <button
                                onClick={() => { router.push("/cards"); }}
                                className="relative px-10 py-5 bg-gradient-to-r from-amber-400 via-orange to-amber-700 text-gray-900 font-extrabold rounded-3xl shadow-2xl hover:scale-105 hover:shadow-orange-400/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange/40 group flex items-center gap-4"
                            >
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="w-6 h-6 text-orange-700 group-hover:scale-110 transition-transform duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-13h2a2 2 0 012 2v2" />
                                    </svg>
                                    {t("addToCart")}
                                </span>
                                <span className="inline-block animate-pulse text-orange-700 font-bold bg-white/80 rounded-full px-3 py-1 ml-2 text-sm shadow">
                                    {t("free")}
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Options */}
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-10 items-center justify-center lg:mb-28"
                    >
                        {/* Style selector */}
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-5 tracking-tight">
                                {t("chooseStyle")}
                            </h3>
                            <div className="flex gap-4 flex-wrap">
                                {styles.map((style) => (
                                    <button
                                        key={style.key}
                                        onClick={() => setSelectedStyle(style)}
                                        className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium
                                            ${selectedStyle.key === style.key
                                                ? "bg-gradient-to-r from-amber-500 to-orange text-black border-transparent shadow-lg shadow-amber-500/30 scale-105"
                                                : "border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 hover:scale-105"
                                            }`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </motion.section>
    );
}
