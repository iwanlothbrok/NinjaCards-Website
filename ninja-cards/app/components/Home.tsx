import React from 'react'
import Link from 'next/link';

export const HomePage: React.FC = () => {
    return (
        <section className="w-full h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url(/nfc-card.webp  )' }}>
            <div className="bg-black bg-opacity-75 w-full h-full flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Smart NFC Cards</h1>
                <p className="text-lg md:text-2xl mb-8">Innovative solutions for modern needs</p>
                <Link className="bg-orange text-white px-6 py-3 rounded-full text-lg hover:bg-orange-600" href="/contact">
                    Get Yours Now
                </Link>
            </div>
        </section>
    )
}
