"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

import FAQVideos from '@/app/askedQuestions/FAQVideos';
import { Download } from 'lucide-react';

interface Alert {
    message: string;
    title: string;
    color: 'green' | 'red';
}

const howToUseUrl01 = 'https://www.youtube.com/embed/5l5N4Q3xVlY?si=K68i6MfrZb0AzO57';
const headerText01 = 'Как да настроиш своята Ninja Card и да активираш всички функции?';
const paragraphText01 = 'Кратко видео, което показва как лесно да въведеш информацията си и да използваш всички възможности на смарт визитката.';
const imagePath01 = '/features/setUp.jpg';

// const howToUseUrl = 'https://www.youtube.com/embed/5l5N4Q3xVlY?si=K68i6MfrZb0AzO57';
// const headerText = 'Ninja Cards - Как да я настроиш?';
// const paragraphText = 'Ето кратко видео, което всички функции на визитката и как да я настроиш.';
// const imagePath = '/features/01.png';


const documents = [
    {
        name: 'Инструкция за потребителя (PDF)',
        url: '/docs/user-guide.pdf',
    },
    {
        name: 'Информация за продукта (PDF)',
        url: '/docs/product-info.pdf',
    },
];

const Help: React.FC = () => {
    const { user } = useAuth();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const router = useRouter();

    const openModal = (url: string) => {
        setVideoUrl(url);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setVideoUrl('');
    };

    const showAlert = (message: string, title: string, color: 'green' | 'red') => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <div className="p-4">
            <div className="w-full max-w-4xl mx-auto mt-36 p-10 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700">
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    📺 Помощ и Инструкции
                </h2>

                {alert && (
                    <div
                        className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                            } animate-fadeIn`}
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                <FAQVideos
                    imagePath={imagePath01}
                    headerText={headerText01}
                    paragraphText={paragraphText01}
                    url={howToUseUrl01}
                    openModal={openModal}
                />

                {/* <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-white mb-4">📄 Документи за изтегляне</h3>
                    <ul className="space-y-3">
                        {documents.map((doc) => (
                            <li key={doc.url} className="flex items-center justify-between bg-gray-700 px-5 py-3 rounded-lg shadow hover:bg-gray-600 transition">
                                <span className="text-white">{doc.name}</span>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange hover:text-yellow-600 flex items-center gap-2"
                                    download
                                >
                                    <Download className="w-5 h-5" /> Изтегли
                                </a>
                            </li>
                        ))}
                    </ul>
                </div> */}

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Video Modal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
                >
                    <div className="relative w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-800 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                        >
                            &times;
                        </button>
                        <iframe
                            width="100%"
                            height="450px"
                            src={videoUrl}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="YouTube video player"
                        />
                    </div>
                </Modal>
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                    focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Help;
