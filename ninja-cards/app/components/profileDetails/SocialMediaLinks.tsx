import React from 'react';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure

interface SocialMediaLinksProps {
    user: User | null;
    cardStyle: any;
}

// Hardcoded SVG icons from the provided URLs
const socialMediaIcons = {
    facebook: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
        >
            <path d="M22.676 0H1.324C.593 0 0 .594 0 1.326v21.348C0 23.406.593 24 1.324 24h11.499V14.706h-3.13v-3.62h3.13V8.414c0-3.1 1.893-4.789 4.66-4.789 1.324 0 2.463.1 2.795.144v3.24h-1.916c-1.504 0-1.796.715-1.796 1.763v2.309h3.59l-.467 3.62h-3.123V24h6.117C23.407 24 24 23.406 24 22.674V1.326C24 .594 23.407 0 22.676 0z" />
        </svg>
    ),
    instagram: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
            className="w-8 h-8"
        >
            <path d="M127.998 77.299c-27.98 0-50.7 22.72-50.7 50.7s22.72 50.7 50.7 50.7c27.98 0 50.7-22.72 50.7-50.7s-22.72-50.7-50.7-50.7Zm0 83.598a32.858 32.858 0 0 1-32.894-32.898c0-18.166 14.728-32.894 32.894-32.894 18.166 0 32.894 14.728 32.894 32.894.001 18.166-14.728 32.898-32.894 32.898Z" />
            <path d="M178.151 64.53a11.88 11.88 0 1 0 0 23.762 11.88 11.88 0 1 0 0-23.762Z" />
            <path d="M183.189 29.846c-10.026-1.295-33.655-1.98-55.193-1.98-21.539 0-45.168.685-55.195 1.98-11.515 1.492-21.224 6.558-29.45 14.784-8.227 8.226-13.293 17.935-14.785 29.451-1.295 10.026-1.978 33.655-1.978 55.194 0 21.539.683 45.168 1.978 55.193 1.492 11.515 6.558 21.224 14.785 29.45 8.226 8.226 17.935 13.293 29.45 14.785 10.026 1.295 33.655 1.98 55.195 1.98 21.538 0 45.167-.685 55.193-1.98 11.515-1.492 21.224-6.558 29.451-14.785 8.226-8.226 13.293-17.935 14.784-29.45 1.295-10.026 1.979-33.654 1.979-55.193 0-21.539-.684-45.168-1.979-55.194-1.492-11.515-6.558-21.224-14.784-29.451-8.227-8.226-17.936-13.292-29.451-14.784Zm6.433 153.875c-1.217 9.407-5.433 18.213-12.233 25.013-6.799 6.799-15.606 11.015-25.012 12.232-9.862 1.273-32.19 1.947-53.18 1.947s-43.318-.674-53.18-1.947c-9.407-1.217-18.213-5.433-25.013-12.232-6.799-6.799-11.015-15.606-12.232-25.013-1.273-9.862-1.947-32.19-1.947-53.18s.674-43.318 1.947-53.18c1.217-9.407 5.433-18.213 12.232-25.013 6.799-6.799 15.606-11.015 25.013-12.232 9.862-1.273 32.19-1.947 53.18-1.947 20.99 0 43.318.674 53.18 1.947 9.407 1.217 18.213 5.433 25.012 12.232 6.799 6.799 11.015 15.606 12.233 25.013 1.273 9.862 1.947 32.19 1.947 53.18s-.675 43.318-1.947 53.18Z" />
        </svg>
    ),
    tiktok: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
            className="w-8 h-8"
        >
            <path d="M228.812 90.463c-16.78-.048-32.473-5.24-45.073-14.474-13.044-9.485-21.747-22.696-25.283-38.57-1.49-6.846-2.202-13.77-2.202-20.68v-7.96a3.003 3.003 0 0 0-3-3h-38.636a3.003 3.003 0 0 0-3 3v143.998c0 6.853-2.46 13.186-6.925 18.098-4.587 4.992-10.79 7.704-17.392 7.7h-.072c-13.541 0-24.633-11.147-24.633-24.781-.004-6.59 2.509-12.785 7.075-17.386 4.524-4.566 10.543-7.07 16.928-7.07h.076a3.003 3.003 0 0 0 3-3v-38.636a3.003 3.003 0 0 0-3-3c-21.703 0-42.31 8.755-57.643 24.61-14.978 15.507-23.23 36.084-23.218 57.976.016 44.612 36.385 80.968 81.013 80.968 21.57-.004 41.866-8.439 57.092-23.775 13.928-13.938 22.774-32.22 24.42-51.898a3.003 3.003 0 0 0-3-3.276h-39.283a3.003 3.003 0 0 0-3 3c0 13.544-11.165 24.633-24.781 24.633-6.587 0-12.792-2.543-17.43-7.176a24.556 24.556 0 0 1-7.13-17.511V42.44h14.052c2.718 20.198 12.488 37.957 28.768 50.17 14.82 11.155 33.257 17.574 52.118 17.674h.098a3.003 3.003 0 0 0 3-3v-39.15a3.003 3.003 0 0 0-2.963-3.002Z" />
        </svg>
    ),
};

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user, cardStyle }) => {
    const socialMediaLinks = [
        { key: 'facebook', url: user?.facebook, icon: socialMediaIcons.facebook, label: 'Facebook', gradient: 'from-blue-600 to-purple-600' },
        { key: 'instagram', url: user?.instagram, icon: socialMediaIcons.instagram, label: 'Instagram', gradient: 'from-yellow-500 to-red-700' },
        { key: 'tiktok', url: user?.tiktok, icon: socialMediaIcons.tiktok, label: 'TikTok', gradient: 'from-indigo-600 to-fuchsia-600' },
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
