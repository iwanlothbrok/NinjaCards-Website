import React from 'react';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure

interface SocialMediaLinksProps {
    user: User | null;
    cardStyle: any;
}

// Use local paths for the icons
const socialMediaIcons = {
    facebook: '/public/logos/fb.png',
    instagram: '/public/logos/ig.png',
    tiktok: '/public/logos/tiktok.png',
};

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user, cardStyle }) => {
    const socialMediaLinks = [
        { key: 'facebook', url: user?.facebook, iconUrl: socialMediaIcons.facebook, label: 'Facebook', gradient: 'from-blue-600 to-purple-600' },
        { key: 'instagram', url: user?.instagram, iconUrl: socialMediaIcons.instagram, label: 'Instagram', gradient: 'from-yellow-500 to-red-700' },
        { key: 'tiktok', url: user?.tiktok, iconUrl: socialMediaIcons.tiktok, label: 'TikTok', gradient: 'from-indigo-600 to-fuchsia-600' },
    ];

    return (
        <div className="mt-10 text-center">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
                {socialMediaLinks.map((link) => (
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
                                {/* Use img tag with the local path */}
                                <img
                                    src={link.iconUrl}
                                    alt={link.label}
                                    width={48}
                                    height={48}
                                    className="object-contain transition-all duration-300"
                                />
                            </div>
                        </a>
                    )
                ))}
            </div>
        </div>
    );
};

export default SocialMediaLinks;
