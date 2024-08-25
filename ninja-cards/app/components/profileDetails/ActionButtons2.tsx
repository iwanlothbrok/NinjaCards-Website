"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaUser, FaBuilding, FaPlus, FaPhone, FaEnvelope, FaFileDownload, FaUserCircle, FaInfo, FaRegIdBadge,
    FaPhoneAlt, FaShareAlt, FaDownload, FaClipboard
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { useAuth } from '../../context/AuthContext';

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
    image: string;
    tiktok: string;
    googleReview: string;
    revolut: string;
    qrCode: string;
    selectedColor: string;
    cv: string;
    behance: string;
    paypal: string;
    trustpilot: string;
    viber: string;
    whatsapp: string;
    website: string;
}

const ActionButtons2: React.FC<{ user: User | null }> = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExchangeContact = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col space-y-4 mt-8 mb-8">
            <button
                onClick={() => window.location.href = `tel:${user?.phone1}`}
                className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
            >
                <FaPhoneAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Call</span>
            </button>
            <button
                onClick={() => navigator.share && navigator.share({
                    title: user?.name,
                    text: `Contact ${user?.name}`,
                    url: window.location.href
                })}
                className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
                <FaShareAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Share</span>
            </button>
            <button
                onClick={handleExchangeContact}
                className="flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
            >
                <FaEnvelope className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Exchange Contact</span>
            </button>
            {isModalOpen && (
                <ExchangeContactForm user={user} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

const ExchangeContactForm: React.FC<{ user: User | null; onClose: () => void }> = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const vCard = `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name}\nEMAIL:${formData.email}\nTEL:${formData.phone}\nEND:VCARD`;

        try {
            await fetch('/api/send-vcf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: user?.email,
                    vCard,
                }),
            });
            onClose();
            alert('Contact information sent successfully');
        } catch (error) {
            console.error('Error sending contact information:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl mb-4">Exchange Contact Information</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700">Your Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ActionButtons2