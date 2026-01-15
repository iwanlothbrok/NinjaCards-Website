"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface BackgroundSelectorProps {
    cardBackgroundOptions: { name: string; bgClass: string }[];
    handleColorSelection: (colorName: string) => void;
    cardStyle: { name: string; highlightClass: string };
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
    cardBackgroundOptions,
    handleColorSelection,
    cardStyle,
}) => {
    const t = useTranslations("backgroundSelector");

    return (
        <div className="mt-8 text-center">
            <h3 className={`text-2xl font-bold mb-6 ${cardStyle.highlightClass} tracking-wide`}>
                {t("title")}
            </h3>
            <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
                {cardBackgroundOptions.map(({ name, bgClass }) => (
                    <button
                        key={name}
                        onClick={() => handleColorSelection(name)}
                        aria-label={t("ariaSelect", { name })}
                        className={`relative w-14 h-14 rounded-xl border-2 border-gray-200/50 
                            transition-all duration-300 ease-out
                            hover:scale-110 hover:shadow-xl hover:border-gray-300
                            ${bgClass} 
                            ${cardStyle.name === name
                                ? "ring-4 ring-offset-2 ring-blue-400/60 shadow-2xl scale-105"
                                : "shadow-md"
                            }`}
                    >
                        {cardStyle.name === name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={3}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-white drop-shadow-lg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BackgroundSelector;
