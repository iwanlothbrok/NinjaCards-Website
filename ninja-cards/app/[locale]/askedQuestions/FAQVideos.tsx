'use client';

import React from 'react';
import { FaPlay } from 'react-icons/fa';

interface FAQVideosProps {
    imagePath: string;
    headerText: string;
    paragraphText: string;
    url: string;
    openModal: (url: string) => void;
    /** optional overrides */
    alt?: string;
    ctaText: string; // required from parent via next-intl
    className?: string;
}

export default function FAQVideos({
    imagePath,
    headerText,
    paragraphText,
    url,
    openModal,
    alt = 'Ninja Cards video',
    ctaText,
    className = '',
}: FAQVideosProps) {
    return (
        <div className={`w-full ${className}`}>
            <article
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
                role="button"
                tabIndex={0}
                onClick={() => openModal(url)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(url);
                    }
                }}
                aria-label={headerText}
            >
                {/* Media (16:9) */}
                <div className="relative w-full overflow-hidden">
                    <div className="w-full aspect-[16/9]">
                        <img
                            src={imagePath}
                            alt={alt}
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                            loading="lazy"
                        />
                    </div>

                    {/* Play overlay with premium styling */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                            <span className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange to-amber-600 text-white px-8 py-3 text-base font-bold shadow-2xl backdrop-blur-sm">
                                <FaPlay aria-hidden className="translate-x-[1px] drop-shadow-lg" size={16} />
                                {ctaText}
                            </span>
                        </div>
                    </div>

                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300" />

                    {/* Accent gradient border effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-orange/20 via-transparent to-purple-500/20" />
                </div>

                {/* Content */}
                <div className="flex flex-col p-8 text-center flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 group-hover:from-orange group-hover:to-amber-500 transition-all duration-300">
                        {headerText}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                        {paragraphText}
                    </p>

                    {/* Premium CTA button */}
                    <div className="mt-auto">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal(url);
                            }}
                            className="relative bg-gradient-to-r from-orange to-amber-600 text-white px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:from-orange hover:to-amber-700 transition-all duration-300 inline-flex items-center justify-center gap-3 font-semibold group/btn overflow-hidden"
                            aria-label={ctaText}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <FaPlay aria-hidden className="relative z-10 drop-shadow" />
                            <span className="relative z-10">{ctaText}</span>
                        </button>
                    </div>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            </article>
        </div>
    );
}
