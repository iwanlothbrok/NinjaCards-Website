'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { BASE_API_URL } from '@/utils/constants';
import { FaPlayCircle } from 'react-icons/fa'; // Video play icon
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { User } from '@/types/user';

interface SocialMediaLinksProps {
    user: User | null;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const socialMediaLinks = [

        { key: 'website', url: user?.website, logo: '/logos/website.png', label: 'Website', gradient: 'from-cyan-600 to-cyan-800' },
        { key: 'viber', url: user?.viber ? `viber://chat?number=${user.viber}` : null, logo: '/logos/viber.png', label: 'Viber', gradient: 'from-purple-500 to-purple-700' },
        { key: 'pdf', url: user?.pdf ? `${BASE_API_URL}/api/profile/download-pdf/${user.id}` : null, logo: '/logos/pdf.png', label: 'PDF', gradient: 'from-red-500 to-red-700' },
        { key: 'facebook', url: user?.facebook, logo: '/logos/fb.png', label: 'Facebook', gradient: 'from-blue-600 to-purple-600' },
        { key: 'instagram', url: user?.instagram, logo: '/logos/ig.png', label: 'Instagram', gradient: 'from-yellow-500 to-red-700' },
        { key: 'linkedin', url: user?.linkedin, logo: '/logos/lk.png', label: 'LinkedIn', gradient: 'from-blue-700 to-blue-900' },
        { key: 'twitter', url: user?.twitter, logo: '/logos/x.png', label: 'Twitter', gradient: 'from-blue-500 to-cyan-500' },
        { key: 'github', url: user?.github, logo: '/logos/git.png', label: 'GitHub', gradient: 'from-gray-900 to-gray-600' },
        { key: 'youtube', url: user?.youtube, logo: '/logos/youtube.png', label: 'YouTube', gradient: 'from-red-600 to-red-400' },
        { key: 'tiktok', url: user?.tiktok, logo: '/logos/tiktok.png', label: 'TikTok', gradient: 'from-indigo-600 to-fuchsia-600' },
        { key: 'behance', url: user?.behance, logo: '/logos/be.png', label: 'Behance', gradient: 'from-blue-600 to-blue-400' },
        { key: 'paypal', url: user?.paypal, logo: '/logos/icons8-paypal48.png', label: 'PayPal', gradient: 'from-blue-500 to-blue-300' },
        { key: 'trustpilot', url: user?.trustpilot, logo: '/logos/tp.png', label: 'TrustPilot', gradient: 'from-black to-gray-800' },
        { key: 'whatsapp', url: user?.whatsapp && user.whatsapp.length > 5 ? `https://wa.me/${user.whatsapp}` : null, logo: '/logos/wa.png', label: 'WhatsApp', gradient: 'from-green-600 to-green-700' },
        { key: 'revolut', url: user?.revolut ? `https://revolut.me/${user.revolut}` : null, logo: '/logos/rev.png', label: 'Revolut', gradient: 'from-blue-800 to-blue-900' },
        { key: 'googleReview', url: user?.googleReview, logo: '/logos/gr.png', label: 'Google Review', gradient: 'from-blue-700 to-red-700' },

        { key: 'telegram', url: user?.telegram, logo: '/logos/telegram.png', label: 'Тelegram', gradient: 'from-teal-700 to-blue-700' },
        { key: 'calendly', url: user?.calendly, logo: '/logos/calendly.png', label: 'Calendly', gradient: 'from-green-700 to-green-900' },
        { key: 'discord', url: user?.discord, logo: '/logos/discord.png', label: 'Discord', gradient: 'from-indigo-800 to-indigo-950' },
        { key: 'tripadvisor', url: user?.tripadvisor, logo: '/logos/tripadvisor.png', label: 'Tripadvisor', gradient: 'from-green-500 to-yellow-500' },
        // `${BASE_API_URL}/api/profile/updateLinks`
    ];

    const handleLinkClick = async () => {
        if (user?.id) {
            try {
                // Call API to increment social media link clicks
                await fetch(`${BASE_API_URL}/api/dashboard/incrementSocialMediaLinks`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id }),
                });
            } catch (error) {
                console.error("Failed to increment social media link clicks:", error);
            }
        }
    };

    return (
        <div className="mt-10 text-center">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
                {socialMediaLinks.map(
                    (link) =>
                        link.url && (
                            <a
                                key={link.key}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="relative group"
                                onClick={() => handleLinkClick()}
                            >
                                <div className="p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex items-center justify-center bg-white hover:bg-gray-50">
                                    <Image
                                        src={link.logo}
                                        alt={link.label}
                                        width={48}
                                        height={48}
                                        className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </a>
                        )
                )}

                {/* Video Icon */}
                {user?.videoUrl && (
                    <button
                        onClick={() => setModalOpen(true)}
                        aria-label="Watch Video"
                        className="relative group flex items-center justify-center bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
                    >
                        <FaPlayCircle className="text-red-600 text-4xl group-hover:text-red-700 transition-all" />
                    </button>
                )}
            </div>

            {/* Video Modal */}
            {isModalOpen &&
                createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[9999] p-2"
                    >
                        <div className="relative bg-gray-900 p-4 rounded-lg shadow-2xl max-w-sm w-full md:w-[400px]">

                            {/* Close Button */}
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg transition-all"
                                aria-label="Затвори видеото"
                            >
                                ✕
                            </button>

                            {/* Video Player */}
                            {user?.videoUrl ? (
                                <div className="flex flex-col items-center text-center">
                                    <h3 className="text-white text-lg font-semibold mb-3 animate-fadeIn">
                                        Вашето видео
                                    </h3>
                                    <video
                                        controls
                                        className="w-full rounded-xl shadow-lg border-2 border-gray-700 max-h-[70vh]"
                                    >
                                        <source src={user.videoUrl} type="video/mp4" />
                                        Вашият браузър не поддържа видеото.
                                    </video>
                                </div>
                            ) : (
                                <p className="text-white text-center">Няма налично видео</p>
                            )}
                        </div>
                    </motion.div>,
                    document.body // Ensures modal is rendered outside stacking context
                )}

        </div>
    );
};

export default SocialMediaLinks;