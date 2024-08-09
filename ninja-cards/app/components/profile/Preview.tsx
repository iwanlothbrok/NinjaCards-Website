"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Preview: React.FC = () => {
    const { user } = useAuth();

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
            `URL:${user?.website1}`,
            `URL:${user?.website2}`,
            `NOTE:${user?.bio}`,
            "END:VCARD"
        ].join("\r\n");

        const blob = new Blob([vCard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user?.firstName}_${user?.lastName}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-3 bg-darkBg rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Preview</h2>
            <div className="information border border-white rounded p-2">
                <h3 className="text-lg font-bold mb-2 text-white">Данни на картата</h3>
                <p className="text-white"><strong>Име на картата:</strong> {user?.name}</p>
                <p className="text-white"><strong>Име:</strong> {user?.firstName}</p>
                <p className="text-white"><strong>Фамилия:</strong> {user?.lastName}</p>
            </div>

            <div className="contacts border border-white rounded p-2 mt-4">
                <h3 className="text-lg font-bold mb-2 text-white">Контакти</h3>
                <p className="text-white"><strong>Телефон 1:</strong> {user?.phone1}</p>
                <p className="text-white"><strong>Телефон 2:</strong> {user?.phone2}</p>
                <p className="text-white"><strong>Имейл 1:</strong> {user?.email}</p>
                <p className="text-white"><strong>Имейл 2:</strong> {user?.email2}</p>
            </div>

            <div className="websites border border-white rounded p-2 mt-4">
                <h3 className="text-lg font-bold mb-2 text-white">Websites</h3>
                <p className="text-white"><strong>Сайт 1:</strong> {user?.website1}</p>
                <p className="text-white"><strong>Сайт 2:</strong> {user?.website2}</p>
            </div>

            <div className="address border border-white rounded p-2 mt-4">
                <h3 className="text-lg font-bold mb-2 text-white">Адрес / Локация</h3>
                <p className="text-white"><strong>Улица:</strong> {user?.street1}</p>
                <p className="text-white"><strong>Улица 2:</strong> {user?.street2}</p>
                <p className="text-white"><strong>Пощенски код:</strong> {user?.zipCode}</p>
                <p className="text-white"><strong>Град:</strong> {user?.city}</p>
                <p className="text-white"><strong>Област:</strong> {user?.state}</p>
                <p className="text-white"><strong>Държава:</strong> {user?.country}</p>
            </div>

            <div className="bio border border-white rounded p-2 mt-4">
                <h3 className="text-lg font-bold mb-2 text-white">Повече информация за Вас / Описание</h3>
                <p className="text-white">{user?.bio}</p>
            </div>

            <button onClick={generateVCF} className="bg-teil text-white px-6 py-3 rounded mt-4 hover:bg-orange transition transform hover:scale-105">
                Save to VCF
            </button>
        </div>
    );
};

export default Preview;
