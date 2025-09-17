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
        <div className="mt-6 text-center">
            <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>
                {t("title")}
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
                {cardBackgroundOptions.map(({ name, bgClass }) => (
                    <button
                        key={name}
                        onClick={() => handleColorSelection(name)}
                        aria-label={t("ariaSelect", { name })}
                        className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${bgClass} ${cardStyle.name === name
                                ? "ring-4 ring-offset-2 ring-blue-500"
                                : ""
                            }`}
                    >
                        {cardStyle.name === name && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4 text-white mx-auto"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BackgroundSelector;
