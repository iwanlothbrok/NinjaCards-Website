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
            <div className="relative bg-cover mb-10 bg-center h-[320px]" style={{ backgroundImage: "url('/header.webp')" }}>
                <div className="absolute inset-0 bg-black opacity-80"></div> {/* Overlay for darkening */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white animate-slide-in-down">
                            {pageInformation}
                        </h1>
                        <nav aria-label="breadcrumb">
                            <ol className="flex justify-center space-x-4 text-white">
                                <li>
                                    <a className="text-orange  hover:text-gray-300" href="/">Начало</a>
                                </li>
                                <li>
                                    <span>/</span>
                                </li>
                                <li>
                                    <a className="text-orange  hover:text-gray-300" href="/profile">Профил</a>
                                </li>
                                <li>
                                    <span>/</span>
                                </li>
                                <li>
                                    <a className="text-orange  hover:text-gray-300" href="/askedQuestions">Въпроси</a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Header;
