// FAQVideos.tsx
import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface FAQVideosProps {
    openModal: (url: string) => void;
}

export default function FAQVideos({ openModal }: FAQVideosProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            {/* Секция с карти */}
            {/* <div className="flex justify-center items-center ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-5 gap-8">
                    <div className="max-w-md">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <img
                                src="/front.png"
                                alt="TAP Metal Card"
                                className="w-full h-68 object-cover cursor-pointer"
                                onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Как да използваме метални карти TAP</h3>
                                <p className="text-gray-600 mb-4">Ето кратко видео, което показва как да използвате нашите метални карти TAP.</p>
                                <button
                                    className="bg-orange text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                                    onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                                >
                                    <FaPlay className="mr-2" /> Гледайте
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <img
                                src="/front.png"
                                alt="TAP PVC Card"
                                className="w-full h-68 object-cover cursor-pointer"
                                onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Как да използваме PVC карти TAP</h3>
                                <p className="text-gray-600 mb-4">Ето кратко видео, което показва как да използвате нашите PVC карти TAP.</p>
                                <button
                                    className="bg-orange text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                                    onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                                >
                                    <FaPlay className="mr-2" /> Гледайте
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
           
        </div>
    );
}
