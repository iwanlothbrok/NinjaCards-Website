import React from 'react';

interface HeaderProps {
    pageInformation: string;
    textOne: string;
    textTwo: string;
    textThree: string;
}

const Header: React.FC<HeaderProps> = ({ pageInformation, textOne, textTwo, textThree }) => {
    return (
        <div >
            {/* Background Image and Header Text */}
            <div
                className="relative pt-12 bg-cover bg-center h-[300px] md:h-[200px] lg:h-[250px] mb-10"
                style={{ backgroundImage: "url('/header.webp')" }}
            >
                <div className="absolute inset-0 bg-black opacity-70"></div> {/* Overlay for darkening */}
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="text-center">
                        <h1 className="text-4xl  lg:text-5xl mb-5 font-bold text-white animate-fade-in">
                            {pageInformation}
                        </h1>
                        <nav aria-label="breadcrumb">
                            <ol className="flex flex-wrap justify-center space-x-2 md:space-x-4 text-orange">
                                <li>
                                    <p className="text-lg md:text-xl hover:text-white transition duration-300">
                                        {textOne}
                                    </p>
                                </li>
                                <li>
                                    <span className="text-white  md:inline">|</span>
                                </li>
                                <li>
                                    <p className="text-lg md:text-xl hover:text-white transition duration-300">
                                        {textTwo}
                                    </p>
                                </li>
                                <li>
                                    <span className="text-white  md:inline">|</span>
                                </li>
                                <li>
                                    <p className="text-lg md:text-xl hover:text-white transition duration-300">
                                        {textThree}
                                    </p>
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
