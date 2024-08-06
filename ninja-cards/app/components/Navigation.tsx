"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    const linkClassName = (path: string) =>
        `block mt-4 lg:inline-block lg:mt-0 text-white mx-2 p-2 rounded ${pathname === path ? 'bg-orange' : 'hover:bg-orange'}`;

    return (
        <nav className="bg-charcoal p-4 fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <div className="text-white text-lg font-bold">MyWebsite</div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center px-3 py-2 border rounded text-orange border-orange hover:text-white hover:border-white"
                    >
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="text-sm lg:flex-grow">
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
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <>
                                {user.name && (
                                    <span className=' block mt-4 lg:inline-block lg:mt-0 text-white mx-2 p-2 rounded bg-teil '>{user.name}</span>
                                )}
                                {user.image && user.name && (
                                    <img src={user.image} alt="User Image" className="w-8 h-8 rounded-full" />
                                )}
                                <button onClick={handleLogout} className={linkClassName("/logout")}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="text-sm lg:flex-grow">
                                <Link href="/login" className={linkClassName("/login")}>Login</Link>
                                <Link href="/register" className={linkClassName("/register")}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
