"use client";

import React from "react";
import CoverImage from "./CoverImage";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";

const ProfileHeader: React.FC<{
    user: any;
    cardStyle: any;
    coverPreview: string | null;
    handleCoverChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    saveCover: () => void;
    cancelCover: () => void;
}> = ({
    user,
    cardStyle,
    coverPreview,
    handleCoverChange,
    saveCover,
    cancelCover,
}) => {
        const { user: currentUser } = useAuth();
        const t = useTranslations("profileHeader");

        return (
            <div id="profile-content" className={`relative ${cardStyle.bgClass}`}>
                {/* Cover Section */}
                <CoverImage
                    coverPreview={coverPreview}
                    userCoverImage={user.coverImage || ""}
                    height="270px"
                />

                {/* Circular Profile Image */}
                <div
                    className={`absolute mt-10 top-40 left-1/2 transform -translate-x-1/2 z-10 ${cardStyle.bgClass} rounded-full shadow-lg`}
                >
                    <motion.div
                        className={`w-44 h-44 rounded-full overflow-hidden border-4 ${cardStyle.borderClass}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {user?.image ? (
                            <img
                                className="w-full h-full object-cover"
                                src={`data:image/jpeg;base64,${user.image}`}
                                alt="Profile"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-300" />
                        )}
                    </motion.div>
                </div>

                {/* Cover edit buttons (only if current user) */}
                {user?.id === currentUser?.id && (
                    <div className="absolute top-5 left-5 right-5 z-40 md:z-50 flex space-x-2">
                        <label
                            htmlFor="cover-upload"
                            className="bg-gray-900 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all"
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
                        {coverPreview && (
                            <>
                                <button
                                    onClick={saveCover}
                                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all"
                                >
                                    {t("save")}
                                </button>
                                <button
                                    onClick={cancelCover}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all"
                                >
                                    {t("cancel")}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Profile info */}
                <div
                    className={`relative w-full max-w-md ${cardStyle.bgClass} z-0 pt-24 -mt-17 mx-auto rounded-none`}
                >
                    <div className="mt-6 px-4 text-center">
                        <h1
                            className={[
                                "font-bold leading-tight tracking-[-0.01em]",
                                "mx-auto max-w-[20ch] break-words hyphens-auto [text-wrap:balance]",
                                // fluid size (≈26–40px)
                                "text-[clamp(30px,6vw,42px)] sm:text-[clamp(32px,5vw,46px)]",
                                cardStyle?.highlightClass || "",
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
                                        "bg-slate-300  ring-1 ring-blue-200/60 ",
                                        "uppercase tracking-widest",
                                        // fluid size (≈14–16px)
                                        "text-[clamp(14px,2.9vw,16px)]",
                                        "font-semibold text-gray-900",
                                        // cardStyle?.textClass || "",
                                    ].join(" ")}
                                >
                                    {user?.company}
                                </span>
                            </div>
                        )}

                        {user?.position && (
                            <p
                                className={[
                                    "mt-1 font-light italic leading-snug",
                                    "mx-auto max-w-[28ch] break-words hyphens-auto [text-wrap:pretty]",
                                    // fluid size (≈14–18px)
                                    "text-[clamp(16px,3.6vw,18px)] sm:text-[clamp(15px,3vw,19px)]",
                                    cardStyle?.textClass || "",
                                ].join(" ")}
                            >
                                {user?.position}
                            </p>
                        )}

                    </div>
                </div>
            </div>
        );
    };

export default ProfileHeader;
