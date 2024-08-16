// pages/profileDetails/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGithub, FaYoutube, FaTiktok } from 'react-icons/fa';
import { log } from 'console';

interface User {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    position: string;
    phone1: string;
    phone2: string;
    email2: string;
    street1: string;
    street2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    bio: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    image: string;  // Now storing as a base64-encoded string
    tiktok: string;
    googleReview: string;
    revolut: string;
    qrCode: string;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

const ProfileDetails: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();
    // const searchParams = new URLSearchParams(window.location.search);
    console.log('url ' + window.location.search);

    const searchParams = useSearchParams();
    const userId = searchParams?.get('id'); // Get the user ID from the URL

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId]);

    const fetchUser = async (userId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/profile/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData: User = await response.json();
            setUser(userData);
        } catch (error) {
            console.error(error);
            showAlert('Failed to load profile', 'Error', 'red');
        } finally {
            setLoading(false);
        }
    };

    const generateVCF = () => {
        if (!user) return;

        const vCard = ["BEGIN:VCARD", "VERSION:3.0"];
        if (user.name) vCard.push(`FN:${user.name}`);
        if (user.lastName && user.firstName) vCard.push(`N:${user.lastName};${user.firstName};;;`);
        if (user.email) vCard.push(`EMAIL:${user.email}`);
        if (user.email2) vCard.push(`EMAIL;TYPE=WORK:${user.email2}`);
        if (user.phone1) vCard.push(`TEL;TYPE=CELL:${user.phone1}`);
        if (user.phone2) vCard.push(`TEL;TYPE=CELL:${user.phone2}`);
        if (user.company) vCard.push(`ORG:${user.company}`);
        if (user.position) vCard.push(`TITLE:${user.position}`);
        if (user.street1 || user.city || user.state || user.zipCode || user.country) {
            vCard.push(`ADR;TYPE=WORK:;;${user.street1 || ''};${user.city || ''};${user.state || ''};${user.zipCode || ''};${user.country || ''}`);
        }
        if (user.bio) vCard.push(`NOTE:${user.bio}`);
        ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok', 'googleReview', 'revolut', 'qrCode'].forEach((key) => {
            const url = user[key as keyof User];
            if (url) vCard.push(`URL:${url}`);
        });
        if (user.image) {
            vCard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${user.image}`);
        }
        vCard.push("END:VCARD");

        const blob = new Blob([vCard.join("\r\n")], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user.firstName}_${user.lastName}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const ProfileImage = useMemo(() => {
        return (
            <div className="relative z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw))' }}>
                <img className="w-full" src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url.jpg'} alt="Profile image" />
                <div className="text-center absolute w-full" style={{ bottom: '4rem' }}>
                    <p className="text-yellow-100 tracking-wide uppercase text-lg font-bold">{user?.firstName} {user?.lastName}</p>
                    <p><span className="text-green-100 text-sm">{user?.email}</span></p>
                </div>
            </div>
        );
    }, [user]);

    const SocialLinks = useMemo(() => (
        <div className="flex justify-around my-4">
            {user?.facebook && <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><FaFacebook size={24} /></a>}
            {user?.instagram && <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700"><FaInstagram size={24} /></a>}
            {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><FaLinkedin size={24} /></a>}
            {user?.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600"><FaTwitter size={24} /></a>}
            {user?.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900"><FaGithub size={24} /></a>}
            {user?.youtube && <a href={user.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800"><FaYoutube size={24} /></a>}
            {user?.tiktok && <a href={user.tiktok} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800"><FaTiktok size={24} /></a>}
        </div>
    ), [user]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>No profile data available.</div>;

    return (
        <div className="container mt-52 w-full mx-auto max-w-sm rounded-lg overflow-hidden shadow-lg my-2 bg-orange text-black">
            {alert && (
                <div className={`my-2 p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
            {ProfileImage}
            <div className="relative flex justify-between items-center flex-row px-6 z-50 -mt-10">
                <button className="p-4 bg-red-500 rounded-full hover:bg-orange-400 focus:bg-orange-600 transition ease-in duration-200 focus:outline-none" onClick={generateVCF}>
                    <svg viewBox="0 0 20 20" className="w-6 h-6">
                        <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z" />
                    </svg>
                </button>
            </div>
            <div className="pt-6 pb-8 text-center">
                <p>{user?.bio}</p>
            </div>
            <div className="pb-10 uppercase text-center tracking-wide flex justify-around">
                <div>
                    <p className="text-sm">Phone 1</p>
                    <p className="text-lg font-semibold text-orange-500">{user?.phone1}</p>
                </div>
                <div>
                    <p className="text-sm">Phone 2</p>
                    <p className="text-lg font-semibold text-orange-500">{user?.phone2}</p>
                </div>
                <div>
                    <p className="text-sm">Email 2</p>
                    <p className="text-lg font-semibold text-orange-500">{user?.email2}</p>
                </div>
            </div>
            {SocialLinks}
        </div>
    );
};

export default ProfileDetails;
