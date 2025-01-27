'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface VideoModalProps {
    videoData: Uint8Array | null;
    isOpen: boolean;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoData, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 9999 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        >
            <div className="relative bg-gray-900 p-5 rounded-lg shadow-lg max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 p-5 rounded-full"
                >
                    ✕
                </button>
                {videoData ? (
                    <video
                        controls
                        autoPlay
                        className="w-full h-auto max-h-[80vh] rounded-lg"
                        src={(() => {
                            try {
                                const blob = new Blob([videoData], { type: 'video/mp4' });
                                return URL.createObjectURL(blob);
                            } catch (error) {
                                console.error('Error creating video Blob:', error);
                                return undefined;
                            }
                        })()}
                    />
                ) : (
                    <p className="text-white">Видео не е налично</p>
                )}
            </div>
        </motion.div>
    );
};

export default VideoModal;
