"use client";

import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

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
        return (
            <div
                className={`relative flex flex-col items-center bg-cover bg-center bg-no-repeat ${cardStyle.opposite} pt-72 overflow-hidden`}
                style={{
                    backgroundImage: coverPreview
                        ? `url(${coverPreview})`
                        : `url(${user.coverImage || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Circular profile image */}
                <div
                    className={`absolute top-20 rounded-full mt-32 bg-${cardStyle.name} shadow-lg`}
                    style={{ zIndex: 20 }}
                >
                    <motion.div
                        className={`w-44 h-44 rounded-full overflow-hidden border-2 ${cardStyle.borderClass}`}
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

                {/* Upload Cover Button */}
                {user?.id && (
                    <div className="absolute top-5 right-5 z-50 flex space-x-2">
                        <label
                            htmlFor="cover-upload"
                            className="bg-gray-900 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all"
                        >
                            Change Cover
                        </label>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />

                        {/* Save and Cancel Buttons */}
                        {coverPreview && (
                            <>
                                <button
                                    onClick={saveCover}
                                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelCover}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* White Background Section */}
                <div
                    className={`relative w-full max-w-md ${cardStyle.bgClass} z-10 pt-24 -mt-17 mx-auto rounded-none`}
                >
                    <div className="text-center mt-8">
                        <h1 className={`text-3xl font-bold ${cardStyle.highlightClass}`}>
                            {user?.name}
                        </h1>
                        <p className={`text-lg mt-1 ${cardStyle.textClass}`}>
                            {user?.position}
                        </p>
                        <p className={`text-lg ${cardStyle.textClass}`}>{user?.company}</p>
                    </div>
                </div>
            </div>
        );
    };

export default ProfileHeader;
