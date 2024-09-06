import React from 'react';
import Image from 'next/image';
import { User } from '../../../types/user'; // Adjust the path based on your folder structure

// Import all the images directly
import fbLogo from '/public/logos/fb.png';
import igLogo from '/public/logos/ig.png';
import lkLogo from '/public/logos/lk.png';
import twitterLogo from '/public/logos/x.png';
import gitLogo from '/public/logos/git.png';
// import youtubeLogo from '/public/logos/youtube.png';
import tiktokLogo from '/public/logos/tiktok.png';
import behanceLogo from '/public/logos/be.png';
import paypalLogo from '/public/logos/icons8-paypal-48.png';
import trustpilotLogo from '/public/logos/tp.png';
import viberLogo from '/public/logos/viber.png';
import whatsappLogo from '/public/logos/wa.png';
import websiteLogo from '/public/logos/website.png';
import revolutLogo from '/public/logos/rev.png';

interface SocialMediaLinksProps {
    user: User | null;
    cardStyle: any;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user, cardStyle }) => {
    const socialMediaLinks = [
        { key: 'facebook', url: user?.facebook, logo: fbLogo, label: 'Facebook', gradient: 'from-blue-600 to-purple-600' },
        { key: 'instagram', url: user?.instagram, logo: igLogo, label: 'Instagram', gradient: 'from-yellow-500 to-red-700' },
        { key: 'linkedin', url: user?.linkedin, logo: lkLogo, label: 'LinkedIn', gradient: 'from-blue-700 to-blue-900' },
        { key: 'twitter', url: user?.twitter, logo: twitterLogo, label: 'Twitter', gradient: 'from-blue-500 to-cyan-500' },
        { key: 'github', url: user?.github, logo: gitLogo, label: 'GitHub', gradient: 'from-gray-900 to-gray-600' },
        // { key: 'youtube', url: user?.youtube, logo: youtubeLogo, label: 'YouTube', gradient: 'from-red-600 to-red-400' },
        { key: 'tiktok', url: user?.tiktok, logo: tiktokLogo, label: 'TikTok', gradient: 'from-indigo-600 to-fuchsia-600' },
        { key: 'behance', url: user?.behance, logo: behanceLogo, label: 'Behance', gradient: 'from-blue-600 to-blue-400' },
        { key: 'paypal', url: user?.paypal, logo: paypalLogo, label: 'PayPal', gradient: 'from-blue-500 to-blue-300' },
        { key: 'trustpilot', url: user?.trustpilot, logo: trustpilotLogo, label: 'TrustPilot', gradient: 'from-black to-gray-800' },
        { key: 'viber', url: `viber://chat?number=${user?.viber}`, logo: viberLogo, label: 'Viber', gradient: 'from-purple-500 to-purple-700' },
        { key: 'whatsapp', url: `https://wa.me/${user?.whatsapp}`, logo: whatsappLogo, label: 'WhatsApp', gradient: 'from-green-600 to-green-700' },
        { key: 'website', url: user?.website, logo: websiteLogo, label: 'Website', gradient: 'from-cyan-600 to-cyan-800' },
        { key: 'revolut', url: `https://revolut.me/${user?.revolut}`, logo: revolutLogo, label: 'Revolut', gradient: 'from-blue-800 to-blue-900' },
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
                                <Image
                                    src={link.logo}
                                    alt={link.label}
                                    width={48}
                                    height={48}
                                    className="object-contain transition-all duration-300"
                                    priority
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
