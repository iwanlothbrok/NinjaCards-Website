import React, { useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa'

export default function FAQVideos() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const openModal = (url: string) => {
        setVideoUrl(url);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setVideoUrl('');
    };

    return (
        <div>
            {/* Секция с карти */}
            <div className="flex justify-center items-center ">
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
            </div>
            <header className="mt-0 mb-6 p-6 flex flex-col justify-center items-center text-center ">
                <p className="text-lg max-w-2xl">
                    Имате въпроси? Имаме отговори. Разгледайте нашите често задавани въпроси по-долу или използвайте лентата за търсене, за да намерите това, което търсите.
                </p>
                <div className="mt-8 w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Търсене на отговор на..."
                        className="w-full px-6 py-2 text-lg text-gray-800 rounded-md shadow-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </header>
        </div>
    )
}
