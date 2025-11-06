"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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

const ProfileImageUploader: React.FC = () => {
    const t = useTranslations("ChangeImage");
    const { user, setUser } = useAuth();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: "%", width: 60, height: 60, x: 20, y: 20 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const router = useRouter();

    const MAX_BYTES = 2.5 * 1024 * 1024; // 2.5MB

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
                setImageSrc(null);
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

    const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        imageRef.current = event.currentTarget as HTMLImageElement;
    }, []);

    const getCroppedImg = useCallback(async (): Promise<File | null> => {
        if (!completedCrop || !imageRef.current) return null;

        const img = imageRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(completedCrop.width * scaleX));
        canvas.height = Math.max(1, Math.floor(completedCrop.height * scaleY));

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Optional: fill white background (better JPEG look if input had transparency)
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

        return new Promise<File | null>((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) return resolve(null);
                    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
                    const previewUrl = URL.createObjectURL(blob);
                    setCroppedImageUrl(previewUrl);
                    resolve(file);
                },
                "image/jpeg",
                0.9
            );
        });
    }, [completedCrop]);

    useEffect(() => {
        if (completedCrop) {
            // generate preview silently (non-blocking)
            getCroppedImg();
        }
    }, [completedCrop, getCroppedImg]);

    const handleUpload = async () => {
        const croppedFile = await getCroppedImg();
        if (!croppedFile) {
            showAlert(t("alerts.selectAndCrop"), t("alerts.warning"), "red");
            return;
        }
        if (!user) {
            showAlert(t("alerts.notAuthenticated"), t("alerts.warning"), "red");
            return;
        }

        setLoading(true);
        setImageError(null);

        try {
            const formData = new FormData();
            formData.append("id", String(user.id));
            formData.append("image", croppedFile);

            const response = await fetch(`${BASE_API_URL}/api/profile/changeImage`, {
                method: "PUT",
                body: formData
            });

            const result = await response.json().catch(() => null);

            if (!response.ok || !result) {
                const msg = result?.error || t("alerts.uploadFailed");
                console.error("Upload error:", msg, result?.details);
                showAlert(msg, t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);

            setImageSrc(null);
            setCroppedImageUrl(null);
            showAlert(t("alerts.uploadSuccess"), t("alerts.success"), "green");

            setTimeout(() => router.push("/profile"), 1500);
        } catch (err) {
            console.error("Upload exception:", err);
            showAlert(t("alerts.uploadFailed"), t("alerts.error"), "red");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!user || !user.id) return;

        window.scrollTo({ top: 0, behavior: "smooth" });

        try {
            const response = await fetch(
                `${BASE_API_URL}/api/profile/removeUsersImage?id=${encodeURIComponent(String(user.id))}`,
                { method: "DELETE" }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok || !result) {
                const msg = result?.error || t("alerts.updateFailed");
                console.error("Remove image error:", msg, result?.details);
                showAlert(msg, t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.removedSuccess"), t("alerts.success"), "green");
        } catch (e) {
            showAlert(t("alerts.unexpected"), t("alerts.error"), "red");
        }
    };

    return (
        <div className="p-4">
            <div
                className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800
        rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    📸 {t("title")}
                </h2>

                {alert && (
                    <div
                        className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300
            ${alert.color === "green" ? "bg-green-500" : "bg-red-500"} animate-fadeIn`}
                        role="status"
                        aria-live="polite"
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {/* Current image + remove */}
                {user?.image && (
                    <div className="flex flex-col items-center mb-6">
                        <img
                            loading="lazy"
                            src={`data:image/jpeg;base64,${user.image}`}
                            alt={t("a11y.currentAvatar", { name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || t("a11y.user") })}
                            className="w-40 h-40 rounded-full border-4 border-teal-400 shadow-lg mb-4 object-cover"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-red-400"
                        >
                            🗑️ {t("buttons.remove")}
                        </button>
                    </div>
                )}

                {/* File input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {t("labels.photo")}
                    </label>
                    {imageError && <div className="text-red-500 mb-2">{imageError}</div>}

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-700 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer
              file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-orange file:hover:bg-opacity-70 file:text-white
              rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label={t("a11y.fileInput")}
                    />
                    <p className="text-xs text-gray-400 mt-2">{t("hints.maxSize", { size: "2.5MB" })}</p>
                </div>

                {/* Cropper */}
                {imageSrc && (
                    <>
                        <ReactCrop
                            crop={crop}
                            onChange={(c: Crop) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c as PixelCrop)}
                            aspect={1}
                            keepSelection
                            circularCrop={false}
                        >
                            <img
                                src={imageSrc}
                                ref={imageRef}
                                onLoad={onLoad}
                                alt={t("a11y.cropPreview")}
                                className="max-w-full rounded-lg shadow-md"
                            />
                        </ReactCrop>

                        {croppedImageUrl && (
                            <div>
                                <h4 className="mt-4 text-gray-300">🔍 {t("preview.title")}</h4>
                                <img
                                    alt={t("preview.alt")}
                                    className="max-w-full mt-4 rounded-lg shadow-lg"
                                    src={croppedImageUrl}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600
              focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        {t("buttons.back")}
                    </button>
                    <button
                        type="button"
                        className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg
              hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform
              transform hover:scale-105 shadow-lg tracking-wide"
                        disabled={loading}
                        onClick={handleUpload}
                    >
                        {loading ? t("buttons.saving") : t("buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileImageUploader;
