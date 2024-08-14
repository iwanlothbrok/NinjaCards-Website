"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const convertImageToBase64 = (imageData: { type: string, data: number[] }): string => {
    if (imageData && imageData.type === 'Buffer') {
        // Convert the array of bytes back into a Buffer
        const buffer = Buffer.from(imageData.data);
        // Convert the Buffer to a Base64 string
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    } else {
        console.error('Unsupported image data type:', typeof imageData);
        return '';
    }
};

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);
    const [userImage, setUserImage] = useState('');


    useEffect(() => {
        setIsAuthenticated(!!user);
        if (user && user.image) {
            const imageData = user.image; // Adjust according to your object structure
            const base64Image = convertImageToBase64(imageData);
            setUserImage(base64Image);
        }
    }, [user]);


    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
    };

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="absolute top-0 left-0 z-40 flex items-center w-full bg-darkBg">
            <div className="container mx-auto">
                <div className="relative flex items-center justify-between px-4">
                    <div className="flex-shrink-0">
                        <Link href="/" className="block w-24 py-2 navbar-logo">
                            <img src="/navLogo.png" alt="logo" className="w-full" />
                        </Link>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                id="navbarToggler"
                                className="block px-3 py-[6px] ring-orange focus:ring-2">
                                <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
                                <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
                                <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
                            </button>
                        </div>
                        <nav
                            id="navbarCollapse"
                            className={`absolute top-full ${isOpen ? 'block' : 'hidden'} w-full max-w-[250px] rounded-lg bg-darkesBg py-5 shadow-lg lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none xl:px-6`}>
                            <ul className="block lg:flex 2xl:ml-20 justify-center">
                                <li className="relative group">
                                    <Link
                                        href="/"
                                        className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:pt-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/about"
                                        className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:pt-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/pricing"
                                        className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:pt-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/team"
                                        className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:pt-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        Team
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/contact"
                                        className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:pt-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        Contact
                                    </Link>
                                </li>
                                {isAuthenticated && (
                                    <li className="relative group flex items-center lg:hidden">
                                        <img
                                            id="avatarButton"
                                            onClick={handleDropdownClick}
                                            className="w-16 h-16 ml-7 mt-2 rounded-full cursor-pointer border-2 border-orange shadow-md"
                                            src={userImage || 'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
                                            alt="User avatar"
                                        />
                                        {isDropdownOpen && (
                                            <div id="userDropdown" className="absolute  right-0 mt-2 w-44 rounded-lg shadow-lg bg-darkesBg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                                                <div className="px-4 py-3 text-sm text-white">
                                                    <div>{user?.name}</div>
                                                    <div className="font-medium truncate">{user?.email}</div>
                                                </div>
                                                <ul className="py-2 text-sm text-gray-200" aria-labelledby="avatarButton">
                                                    <li>
                                                        <Link href="/dashboard" className="block px-4 py-2 hover:bg-darkOrange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Dashboard</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/profile" className="block px-4 py-2 hover:bg-darkOrange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Account</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/earnings" className="block px-4 py-2 hover:bg-darkOrange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Earnings</Link>
                                                    </li>
                                                </ul>
                                                <div className="py-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-darkOrange dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </nav>
                        <div className="hidden lg:flex items-center justify-end lg:pr-0">
                            {isAuthenticated ? (
                                <div className="relative ml-4">
                                    <img
                                        id="avatarButton"
                                        onClick={handleDropdownClick}
                                        className="w-28 h-24 rounded-full cursor-pointer border-2 border-orange shadow-md"
                                        src={userImage || 'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
                                        alt="User avatar"
                                    />
                                    {isDropdownOpen && (
                                        <div id="userDropdown" className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-darkesBg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                                            <div className="px-4 py-3 text-sm text-white">
                                                <div className='text-orange fw-'>{user?.name}</div>
                                                <div className="font-medium truncate text-orange">{user?.email}</div>
                                            </div>
                                            <ul className="py-2 text-sm text-gray-200" aria-labelledby="avatarButton">
                                                <li>
                                                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-bg-orange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Dashboard</Link>
                                                </li>
                                                <li>
                                                    <Link href="/profile" className="block px-4 py-2 hover:bg-bg-orange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Profile</Link>
                                                </li>
                                                <li>
                                                    <Link href="/earnings" className="block px-4 py-2 hover:bg-bg-orange dark:hover:bg-orange dark:hover:text-white" onClick={handleDropdownClick}>Earnings</Link>
                                                </li>
                                            </ul>
                                            <div className="py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-darkOrange dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex">
                                    <Link href="/register" className="px-[22px] py-2 text-base font-medium text-white hover:opacity-70">
                                        Register
                                    </Link>
                                    <Link href="/login" className="px-6 py-2 text-base font-medium text-white duration-300 ease-in-out rounded-md bg-orange hover:bg-darkOrange">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
