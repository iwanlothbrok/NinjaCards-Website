// FAQVideos.tsx
import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface FAQVideosProps {
    openModal: (url: string) => void;
}

export default function FAQVideos({ openModal }: FAQVideosProps) {

    return (
        <div>
            {/* Секция с карти */}
            <div className="flex justify-center items-center ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-5 gap-8">
                    <div className="max-w-md">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <img
                                src="/features/01.png"
                                alt="Ninja Cards - Смарт Визитка"
                                className="w-full h-52 object-cover cursor-pointer"
                                style={{
                                    transform: 'scale(1.1)', // Scale the first image to zoom slightly
                                    transition: 'transform 0.5s ease-in-out', // Smooth transition for zoom effect
                                }}
                                onClick={() => openModal('https://www.youtube.com/embed/vlpRHfQ-W3E?si=MRGOS-OEeyrw4Ox9')}
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Ninja Cards - Как да използвате нашите NFC смарт визитки</h3>
                                <p className="text-gray-600 mb-4">Ето кратко видео, което показва как да използвате нашите смарт визитки.</p>
                                <button
                                    className="bg-orange text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                                    onClick={() => openModal('https://www.youtube.com/embed/vlpRHfQ-W3E?si=MRGOS-OEeyrw4Ox9')}
                                >
                                    <FaPlay className="mr-2" /> Цъкни ТУК
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
