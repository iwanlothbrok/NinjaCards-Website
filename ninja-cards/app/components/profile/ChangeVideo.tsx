"use client";

import React, { useState, useEffect } from "react";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "@/app/context/AuthContext";

interface VideoUploadProps {
    onUploadComplete: (success: boolean) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete }) => {
    const { user, setUser } = useAuth();
    const [video, setVideo] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [existingVideo, setExistingVideo] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
        message: "",
        type: null,
    });

    // Check if video exists for the user

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!video) {
            setAlert({ message: "Моля, изберете видео", type: "error" });
            return;
        }

        if (video.size > 10 * 1024 * 1024) {
            setAlert({ message: "Размерът на видеото не трябва да надвишава 10MB", type: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("id", user?.id || "");
        formData.append("video", video);

        try {
            setUploading(true);
            setAlert({ message: "", type: null });

            const response = await fetch(`${BASE_API_URL}/api/profile/uploadVideo`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setAlert({ message: "Видеото беше качено успешно", type: "success" });
                setExistingVideo(true); // Video successfully uploaded
                onUploadComplete(true);
            } else {
                const error = await response.json();
                setAlert({ message: error.error || "Грешка при качването на видеото", type: "error" });
                onUploadComplete(false);
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            setAlert({ message: "Възникна неочаквана грешка", type: "error" });
            onUploadComplete(false);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveVideo = async () => {
        try {
            setRemoving(true);
            setAlert({ message: "", type: null });

            const response = await fetch(`${BASE_API_URL}/api/profile/removeVideo`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user?.id }),
            });

            if (response.ok) {
                setAlert({ message: "Видеото беше премахнато успешно", type: "success" });
                setExistingVideo(false); // Video removed
                setVideo(null); // Reset selected video
                onUploadComplete(true);
            } else {
                const error = await response.json();
                setAlert({ message: error.error || "Грешка при премахването на видеото", type: "error" });
            }
        } catch (error) {
            console.error("Error removing video:", error);
            setAlert({ message: "Възникна неочаквана грешка", type: "error" });
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Управление на видео</h2>

            {alert.message && (
                <div
                    className={`p-3 rounded ${alert.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
                >
                    {alert.message}
                </div>
            )}

            <div className="space-y-6">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="block w-full text-sm text-white bg-gray-800 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:bg-orange-600"
                />

                {video && (
                    <p className="text-sm text-gray-300">
                        Избрано видео: <span className="text-orange">{video.name}</span>
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`py-3 px-6 rounded-lg text-white bg-orange transition-all ${uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {uploading ? "Качване..." : "Качете"}
                </button>

                <div>
                    <p className="text-sm text-gray-300">Премахване на качено видео:</p>
                    <button
                        onClick={handleRemoveVideo}
                        disabled={removing}
                        className={`py-3 px-6 rounded-lg text-white bg-red-600 hover:bg-red-700" ${removing ? "opacity-50 cursor-not-allowed" : ""
                            } transition-all`}
                    >
                        {"Премахнете видеото"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default VideoUpload;
