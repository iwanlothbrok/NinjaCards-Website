import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
    pageInformation: string;
}

const Header: React.FC<HeaderProps> = ({ pageInformation }) => {
    return (
        <div>
            {/* Background Image and Header Text */}
            <div className="relative bg-cover mb-10 bg-center h-[320px]" style={{ backgroundImage: "url('/profileCover.png')" }}>
                <div className="absolute inset-0 bg-black opacity-80"></div> {/* Overlay for darkening */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white animate-slide-in-down">
                            {pageInformation}
                        </h1>
                        <nav aria-label="breadcrumb">
                            <ol className="flex justify-center space-x-4 text-white">
                                <li>
                                    {/* <Link href="/" passHref>
                                        <a className="text-white hover:text-gray-300">Начало</a>
                                    </Link> */}
                                </li>
                                <li>
                                    <span>/</span>
                                </li>
                                <li>
                                    {/* <Link href="/about" passHref>
                                        <a className="text-white hover:text-gray-300">За Нас</a>
                                    </Link> */}
                                </li>
                                <li>
                                    <span>/</span>
                                </li>
                                <li>
                                    {/* <Link href="/contact" passHref>
                                        <a className="text-white hover:text-gray-300">Контакти</a>
                                    </Link> */}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
