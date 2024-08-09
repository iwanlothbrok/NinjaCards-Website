"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    useEffect(() => {
        setIsAuthenticated(!!user);
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
                        <Link href="/" className="block w-24 py-2 navbar-logo mx-auto">
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
                            className={`absolute right-0 top-full ${isOpen ? 'block' : 'hidden'} w-full max-w-[250px] rounded-lg bg-darkesBg py-5 shadow-lg lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none xl:px-6`}>
                            <ul className="block lg:flex 2xl:ml-20">
                                <li className="relative group">
                                    <Link href="/" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:mr-0 lg:inline-flex lg:px-0 lg:py-6">
                                        Home
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/about" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 xl:ml-10">
                                        About
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/pricing" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 xl:ml-10">
                                        Pricing
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/team" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 xl:ml-10">
                                        Team
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="/contact" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 xl:ml-10">
                                        Contact
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <Link href="blog-grids.html" className="flex py-2 mx-8 text-base font-medium text-white group-hover:text-orange lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 xl:ml-10">
                                        Blog
                                    </Link>
                                </li>
                                {isAuthenticated && (
                                    <li className="relative group flex items-center lg:hidden">
                                        <img
                                            id="avatarButton"
                                            onClick={handleDropdownClick}
                                            className="w-14 h-14 ml-7 mt-2 rounded-full cursor-pointer border-2 border-orange shadow-md"
                                            src={user?.image || 'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
                                            alt="User dropdown"
                                        />
                                        {isDropdownOpen && (
                                            <div id="userDropdown" className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-darkesBg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
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
                                        className="w-20 h-20 rounded-full cursor-pointer border-2 border-orange shadow-md"
                                        src={user?.image || 'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
                                        alt="User dropdown"
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
