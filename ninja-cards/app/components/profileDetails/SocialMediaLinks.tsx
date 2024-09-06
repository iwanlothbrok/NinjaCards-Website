import React from 'react';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure

interface SocialMediaLinksProps {
    user: User | null;
    cardStyle: any;
}

// Define SVGs for the icons
const socialMediaIcons = {
    facebook: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
        >
            <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.405.595 24 1.325 24h11.497v-9.294H9.69v-3.622h3.132V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.916c-1.504 0-1.796.714-1.796 1.762v2.31h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.325-.595 1.325-1.326V1.326C24 .594 23.405 0 22.675 0z" />
        </svg>
    ),
    instagram: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.245 2.241 1.308 3.608.058 1.265.07 1.645.07 4.85s-.012 3.585-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.974-2.241 1.245-3.608 1.308-1.265.058-1.645.07-4.85.07s-3.585-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.974-.975-1.245-2.241-1.308-3.608-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.974 2.241-1.245 3.608-1.308 1.265-.058 1.645-.07 4.85-.07M12 0C8.741 0 8.332.012 7.052.07 5.768.129 4.672.38 3.758 1.294c-.913.913-1.165 2.01-1.224 3.294C2.012 5.586 2 6 2 12s.012 6.414.07 7.694c.058 1.284.31 2.381 1.224 3.294.914.913 2.01 1.165 3.294 1.224 1.28.058 1.689.07 4.958.07s3.679-.012 4.958-.07c1.284-.058 2.381-.31 3.294-1.224.913-.914 1.165-2.01 1.224-3.294.058-1.28.07-1.689.07-4.958s-.012-3.679-.07-4.958c-.058-1.284-.31-2.381-1.224-3.294-.914-.914-2.01-1.165-3.294-1.224C15.668.012 15.259 0 12 0z" />
            <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.882 1.44 1.44 0 0 0 0-2.882z" />
        </svg>
    ),
    // Add more SVGs for each social media icon similarly
};

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user, cardStyle }) => {
    const socialMediaLinks = [
        { key: 'facebook', url: user?.facebook, icon: socialMediaIcons.facebook, label: 'Facebook', gradient: 'from-blue-600 to-purple-600' },
        { key: 'instagram', url: user?.instagram, icon: socialMediaIcons.instagram, label: 'Instagram', gradient: 'from-yellow-500 to-red-700' },
        // Add more social media links here
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
                                {link.icon}
                            </div>
                        </a>
                    )
                ))}
            </div>
        </div>
    );
};

export default SocialMediaLinks;
