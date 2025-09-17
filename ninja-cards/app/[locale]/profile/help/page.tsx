"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import FAQVideos from "../../askedQuestions/FAQVideos";
import { useTranslations } from "next-intl";

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

const documents = [
    {
        nameKey: "docs.profileFunctions", // translation key
        url: "/func.pdf",
    },
];

const Help: React.FC = () => {
    const { user } = useAuth();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const router = useRouter();
    const t = useTranslations("Help");
    const v = useTranslations("video");

    const openModal = (url: string) => {
        setVideoUrl(url);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setVideoUrl("");
    };

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <div className="p-4">
            <div className="w-full max-w-4xl mx-auto mt-36 p-10 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700">
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    📺 {t("title")}
                </h2>

                {alert && (
                    <div
                        className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 ${alert.color === "green" ? "bg-green-500" : "bg-red-500"
                            } animate-fadeIn`}
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                <FAQVideos
                    imagePath="/features/setUp.jpg"
                    headerText={v("header")}
                    paragraphText={v("paragraph")}
                    url="https://www.youtube.com/embed/5l5N4Q3xVlY?si=K68i6MfrZb0AzO57"
                    openModal={openModal}
                    ctaText={v("cta")}   // ✅ now localized
                />

                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                        📄 {t("documents.title")}
                    </h3>
                    <ul className="space-y-3">
                        {documents.map((doc) => (
                            <li
                                key={doc.url}
                                className="flex items-center justify-between bg-gray-700 px-5 py-3 rounded-lg shadow hover:bg-gray-600 transition"
                            >
                                <span className="text-white">{t(doc.nameKey)}</span>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange hover:text-yellow-600 flex items-center gap-2"
                                    download
                                >
                                    <Download className="w-5 h-5" /> {t("buttons.download")}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

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
                        onClick={() => router.push("/profile")}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
              focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        {t("buttons.back")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Help;
