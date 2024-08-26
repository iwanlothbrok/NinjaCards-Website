"use client";

import React, { useState } from 'react';
import {
    FaPhoneAlt, FaShareAlt, FaEnvelope, FaUser, FaAt, FaPhone, FaFileAlt, FaImage
} from 'react-icons/fa';

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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
        note: '',
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        phone: '',
        note: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExchangeContact = () => {
        setIsModalOpen(true);
    };

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'name':
                return value.trim() === '' ? 'Name is required' : '';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
            case 'phone':
                return /^[0-9]{10,15}$/.test(value) ? '' : 'Phone number must be between 10 to 15 digits';
            case 'note':
                return value.trim() === '' ? 'Note is required' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors({
            ...formErrors,
            [name]: validateField(name, value),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            phone: validateField('phone', formData.phone),
            note: validateField('note', formData.note),
        };
        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const generateVCF = () => {
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "CLASS:PUBLIC", // Added CLASS
            "PRODID:-//class_vcard //NONSGML Version 1//EN" // Added PRODID
        ];

        if (formData.name) {
            vCard.push(`FN:${formData.name}`);
        }

        if (formData.image) {
            vCard.push(`PHOTO;ENCODING=b;TYPE=${formData.image.split(';')[0].split(':')[1].toUpperCase()}:${formData.image.split(',')[1]}`);
        }

        if (formData.phone) {
            vCard.push(`TEL;TYPE=Phone,type=VOICE;type=pref:${formData.phone}`);
        }

        if (formData.email) {
            vCard.push(`EMAIL;type=INTERNET;type=Email;type=pref:${formData.email}`);
        }

        if (formData.note) {
            vCard.push(`NOTE;CHARSET=UTF-8:${formData.note}`);
        }

        vCard.push(`REV:${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`);
        vCard.push("END:VCARD");

        return vCard.join("\r\n");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const vCard = generateVCF();

        setIsSubmitting(true);

        try {
            await fetch('/api/profile/exchangeContact', {
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
            alert('Failed to send contact information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onClose = () => {
        setIsModalOpen(false);
        setFormErrors({
            name: '',
            email: '',
            phone: '',
            note: '',
        });
        setFormData({
            name: '',
            email: '',
            phone: '',
            image: '',
            note: '',
        });
    };

    return (
        <div className="flex flex-col space-y-4 mt-8 mb-8">
            <button
                onClick={() => window.location.href = `tel:${user?.phone1}`}
                className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 w-full sm:w-auto"
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
                className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaShareAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Share</span>
            </button>
            <button
                onClick={handleExchangeContact}
                className="flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaEnvelope className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Exchange Contact</span>
            </button>
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 sm:mx-auto">
                        <h2 className="text-2xl mb-4 font-semibold text-gray-900 text-center">Exchange Contact Information</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium">
                                    <FaUser className="inline mr-2" /> Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.name ? 'border-red-500' : ''}`}
                                    required
                                    aria-label="Your Name"
                                />
                                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium">
                                    <FaAt className="inline mr-2" /> Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.email ? 'border-red-500' : ''}`}
                                    required
                                    aria-label="Your Email"
                                />
                                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 font-medium">
                                    <FaPhone className="inline mr-2" /> Your Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.phone ? 'border-red-500' : ''}`}
                                    required
                                    aria-label="Your Phone"
                                />
                                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="image" className="block text-gray-700 font-medium">
                                    <FaImage className="inline mr-2" /> Your Image (Upload)
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-label="Your Image"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="note" className="block text-gray-700 font-medium">
                                    <FaFileAlt className="inline mr-2" /> Note
                                </label>
                                <input
                                    type="text"
                                    id="note"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.note ? 'border-red-500' : ''}`}
                                    required
                                    aria-label="Note"
                                />
                                {formErrors.note && <p className="text-red-500 text-sm mt-1">{formErrors.note}</p>}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700 disabled:bg-purple-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionButtons2;
