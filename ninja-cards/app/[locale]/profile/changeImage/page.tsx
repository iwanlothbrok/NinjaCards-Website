"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";
import "react-image-crop/dist/ReactCrop.css";

type AlertColor = "green" | "red";
interface Alert {
    message: string;
    title: string;
    color: AlertColor;
}

export default function ProfileImageUploader() {
    const t = useTranslations("ChangeImage");
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: "%", width: 60, height: 60, x: 20, y: 20 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);

    const imageRef = useRef<HTMLImageElement | null>(null);
    const MAX_BYTES = 2.5 * 1024 * 1024;

    const showAlert = (message: string, title: string, color: AlertColor) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > MAX_BYTES) {
                setImageError(t("errors.fileTooLarge", { size: "2.5MB" }));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setImageError(null);
                setCroppedImageUrl(null);
            };
            reader.readAsDataURL(file);
        },
        [t]
    );

    const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        imageRef.current = e.currentTarget;
    }, []);

    const getCroppedImg = useCallback(async (): Promise<File | null> => {
        if (!completedCrop || !imageRef.current) return null;

        const img = imageRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, completedCrop.width * scaleX);
        canvas.height = Math.max(1, completedCrop.height * scaleY);

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            img,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) return resolve(null);
                    setCroppedImageUrl(URL.createObjectURL(blob));
                    resolve(new File([blob], "profile.jpg", { type: "image/jpeg" }));
                },
                "image/jpeg",
                0.9
            );
        });
    }, [completedCrop]);

    useEffect(() => {
        if (completedCrop) getCroppedImg();
    }, [completedCrop, getCroppedImg]);

    const handleUpload = async () => {
        const file = await getCroppedImg();
        if (!file || !user) {
            showAlert(t("alerts.selectAndCrop"), t("alerts.warning"), "red");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("id", String(user.id));
            formData.append("image", file);

            const res = await fetch(`${BASE_API_URL}/api/profile/changeImage`, {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                showAlert(result?.error || t("alerts.uploadFailed"), t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.uploadSuccess"), t("alerts.success"), "green");
            setTimeout(() => router.push("/profile"), 1200);
        } catch {
            showAlert(t("alerts.uploadFailed"), t("alerts.error"), "red");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!user?.id) return;

        try {
            const res = await fetch(
                `${BASE_API_URL}/api/profile/removeUsersImage?id=${user.id}`,
                { method: "DELETE" }
            );

            const result = await res.json();
            if (!res.ok) {
                showAlert(result?.error || t("alerts.updateFailed"), t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.removedSuccess"), t("alerts.success"), "green");
        } catch {
            showAlert(t("alerts.unexpected"), t("alerts.error"), "red");
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <img src="/load.gif" className="w-24 h-24 animate-spin" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-lg">{t("subtitle")}</p>
                    </div>

                    {alert && (
                        <div
                            className={`rounded-xl p-4 text-center font-medium ${alert.color === "green"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            <strong>{alert.title}:</strong> {alert.message}
                        </div>
                    )}

                    {/* Current image */}
                    {user?.image && (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={`data:image/jpeg;base64,${user.image}`}
                                className="w-36 h-36 rounded-full border-4 border-amber-500/30 object-cover"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                                {t("buttons.remove")}
                            </button>
                        </div>
                    )}

                    {/* Upload */}
                    <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-4">
                        <label className="block text-sm font-medium text-gray-300">
                            {t("labels.photo")}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-300
              file:mr-4 file:rounded-lg file:border-0
              file:bg-amber-600 file:px-4 file:py-2 file:text-black
              hover:file:bg-amber-500"
                        />
                        {imageError && <p className="text-sm text-red-400">{imageError}</p>}
                    </div>

                    {/* Crop */}
                    {imageSrc && (
                        <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-6">
                            <ReactCrop
                                crop={crop}
                                onChange={setCrop}
                                onComplete={(c) => setCompletedCrop(c as PixelCrop)}
                                aspect={1}
                                keepSelection
                            >
                                <img src={imageSrc} ref={imageRef} onLoad={onLoad} />
                            </ReactCrop>

                            {croppedImageUrl && (
                                <div className="text-center">
                                    <p className="text-gray-400 mb-2">{t("preview.title")}</p>
                                    <img
                                        src={croppedImageUrl}
                                        className="mx-auto w-40 h-40 rounded-full border-4 border-amber-500/40 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            {t("buttons.back")}
                        </button>

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold"
                        >
                            {t("buttons.save")}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
