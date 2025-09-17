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
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transition hover:shadow-2xl"
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
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>

                    {/* Play overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/60 text-white px-4 py-2 text-sm font-semibold shadow">
                                <FaPlay aria-hidden className="translate-x-[1px]" />
                                {ctaText}
                            </span>
                        </div>
                    </div>

                    {/* subtle gradient for readability on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="flex flex-col p-6 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {headerText}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                        {paragraphText}
                    </p>

                    {/* CTA button */}
                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal(url);
                            }}
                            className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2"
                            aria-label={ctaText}
                        >
                            <FaPlay aria-hidden />
                            {ctaText}
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
}
