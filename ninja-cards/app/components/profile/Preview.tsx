"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Preview: React.FC = () => {
    const { user } = useAuth();
    console.log(user);

    const generateVCF = () => {
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${user?.firstName} ${user?.lastName}`,
            `N:${user?.lastName};${user?.firstName};;;`,
            `EMAIL:${user?.email}`,
            `TEL;TYPE=CELL:${user?.phone1}`,
            `TEL;TYPE=CELL:${user?.phone2}`,
            `ORG:${user?.company}`,
            `TITLE:${user?.position}`,
            `ADR;TYPE=WORK:;;${user?.street1};${user?.city};${user?.state};${user?.zipCode};${user?.country}`,
            `NOTE:${user?.bio}`,
            user?.facebook ? `URL:Facebook:${user.facebook}` : '',
            user?.instagram ? `URL:Instagram:${user.instagram}` : '',
            user?.linkedin ? `URL:LinkedIn:${user.linkedin}` : '',
            user?.twitter ? `URL:Twitter:${user.twitter}` : '',
            user?.tiktok ? `URL:TikTok:${user.tiktok}` : '',
            user?.googleReview ? `URL:Google Review:${user.googleReview}` : '',
            user?.revolut ? `URL:Revolut:${user.revolut}` : '',
            user?.qrCode ? `URL:QR Code:${user.qrCode}` : '',
        ].filter(Boolean); // Filter out any empty strings

        if (user?.image) {
            const base64Image = Buffer.from(user.image).toString('base64');
            vCard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${base64Image}`);
        }

        vCard.push("END:VCARD");

        const blob = new Blob([vCard.join("\r\n")], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user?.firstName}_${user?.lastName}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const sectionClass = "border border-gray-700 rounded p-4 mb-4";
    const titleClass = "text-lg font-bold mb-4 text-white";
    const textClass = "text-white";

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white">Preview</h2>

            <div className={sectionClass}>
                <h3 className={titleClass}>Card Information</h3>
                <p className={textClass}><strong>Card Name:</strong> {user?.name}</p>
                <p className={textClass}><strong>First Name:</strong> {user?.firstName}</p>
                <p className={textClass}><strong>Last Name:</strong> {user?.lastName}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Contacts</h3>
                <p className={textClass}><strong>Phone 1:</strong> {user?.phone1}</p>
                <p className={textClass}><strong>Phone 2:</strong> {user?.phone2}</p>
                <p className={textClass}><strong>Email 1:</strong> {user?.email}</p>
                <p className={textClass}><strong>Email 2:</strong> {user?.email2}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Social Media</h3>
                <p className={textClass}><strong>Facebook:</strong> {user?.facebook}</p>
                <p className={textClass}><strong>Instagram:</strong> {user?.instagram}</p>
                <p className={textClass}><strong>LinkedIn:</strong> {user?.linkedin}</p>
                <p className={textClass}><strong>Twitter:</strong> {user?.twitter}</p>
                <p className={textClass}><strong>TikTok:</strong> {user?.tiktok}</p>
                <p className={textClass}><strong>Google Review:</strong> {user?.googleReview}</p>
                <p className={textClass}><strong>Revolut:</strong> {user?.revolut}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Address</h3>
                <p className={textClass}><strong>Street 1:</strong> {user?.street1}</p>
                <p className={textClass}><strong>Street 2:</strong> {user?.street2}</p>
                <p className={textClass}><strong>Zip Code:</strong> {user?.zipCode}</p>
                <p className={textClass}><strong>City:</strong> {user?.city}</p>
                <p className={textClass}><strong>State:</strong> {user?.state}</p>
                <p className={textClass}><strong>Country:</strong> {user?.country}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Bio</h3>
                <p className={textClass}>{user?.bio}</p>
            </div>

            {user?.qrCode && (
                <div className={sectionClass}>
                    <h3 className={titleClass}>QR Code</h3>
                    <img src={user.qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                </div>
            )}

            <button
                onClick={generateVCF}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
                Save to VCF
            </button>
        </div>
    );
};

export default Preview;
