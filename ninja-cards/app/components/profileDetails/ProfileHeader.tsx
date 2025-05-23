"use client";

import React from "react";
import CoverImage from "./CoverImage"; // Import the CoverImage component
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

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


        return (
            <div id="profile-content" className={`relative ${cardStyle.bgClass}`}>
                {/* Cover Section */}
                <CoverImage
                    coverPreview={coverPreview}
                    userCoverImage={user.coverImage || ""}
                    height="270px"
                />

                {/* Circular Profile Image Positioned on Top */}
                <div
                    className={`absolute mt-10 top-40 left-1/2 transform -translate-x-1/2 z-10 ${cardStyle.bgClass}  rounded-full shadow-lg`}
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
                {user?.id === currentUser?.id && (
                    <div className="absolute top-5 left-5 right-5 z-40 flex space-x-2">
                        <label
                            htmlFor="cover-upload"
                            className="bg-gray-900 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all"
                        >
                            Промени корицата
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
                                    Запази
                                </button>
                                <button
                                    onClick={cancelCover}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all"
                                >
                                    Откажи
                                </button>
                            </>
                        )}

                    </div>
                )}
                {/* Upload and Save/Cancel Buttons */}

                <div
                    className={`relative w-full max-w-md ${cardStyle.bgClass} z-0 pt-24 -mt-17 mx-auto rounded-none`}
                >
                    <div className="text-center mt-8">
                        <h1 className={`text-4xl font-bold ${cardStyle.highlightClass}`}>
                            {user?.name || '\u00A0'}
                        </h1>
                        {user?.company ? (
                            <p className={`text-2xl font-semibold mt-1 ${cardStyle.textClass}`}>
                                {user?.company}
                            </p>
                        ) : (
                            '\u00A0'
                        )}
                        {user?.position ? (
                            <p className={`text-xl font-semibold ${cardStyle.textClass}`}>
                                {user?.position}
                            </p>
                        ) : (
                            '\u00A0'
                        )}
                    </div>
                </div>

            </div>
        );
    };

export default ProfileHeader;
