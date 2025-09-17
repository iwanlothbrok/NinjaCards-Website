"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineDownload } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const QRCodeDownload: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const t = useTranslations("ProfileQR");

    if (!user || !user.qrCode) {
        return (
            <p className="text-center text-gray-400">
                {t("noQr")}
            </p>
        );
    }

    const downloadQRCode = () => {
        const link = document.createElement("a");
        link.href = user.qrCode;
        link.download = `${user.name}_QRCode.png`;
        link.click();
    };

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    };

    const handleShare = () => {
        const qrBlob = dataURLtoBlob(user.qrCode);
        const qrFile = new File([qrBlob], `${user.name}_QRCode.png`, {
            type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [qrFile] })) {
            navigator
                .share({
                    files: [qrFile],
                    title: t("share.title"),
                    text: t("share.text", { name: user.name }),
                })
                .catch((error) => console.log("Error sharing", error));
        } else {
            alert(t("share.unsupported"));
        }
    };

    return (
        <div className="p-4">
            <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    {t("heading")}
                </h2>

                <div className="flex flex-col items-center mb-6">
                    {/* Profile Image */}
                    {user.image && (
                        <Image
                            src={`data:image/jpeg;base64,${user.image}`}
                            alt={t("alt.profileImage", {
                                name: `${user.firstName} ${user.lastName}`,
                            })}
                            width={120}
                            height={120}
                            className="w-40 h-40 rounded-full border-4 border-orange-400 shadow-lg mb-4"
                            loading="lazy"
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 1024px"
                        />
                    )}

                    {/* User Name + Company */}
                    <p className="text-xl font-semibold text-white">{user.name}</p>
                    {user.company && (
                        <p className="text-lg font-semibold text-white mb-4">
                            {user.company}
                        </p>
                    )}

                    {/* QR Code */}
                    <div className="bg-orange-500 p-4 rounded-lg shadow-lg mb-4">
                        <img
                            src={user.qrCode}
                            alt={t("alt.qr")}
                            className="w-40 h-40 rounded-md shadow-md"
                            loading="lazy"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={downloadQRCode}
                            className="flex items-center bg-orange text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-orange-300"
                        >
                            <AiOutlineDownload className="mr-2 text-4xl" />
                            {t("actions.download")}
                        </button>
                        <button
                            className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
                            onClick={handleShare}
                        >
                            <FiSend className="mr-2 text-4xl" />
                            {t("actions.share")}
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        {t("actions.back")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDownload;
