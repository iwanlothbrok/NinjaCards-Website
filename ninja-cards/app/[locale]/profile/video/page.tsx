"use client";

import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { BASE_API_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";

const VideoUpload = () => {
    const { user } = useAuth();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations("VideoUpload");

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
        message: "",
        type: null,
    });

    useEffect(() => {
        if (user?.videoUrl) {
            setVideoUrl(user.videoUrl);
        }
    }, [user]);

    const handleUpload = async (result: any) => {
        if (result.event === "success" && result.info?.secure_url) {
            const uploadedVideoUrl = result.info.secure_url;
            setVideoUrl(uploadedVideoUrl);

            try {
                setLoading(true);
                const response = await fetch(`${BASE_API_URL}/api/profile/updateVideo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user?.id,
                        videoUrl: uploadedVideoUrl,
                    }),
                });

                if (response.ok) {
                    setAlert({ message: t("alerts.uploadSuccess"), type: "success" });
                } else {
                    setAlert({ message: t("alerts.uploadFail"), type: "error" });
                }
            } catch (error) {
                setAlert({ message: t("alerts.unexpected"), type: "error" });
            } finally {
                setLoading(false);
            }
        } else {
            setAlert({ message: t("alerts.uploadError"), type: "error" });
        }
    };

    const handleRemoveVideo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API_URL}/api/profile/removeVideo`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id }),
            });

            if (response.ok) {
                setVideoUrl(null);
                setAlert({ message: t("alerts.removeSuccess"), type: "success" });
            } else {
                const errorData = await response.json();
                setAlert({ message: errorData.error || t("alerts.removeFail"), type: "error" });
            }
        } catch (error) {
            setAlert({ message: t("alerts.unexpected"), type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
      rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

            <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-wide">
                🎥 {t("title")}
            </h2>

            {alert.message && (
                <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
          ${alert.type === "success" ? "bg-green-500" : "bg-red-500"} animate-fadeIn`}>
                    {alert.message}
                </div>
            )}

            {/* Upload Video Button */}
            <CldUploadWidget
                options={{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                    uploadPreset: "uploads",
                }}
                onSuccess={handleUpload}
            >
                {({ open }) => (
                    <button
                        onClick={() => open()}
                        className="w-full bg-orange text-white py-3 md:py-4 px-6 rounded-lg font-semibold 
              transition-transform transform hover:scale-105 focus:ring-4 focus:ring-orange-300"
                        disabled={loading}
                    >
                        {loading ? t("buttons.uploading") : t("buttons.upload")}
                    </button>
                )}
            </CldUploadWidget>

            {/* Remove Video Button */}
            <button
                onClick={handleRemoveVideo}
                className="w-full mt-4 bg-red-600 text-white py-3 md:py-4 px-6 rounded-lg font-semibold 
          hover:bg-red-700 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-red-400"
                disabled={loading}
            >
                {loading ? t("buttons.removing") : t("buttons.remove")}
            </button>

            {/* Display Uploaded Video */}
            {videoUrl && (
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold text-teal-400">{t("uploadedVideo")}</h3>
                    <video controls className="w-full mt-4 rounded-lg shadow-lg border-2 border-gray-700">
                        <source src={videoUrl} type="video/mp4" />
                        {t("noSupport")}
                    </video>
                </div>
            )}

            {/* Back Button */}
            <div className="flex justify-center mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
            focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                >
                    {t("buttons.back")}
                </button>
            </div>
        </div>
    );
};

export default VideoUpload;
