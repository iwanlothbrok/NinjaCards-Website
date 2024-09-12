import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { text } from 'stream/consumers';

interface HeaderProps {
    pageInformation: string;
    textOne: string;
    textTwo: string;
    textThree: string;

}

const Header: React.FC<HeaderProps> = ({ pageInformation, textOne, textTwo, textThree }) => {
    return (
        <div>
            {/* Background Image and Header Text */}
            <div className="relative bg-cover mb-10 bg-center h-[300px]" style={{ backgroundImage: "url('/header.webp')" }}>
                <div className="absolute inset-0 bg-black opacity-80"></div> {/* Overlay for darkening */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-5xl mb-5 font-bold text-white animate-slide-in-down">
                            {pageInformation}
                        </h1>
                        <nav aria-label="breadcrumb">
                            <ol className="flex justify-center space-x-4 text-white">
                                <li>
                                    <p className='text-xl text-white'>{textOne}</p>
                                </li>
                                <li>
                                    <span> | </span>
                                </li>
                                <li>
                                    <p className='text-xl text-white'>{textTwo}</p>
                                </li>
                                <li>
                                    <span> | </span>
                                </li>
                                <li>
                                    <p className='text-xl text-white'>{textThree}</p>
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
