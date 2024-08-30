"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineDownload } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import Image from 'next/image';

const QRCodeDownload: React.FC = () => {
    const { user } = useAuth();

    if (!user || !user.qrCode) {
        return <p className="text-center text-gray-400">Няма наличен QR код.</p>;
    }

    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.href = user.qrCode;
        link.download = `${user.name}_QRCode.png`;
        link.click();
    };

    const handleShare = () => {
        const qrBlob = dataURLtoBlob(user.qrCode);
        const qrFile = new File([qrBlob], `${user.name}_QRCode.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [qrFile] })) {
            navigator
                .share({
                    files: [qrFile],
                    title: 'QR код',
                    text: `Сканирайте този QR код, за да получите информацията за ${user.name}.`,
                })
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Вашето устройство не поддържа споделяне на файлове чрез тази функция.');
        }
    };

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">QR код на профила</h2>
            <div className="flex flex-col items-center mb-6">
                {user.image && (
                    <Image
                        src={`data:image/jpeg;base64,${user.image}`}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={120}
                        height={120}
                        className="w-40 h-40 rounded-full border-4 border-teal-400 shadow-lg mb-4"
                    />
                )}
                <p className="text-lg font-semibold text-teal-400 mb-4">{user.name}</p>
                <div className="bg-teal-500 p-4 rounded-lg shadow-lg mb-4">
                    <img src={user.qrCode} alt="QR код" className="w-40 h-40" />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={downloadQRCode}
                        className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
                    >
                        <AiOutlineDownload className="mr-2 text-3xl" />
                        Изтегли QR код
                    </button>
                    <button
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        onClick={handleShare}
                    >
                        <FiSend className="mr-2 text-3xl" />
                        Изпрати QR код
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDownload;
