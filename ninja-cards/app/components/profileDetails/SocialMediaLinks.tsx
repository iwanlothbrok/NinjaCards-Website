'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure
import { BASE_API_URL } from '@/utils/constants';
import { FaPlayCircle } from 'react-icons/fa'; // Video play icon
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface SocialMediaLinksProps {
    user: User | null;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    console.log(user?.video?.data);
    console.log(typeof user?.video?.data); // Should be 'object'
    console.log(user?.video?.data instanceof Uint8Array); // Should return true or false
    console.log(user?.video?.data instanceof ArrayBuffer); // Should return true or false

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
        { key: 'whatsapp', url: user?.whatsapp ? `https://wa.me/${user.whatsapp}` : null, logo: '/logos/wa.png', label: 'WhatsApp', gradient: 'from-green-600 to-green-700' },
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
                {user?.video && (
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
                        style={{
                            zIndex: 2147483647, // Maximum z-index
                            position: 'fixed', // Ensures it's detached from parent stacking contexts
                            inset: 0, // Full-screen modal
                            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark overlay
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px'
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                zIndex: 2147483647,
                                backgroundColor: '#1f2937', // Dark background
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                maxWidth: '1024px',
                                width: '100%',
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setModalOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    backgroundColor: '#e11d48', // Tailwind red-600
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '1.2rem',
                                    zIndex: 2147483647,
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>

                            {/* Video Player */}
                            {user?.video?.data ? (
                                <video
                                    controls
                                    autoPlay
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',
                                        borderRadius: '0.5rem',
                                    }}
                                    src={(() => {
                                        try {
                                            const buffer = new Uint8Array(user.video.data.data); // Convert to Uint8Array
                                            //const buffer = new Uint8Array(user.video?.data || new ArrayBuffer(0)); // Directly use the `data` field
                                            const blob = new Blob([buffer], { type: 'video/mp4' }); // Create a Blob
                                            return URL.createObjectURL(blob); // Generate Blob URL
                                        } catch (error) {
                                            console.error('Error creating video Blob:', error);
                                            return undefined;
                                        }
                                    })()}
                                />
                            ) : (
                                <p style={{ color: 'white' }}>Видео не е налично</p>
                            )}
                        </div>
                    </motion.div>,
                    document.body // Render modal at the root of the DOM
                )}

        </div>
    );
};

export default SocialMediaLinks;