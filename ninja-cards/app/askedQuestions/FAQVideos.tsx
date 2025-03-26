// FAQVideos.tsx
import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface FAQVideosProps {
    imagePath: string;
    headerText: string;
    paragraphText: string;
    url: string;
    openModal: (url: string) => void;
}

export default function FAQVideos({ imagePath, headerText, paragraphText, url, openModal }: FAQVideosProps) {

    return (
        <div className="flex justify-center w-full mt-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-md">
                <div className="relative">
                    <img
                        src={imagePath}
                        alt="Ninja Cards - Смарт Визитка"
                        className="w-full h-52 object-cover cursor-pointer transition-transform duration-500 ease-in-out hover:scale-110"
                        onClick={() => openModal(url)}
                    />
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{headerText}</h3>
                    <p className="text-gray-600 text-base mb-5 leading-relaxed">{paragraphText}</p>
                    <button
                        className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center mx-auto"
                        onClick={() => openModal(url)}
                    >
                        <FaPlay className="mr-2" /> Цъкни ТУК
                    </button>
                </div>
            </div>
        </div>
    );
}
