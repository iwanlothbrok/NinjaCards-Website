"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathname = usePathname();

    const linkClassName = (path: string) =>
        `text-white mx-2 p-2 rounded ${pathname === path ? 'bg-orange' : 'hover:bg-orange'}`;

    return (
        <nav className="bg-charcoal p-4 fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">MyWebsite</div>
                <div className="flex space-x-4">
                    <Link href="/" className={linkClassName("/")}>
                        Home
                    </Link>
                    <Link href="/about" className={linkClassName("/about")}>
                        About
                    </Link>
                    <Link href="/services" className={linkClassName("/services")}>
                        Services
                    </Link>
                    <Link href="/contact" className={linkClassName("/contact")}>
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
