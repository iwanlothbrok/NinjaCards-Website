import React from 'react';
import Image from 'next/image';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure
import { BASE_API_URL } from '@/utils/constants';

interface SocialMediaLinksProps {
    user: User | null;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user }) => {
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
                {socialMediaLinks.map((link) =>
                    link.url && (
                        <a
                            key={link.key}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className="relative group"
                            onClick={() => handleLinkClick()} // Invoke API on link click
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
            </div>
        </div>
    );
};

export default SocialMediaLinks;
