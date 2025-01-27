"use client";

import React, { useState } from "react";
import VideoUpload from "./ChangeVideo";
import { useAuth } from "@/app/context/AuthContext";

const VideoPreview: React.FC = () => {
    const { user } = useAuth();
    const [videoUploaded, setVideoUploaded] = useState(false);

    if (!user) {
        return <p>Потребителят не е удостоверен</p>;
    }

    const handleUploadComplete = (success: boolean) => {
        if (success) {
            setVideoUploaded(true);
        }
    };

    return (
        <>
            {/* Video Upload Component */}
            <VideoUpload onUploadComplete={handleUploadComplete} />
        </>
    );
};

export default VideoPreview;
