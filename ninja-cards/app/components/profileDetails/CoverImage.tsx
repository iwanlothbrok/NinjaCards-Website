"use client";

import React from "react";

const CoverImage: React.FC<{
    coverPreview: string | null;
    userCoverImage: string | null;
    height?: string;
}> = ({ coverPreview, userCoverImage, height = "300px" }) => {
    return (
        <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: coverPreview
                    ? `url(${coverPreview})`
                    : `url(${userCoverImage || ""})`,
                backgroundSize: "cover", // Ensures the image fills the container
                backgroundPosition: "center", // Centers the image in the container
                backgroundRepeat: "no-repeat", // Prevents tiling
                height: height, // Allows height customization
            }}
        >
            {/* Optional Overlay for Logo Visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
    );
};

export default CoverImage;
