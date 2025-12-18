"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
        nameKey: "docs.profileFunctions",
        url: "/func.pdf",
    },
];

export default function Help() {
    const router = useRouter();
    const t = useTranslations("Help");
    const v = useTranslations("video");

    const [alert, setAlert] = useState<Alert | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    const openModal = (url: string) => {
        setVideoUrl(url);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setVideoUrl("");
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-10">

                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Alert */}
                    {alert && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`rounded-xl p-4 text-center font-medium ${alert.color === "green"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            <strong>{alert.title}:</strong> {alert.message}
                        </motion.div>
                    )}

                    {/* Videos */}
                    <motion.section
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
                    >
                        <FAQVideos
                            imagePath="/features/setUp.jpg"
                            headerText={v("header")}
                            paragraphText={v("paragraph")}
                            url="https://www.youtube.com/embed/5l5N4Q3xVlY?si=K68i6MfrZb0AzO57"
                            openModal={openModal}
                            ctaText={v("cta")}
                        />
                    </motion.section>

                    {/* Documents */}
                    <motion.section
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">
                            📄 {t("documents.title")}
                        </h2>

                        <ul className="space-y-3">
                            {documents.map((doc) => (
                                <li
                                    key={doc.url}
                                    className="flex items-center justify-between rounded-xl bg-gray-900/60 border border-gray-700 px-5 py-3 hover:bg-gray-900 transition"
                                >
                                    <span className="text-gray-200">
                                        {t(doc.nameKey)}
                                    </span>

                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium"
                                    >
                                        <Download className="w-5 h-5" />
                                        {t("buttons.download")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                    {/* Back */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                        >
                            {t("buttons.back")}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Video Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Video Modal"
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            >
                <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                    <iframe
                        width="100%"
                        height="480"
                        src={videoUrl}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Help video"
                    />
                </div>
            </Modal>
        </>
    );
}
