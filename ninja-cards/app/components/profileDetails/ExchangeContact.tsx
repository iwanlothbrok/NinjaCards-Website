// File: components/ExchangeContactModal.tsx

import React, { useState } from 'react';
import { FaUser, FaAt, FaPhone, FaFileAlt, FaImage } from 'react-icons/fa';

interface ExchangeContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vCard: string) => void;
}

const ExchangeContact: React.FC<ExchangeContactModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
            "CLASS:PUBLIC",
            "PRODID:-//class_vcard //NONSGML Version 1//EN"
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

        setIsSubmitting(true);
        const vCard = generateVCF();
        onSubmit(vCard);
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 transition-opacity duration-300">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 sm:mx-auto z-40">
                <h2 className="text-2xl mb-4 font-semibold text-gray-900 text-center">Разменете Контакти</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium">
                            <FaUser className="inline mr-2" /> Вашето Име
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${formErrors.name ? 'border-red-500' : ''}`}
                            required
                            placeholder='Иван Иванов'
                            aria-label="Your Name"
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium">
                            <FaAt className="inline mr-2" /> Вашия Имейл
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange ${formErrors.email ? 'border-red-500' : ''}`}
                            required
                            placeholder='example@example.com'
                            aria-label="Your Email"
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-medium">
                            <FaPhone className="inline mr-2" /> Вашия Телефонен Номер
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange ${formErrors.phone ? 'border-red-500' : ''}`}
                            required
                            placeholder='+359 88 888 8888'
                            aria-label="Your Phone"
                        />
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700 font-medium">
                            <FaImage className="inline mr-2" /> Ваша Снимка (Качи)
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange"
                            aria-label="Your Image"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="note" className="block text-gray-700 font-medium">
                            <FaFileAlt className="inline mr-2" /> Информация
                        </label>
                        <input
                            type="text"
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange ${formErrors.note ? 'border-red-500' : ''}`}
                            required
                            placeholder='Запознахме се на...'
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
                            Откажи
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-orange rounded-lg hover:bg-darkOrange focus:outline-none focus:ring-2 focus:ring-orange disabled:bg-yellow-300"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Изпраща се...' : 'Изпрати'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExchangeContact;
