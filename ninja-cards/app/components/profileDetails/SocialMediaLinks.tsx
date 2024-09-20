import React from 'react';
import Image from 'next/image';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure

interface SocialMediaLinksProps {
    user: User | null;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user }) => {
    const socialMediaLinks = [
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
        { key: 'viber', url: user?.viber ? `viber://chat?number=${user.viber}` : null, logo: '/logos/viber.png', label: 'Viber', gradient: 'from-purple-500 to-purple-700' },
        { key: 'whatsapp', url: user?.whatsapp ? `https://wa.me/${user.whatsapp}` : null, logo: '/logos/wa.png', label: 'WhatsApp', gradient: 'from-green-600 to-green-700' },
        { key: 'website', url: user?.website, logo: '/logos/website.png', label: 'Website', gradient: 'from-cyan-600 to-cyan-800' },
        { key: 'revolut', url: user?.revolut ? `https://revolut.me/${user.revolut}` : null, logo: '/logos/rev.png', label: 'Revolut', gradient: 'from-blue-800 to-blue-900' },
        { key: 'googleReview', url: user?.googleReview, logo: '/logos/gr.png', label: 'Google Review', gradient: 'from-blue-500 to-blue-300' },
    ];

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
                        >
                            <div className={`bg-gradient-to-r ${link.gradient} filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center`}>
                                <Image
                                    src={link.logo}
                                    alt={link.label}
                                    width={48}
                                    height={48}
                                    className="object-contain transition-all duration-300"
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
