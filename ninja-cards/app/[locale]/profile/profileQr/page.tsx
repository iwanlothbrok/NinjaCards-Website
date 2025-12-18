"use client";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineDownload } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function QRCodeDownload() {
    const { user } = useAuth();
    const router = useRouter();
    const t = useTranslations("ProfileQR");

    if (!user || !user.qrCode) {
        return (
            <div className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
                <p className="text-center text-gray-400">{t("noQr")}</p>
            </div>
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

        if (navigator.canShare?.({ files: [qrFile] })) {
            navigator.share({
                files: [qrFile],
                title: t("share.title"),
                text: t("share.text", { name: user.name }),
            });
        } else {
            alert(t("share.unsupported"));
        }
    };

    return (
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
                        {t("heading")}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* QR Card */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-8 text-center space-y-6"
                >
                    {/* Profile */}
                    <div className="flex flex-col items-center gap-2">
                        {user.image && (
                            <Image
                                src={`data:image/jpeg;base64,${user.image}`}
                                alt={t("alt.profileImage", {
                                    name: `${user.firstName} ${user.lastName}`,
                                })}
                                width={160}
                                height={160}
                                className="w-36 h-36 rounded-full border-4 border-amber-500/40 object-cover"
                                unoptimized
                            />
                        )}
                        <p className="text-xl font-semibold text-white">{user.name}</p>
                        {user.position && (
                            <p className="text-gray-400 -m-1">{user.position}</p>
                        )}
                        {user.company && (
                            <p className="text-gray-400 -m-2">{user.company}</p>
                        )}
                    </div>

                    {/* QR */}
                    <div className="flex justify-center">
                        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-700">
                            <img
                                src={user.qrCode}
                                alt={t("alt.qr")}
                                className="w-44 h-44 rounded-lg bg-white p-2"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button
                            onClick={downloadQRCode}
                            className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold transition flex items-center justify-center gap-2"
                        >
                            <AiOutlineDownload className="text-xl" />
                            {t("actions.download")}
                        </button>

                        <button
                            onClick={handleShare}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700 transition flex items-center justify-center gap-2"
                        >
                            <FiSend className="text-lg" />
                            {t("actions.share")}
                        </button>
                    </div>
                </motion.section>

                {/* Back */}
                <div className="flex justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                    >
                        {t("actions.back")}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
