"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Preview() {

    const router = useRouter();
    const { user } = useAuth();


    return (
        <div className='p-4'>

            <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

                <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-wide">
                    👤 Преглед на профила
                </h2>


                {/* Profile Image */}

                {/* Profile Information */}
                <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-md">
                    <h3 className="text-xl font-semibold text-teal-400">Информация за картата</h3>
                    <p className="text-gray-300 mt-2"><strong>Име на картата:</strong> {user?.name}</p>
                    <p className="text-gray-300"><strong>Име:</strong> {user?.firstName}</p>
                    <p className="text-gray-300"><strong>Фамилия:</strong> {user?.lastName}</p>
                </div>

                {/* Contacts Section */}
                <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-md">
                    <h3 className="text-xl font-semibold text-teal-400">Контакти</h3>
                    <p className="text-gray-300 mt-2"><strong>Телефон 1:</strong> {user?.phone1}</p>
                    <p className="text-gray-300"><strong>Телефон 2:</strong> {user?.phone2}</p>
                    <p className="text-gray-300"><strong>Email 1:</strong> {user?.email}</p>
                    <p className="text-gray-300"><strong>Email 2:</strong> {user?.email2}</p>
                </div>

                {/* Address Section */}
                <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-md">
                    <h3 className="text-xl font-semibold text-teal-400">Адрес</h3>
                    <p className="text-gray-300 mt-2"><strong>Улица 1:</strong> {user?.street1}</p>
                    <p className="text-gray-300"><strong>Улица 2:</strong> {user?.street2}</p>
                    <p className="text-gray-300"><strong>Пощенски код:</strong> {user?.zipCode}</p>
                    <p className="text-gray-300"><strong>Град:</strong> {user?.city}</p>
                    <p className="text-gray-300"><strong>Област:</strong> {user?.state}</p>
                    <p className="text-gray-300"><strong>Държава:</strong> {user?.country}</p>
                </div>

                {/* Biography Section */}
                <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-md">
                    <h3 className="text-xl font-semibold text-teal-400">Биография</h3>
                    <p className="text-gray-300 mt-2">{user?.bio}</p>
                </div>

                {/* QR Code */}
                {user?.qrCode && (
                    <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-md text-center">
                        <h3 className="text-xl font-semibold text-teal-400">QR код</h3>
                        <img src={user.qrCode} alt="QR код" className="w-40 h-40 mx-auto mt-2 rounded-lg shadow-lg" />
                    </div>
                )}

                {/* Back Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                    focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>

    );
}
