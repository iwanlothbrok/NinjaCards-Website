'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../Navigation';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function AppChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.includes('/admin');

    if (isAdminRoute) {
        return <main className="min-h-screen bg-gradient-to-br from-[#05080c] via-darkBg to-black">{children}</main>;
    }

    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
                <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
                    <Navbar />
                </header>
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
            <CookieBanner />
            <ClientLayoutWrapper />
        </>
    );
}
