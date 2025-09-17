"use client";

import { BASE_API_URL } from '@/utils/constants';
import React, { useEffect, useState } from 'react';

interface CardDesign {
    id: number;
    cardName: string;
    cardTitle: string;
    userName: string;
    userPhone: string;
    userEmail: string;
    frontDataUrl: string;  // Base64-encoded image or data URL
    backDataUrl: string;   // Base64-encoded image or data URL
    backLogoUrl: string;   // Base64-encoded logo or data URL
    courierIsSpeedy: number; // 1 for Speedy, 0 for Ekont
    courierAddress: string;
}

export default function CardDesignsPage() {
    const [cardDesigns, setCardDesigns] = useState<CardDesign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch card designs from the API
        const fetchCardDesigns = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/design/all`);
                const data = await res.json();
                setCardDesigns(data);
            } catch (err) {
                setError('Failed to load card designs');
            } finally {
                setLoading(false);
            }
        };

        fetchCardDesigns();
    }, []);

    // Handle delete card design
    const handleDeleteCard = async (cardId: number) => {
        if (!confirm("Are you sure you want to delete this card?")) return;
        try {
            const res = await fetch(`${BASE_API_URL}/api/design/${cardId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete the card design');
            }

            // Remove the deleted card from the UI without refreshing the page
            setCardDesigns((prevDesigns) => prevDesigns.filter((card) => card.id !== cardId));
        } catch (error) {
            console.error(error);
            setError('Failed to delete the card');
        }
    };

    const handleDownloadBackLogo = (backLogoUrl: string, cardName: string) => {
        const link = document.createElement('a');
        link.href = backLogoUrl;  // Base64 image URL
        link.download = `${cardName}-back-logo.png`;  // Download name for the image
        link.click();  // Trigger the download
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen text-white bg-gray-900 p-8">
            <h1 className="text-3xl mb-6 font-bold text-center">Card Designs</h1>
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-8">
                {cardDesigns.map((card) => (
                    <div
                        key={card.id}
                        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-white">{card.cardName}</h2>
                            <p className="text-sm text-gray-400">{card.cardTitle}</p>
                            <p className="mt-2 text-gray-400">Name: {card.userName}</p>
                            <p className="text-gray-400">Phone: {card.userPhone}</p>
                            <p className="text-gray-400">Email: {card.userEmail}</p>
                            <p className="mt-4 text-gray-400">Courier: {card.courierIsSpeedy ? 'Speedy' : 'Ekont'}</p>
                            <p className="text-gray-400">Courier Address: {card.courierAddress}</p>
                        </div>

                        <div className="mt-4">
                            <div className="text-center p-4">
                                <h3 className="text-lg font-semibold text-white">Front:</h3>
                                <img
                                    src={card.frontDataUrl}
                                    alt={`${card.cardName} Front`}
                                    className="w-full h-auto max-h-72 object-cover border border-gray-700 rounded mt-2"
                                />
                            </div>

                            <div className="text-center p-4">
                                <h3 className="text-lg font-semibold text-white">Back:</h3>
                                <img
                                    src={card.backDataUrl}
                                    alt={`${card.cardName} Back`}
                                    className="w-full h-auto max-h-60 object-cover border border-gray-700 rounded mt-2"
                                />
                            </div>

                            {card.backLogoUrl && (
                                <div className="text-center p-4">
                                    <h3 className="text-lg font-semibold text-white">Logo:</h3>
                                    <img
                                        src={card.backLogoUrl}
                                        alt={`${card.cardName} Logo`}
                                        className="w-full h-auto max-h-32 object-cover border border-gray-700 rounded mt-2"
                                    />

                                    {/* Save Back Logo Button */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleDownloadBackLogo(card.backLogoUrl, card.cardName)}
                                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                        >
                                            Save Back Logo
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Delete Button */}
                        <div className="p-4 text-center">
                            <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
