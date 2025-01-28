"use client";

import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@/app/context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";

const VideoUpload = () => {
    const { user } = useAuth();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
        message: "",
        type: null,
    });

    useEffect(() => {
        if (user?.videoUrl) {
            setVideoUrl(user.videoUrl); // Set video URL if it exists in user profile
        }
    }, [user]);

    const handleUpload = async (result: any) => {
        console.log("Upload Result:", result);

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
                    console.log("✅ Video URL saved successfully");
                    setAlert({ message: "Видеото беше качено успешно!", type: "success" });
                } else {
                    console.error("❌ Failed to save video URL");
                    setAlert({ message: "Грешка при запазване на видеото", type: "error" });
                }
            } catch (error) {
                console.error("❌ Error saving video URL:", error);
                setAlert({ message: "Възникна неочаквана грешка", type: "error" });
            } finally {
                setLoading(false);
            }
        } else {
            console.error("❌ Upload failed or no secure_url found.");
            setAlert({ message: "Качването на видеото не бе успешно", type: "error" });
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
                console.log("✅ Видеото беше премахнато успешно");
                setVideoUrl(null);
                setAlert({ message: "✅ Видеото беше премахнато успешно!", type: "success" });
            } else {
                const errorData = await response.json();
                console.error("❌ Грешка при премахването на видеото:", errorData.error);
                setAlert({ message: `❌ ${errorData.error}`, type: "error" });
            }
        } catch (error) {
            console.error("❌ Възникна неочаквана грешка:", error);
            setAlert({ message: "❌ Възникна неочаквана грешка", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Качване на видео</h2>

            {/* Alerts */}
            {alert.message && (
                <div className={`p-3 rounded text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                    {alert.message}
                </div>
            )}

            {/* Upload Video */}
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
                        className="py-2 px-6 mt-4 rounded-lg bg-orange text-white font-semibold w-full"
                        disabled={loading}
                    >
                        {loading ? "Качване..." : "Качи Видео"}
                    </button>
                )}
            </CldUploadWidget>
            <button
                onClick={handleRemoveVideo}
                className="mt-4 py-2 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold w-full"
                disabled={loading}
            >
                {loading ? "Премахване..." : "Премахни видеото"}
            </button>
            {/* Display Uploaded Video & Remove Button */}
            {videoUrl && (
                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold">Качено видео:</h3>
                    <video controls className="w-full mt-4 rounded-lg shadow border-2 border-gray-700">
                        <source src={videoUrl} type="video/mp4" />
                        Вашият браузър не поддържа видеото.
                    </video>

                    {/* Remove Video Button */}

                </div>
            )}
        </div>
    );
};

export default VideoUpload;
