"use client";

import React, { useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css"; // Import cropper styles
import { useAuth } from "../../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import ProfileHeader from "../../components/profileDetails/ProfileHeader";
import { useTranslations } from "next-intl";
import CoverImage from "../../components/profileDetails/CoverImage";
import { FaUserCircle } from "react-icons/fa";
import { set } from "date-fns";

interface Alert {
    message: string;
    title: string;
    color: string;
}

const CoverComponent: React.FC = () => {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [, setFileForUpload] = useState<File | null>(null);
    const [cropper, setCropper] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const { user, setUser, loading } = useAuth();
    const [currentLoading, setCurrentLoading] = useState(false);
    const t = useTranslations("cropModal");

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (!validFileTypes.includes(file.type)) {
                showAlert(t("alerts.invalidType"), t("alerts.error"), "red");
                return;
            }

            if (file.size > maxSizeInBytes) {
                showAlert(t("alerts.fileTooLarge"), t("alerts.error"), "red");
                return;
            }

            setCoverPreview(URL.createObjectURL(file));
            setFileForUpload(file);
        }
    };

    const cropImage = () => {
        if (!cropper) {
            showAlert(t("alerts.noImageSelected"), "Грешка", "red");
            return;
        }

        const croppedCanvas = cropper.getCroppedCanvas();
        if (!croppedCanvas) {
            showAlert(t("alerts.cropFailed"), "Грешка", "red");
            return;
        }

        croppedCanvas.toBlob((blob: any) => {
            if (!blob) {
                showAlert(t("alerts.cropFailed"), "Грешка", "red");
                return;
            }

            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (blob.size > maxSizeInBytes) {
                showAlert(t("alerts.fileTooLarge"), "Грешка", "red");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the cropped image as the new cover image
                setCroppedImage(reader.result as string);
                // Clear the preview since the image is cropped and ready to save
                setCoverPreview(null);
            };
            reader.readAsDataURL(blob);
        }, "image/jpeg");
    };


    const zoomIn = () => {
        if (cropper) cropper.zoom(0.1); // Zoom in by 10%
    };

    const zoomOut = () => {
        if (cropper) cropper.zoom(-0.1); // Zoom out by 10%
    };

    const resetZoom = () => {
        if (cropper) cropper.reset();
    };

    const saveCover = async () => {
        if (!croppedImage) {
            showAlert(t("alerts.noImageSelected"), "Грешка", "red");
            return;
        }

        if (!user?.id) {
            showAlert(t("alerts.userNotAuthenticated"), "Грешка", "red");
            return;
        }

        setCurrentLoading(true);

        try {
            if (!croppedImage.startsWith('data:image')) {
                throw new Error(t("alerts.noImageSelected"));
            }

            const response = await fetch(`${BASE_API_URL}/api/profile/uploadCover`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, coverImage: croppedImage }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || t("alerts.coverSaveError"));
            }

            const result = await response.json();

            if (!result.coverImage) {
                throw new Error(t("alerts.coverSaveError"));
            }

            const updated = { ...user, coverImage: result.coverImage };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));

            showAlert(t("alerts.coverSaved"), t("alerts.success"), "green");
            cancelCover();
        } catch (error) {
            showAlert(
                t("alerts.coverSaveError"),
                t("alerts.error"),
                "red"
            );
        } finally {
            cancelCover();

        }
    };

    const cancelCover = () => {
        setCoverPreview(null);
        setFileForUpload(null);
        setCroppedImage(null);
        setCurrentLoading(false);
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    const cardStyle = {
        bgClass: 'bg-white',
        borderClass: 'border-blue-500',
        highlightClass: 'text-gray-900',
        textClass: 'text-gray-700',
    };

    if (loading || currentLoading) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <img src="/load.gif" alt="" className="w-24 h-24 animate-spin" />
        </div>);
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black sm:pt-44 pt-44">
            {/* Alert Section */}
            {alert && (
                <div
                    className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md p-6 rounded-2xl shadow-2xl transition-all duration-300 z-50 backdrop-blur-lg border
                                ${alert.color === 'green'
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/50 shadow-green-500/20'
                            : 'bg-gradient-to-br from-red-500/20 to-rose-600/20 border-red-500/50 shadow-red-500/20'} 
                                animate-fadeIn`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`text-2xl ${alert.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                            {alert.color === 'green' ? '✓' : '✕'}
                        </div>
                        <div className="flex-1">
                            <strong className={`block font-bold mb-1 ${alert.color === 'green' ? 'text-green-300' : 'text-red-300'}`}>
                                {alert.title}
                            </strong>
                            <p className="text-gray-200 text-sm leading-relaxed">{alert.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange to-amber-600 bg-clip-text text-transparent mb-4">
                    {t("title")}
                </h1>
                <p className="text-gray-400 text-lg">{t("subtitle")}</p>
            </div>

            {/* Profile Header */}
            <div className="relative w-full max-w-[375px] mx-auto">
                <div className="relative min-h-screen">
                    {/* Cover Section with Gradient Overlay */}
                    <div className="relative">
                        <CoverImage
                            coverPreview={croppedImage || coverPreview}
                            userCoverImage={user?.coverImage || ""}
                            height="270px"
                        />
                        <div className="absolute inset-0 h-270px bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                    </div>

                    {/* Circular Profile Image */}
                    <div
                        className={`absolute mt-10 top-40 left-1/2 transform -translate-x-1/2 z-10 rounded-full shadow-2xl ring-4 ring-black`}
                    >
                        <div
                            className={`w-44 h-44 rounded-full overflow-hidden border-4 ${cardStyle.borderClass} bg-gradient-to-br from-gray-800 to-black backdrop-blur-md`}
                        >
                            {user?.image ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={`data:image/jpeg;base64,${user.image}`}
                                    alt="Profile"
                                />
                            ) : (
                                <FaUserCircle className="w-full h-full text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Cover edit buttons */}
                    {user?.id === user?.id && (
                        <div className="absolute top-5 left-5 right-5 z-30 md:z-40 flex flex-wrap justify-center gap-3">
                            <label
                                htmlFor="cover-upload"
                                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2.5 rounded-full cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all text-sm sm:text-base font-semibold border border-gray-600 hover:border-gray-500 shadow-lg backdrop-blur-sm"
                            >
                                {t("changeCover")}
                            </label>
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverChange}
                            />
                            {croppedImage && (
                                <>
                                    <button
                                        onClick={saveCover}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-full hover:from-green-500 hover:to-emerald-500 transition-all text-sm sm:text-base font-semibold border border-green-500 shadow-lg shadow-green-500/20 backdrop-blur-sm"
                                    >
                                        {t("save")}
                                    </button>
                                    <button
                                        onClick={cancelCover}
                                        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2.5 rounded-full hover:from-gray-700 hover:to-gray-800 transition-all text-sm sm:text-base font-semibold border border-gray-600 shadow-lg backdrop-blur-sm"
                                    >
                                        {t("cancel")}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Profile Info Section */}
                    <div
                        className={`relative w-full bg-gradient-to-b from-black/80 to-black z-0 pt-24 -mt-17 mx-auto rounded-t-3xl shadow-2xl backdrop-blur-md border-t border-gray-800`}
                    >
                        <div className="mt-6 px-4 text-center">
                            <h1
                                className={[
                                    "font-bold leading-tight tracking-[-0.01em]",
                                    "mx-auto max-w-[20ch] break-words hyphens-auto [text-wrap:balance]",
                                    "text-[clamp(30px,6vw,42px)] sm:text-[clamp(32px,5vw,46px)]",
                                    "bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent",
                                ].join(" ")}
                            >
                                {user?.name ? (
                                    user.name.split(/\s+/).map((part: string, i: number) => (
                                        <span key={i} className="block">
                                            {part}
                                        </span>
                                    ))
                                ) : (
                                    "\u00A0"
                                )}
                            </h1>

                            {user?.company && (
                                <div className="mt-2 flex justify-center">
                                    <span
                                        className={[
                                            "inline-flex items-center gap-1 rounded-full",
                                            "px-3 py-1",
                                            "bg-gradient-to-r from-gray-800 to-gray-900 ring-1 ring-gray-700",
                                            "uppercase tracking-widest",
                                            "text-[clamp(14px,2.9vw,16px)]",
                                            "font-semibold text-gray-300",
                                        ].join(" ")}
                                    >
                                        {user?.company}
                                    </span>
                                </div>
                            )}

                            {user?.position && (
                                <p
                                    className={[
                                        "mt-2 font-light italic leading-snug",
                                        "mx-auto max-w-[28ch] break-words hyphens-auto [text-wrap:pretty]",
                                        "text-[clamp(16px,3.6vw,18px)] sm:text-[clamp(15px,3vw,19px)]",
                                        "text-gray-400",
                                    ].join(" ")}
                                >
                                    {user?.position}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Cover Preview Modal */}
            {coverPreview && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 overflow-auto p-4">
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 p-8 rounded-3xl w-11/12 max-w-3xl mx-auto shadow-2xl border border-gray-700/50">
                        <h2 className="text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-bold mb-8">
                            {t("title")}
                        </h2>
                        <div className="rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl ring-1 ring-white/5">
                            <Cropper
                                style={{ height: "auto", width: "100%" }}
                                initialAspectRatio={16 / 9}
                                aspectRatio={16 / 9}
                                src={coverPreview}
                                viewMode={1}
                                guides={true}
                                zoomable={true}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false}
                                onInitialized={(instance) => setCropper(instance)}
                            />
                        </div>

                        <div className="mt-8">
                            {/* Zoom Controls */}
                            <div className="flex justify-center space-x-3 mb-6">
                                <button
                                    onClick={zoomOut}
                                    className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 text-white px-6 py-3 rounded-xl hover:from-gray-600/80 hover:to-gray-700/80 transition-all duration-300 font-medium shadow-lg border border-gray-600/50 hover:border-gray-500/70 backdrop-blur-sm"
                                >
                                    {t("zoomOut")}
                                </button>
                                <button
                                    onClick={zoomIn}
                                    className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 text-white px-6 py-3 rounded-xl hover:from-gray-600/80 hover:to-gray-700/80 transition-all duration-300 font-medium shadow-lg border border-gray-600/50 hover:border-gray-500/70 backdrop-blur-sm"
                                >
                                    {t("zoomIn")}
                                </button>
                                <button
                                    onClick={resetZoom}
                                    className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 text-white px-6 py-3 rounded-xl hover:from-gray-600/80 hover:to-gray-700/80 transition-all duration-300 font-medium shadow-lg border border-gray-600/50 hover:border-gray-500/70 backdrop-blur-sm"
                                >
                                    {t("reset")}
                                </button>
                            </div>

                            {/* Save and Cancel */}
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setCoverPreview(null)}
                                    className="bg-gradient-to-r from-red-600/80 to-rose-600/80 text-white px-8 py-3 rounded-xl hover:from-red-500/90 hover:to-rose-500/90 transition-all duration-300 font-medium shadow-lg shadow-red-500/30 border border-red-500/50 backdrop-blur-sm"
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    onClick={cropImage}
                                    className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white px-8 py-3 rounded-xl hover:from-green-500/90 hover:to-emerald-500/90 transition-all duration-300 font-medium shadow-lg shadow-green-500/30 border border-green-500/50 backdrop-blur-sm"
                                >
                                    {t("crop")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CoverComponent;
