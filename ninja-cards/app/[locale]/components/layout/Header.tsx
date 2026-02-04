import React from 'react';

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
            <div
                className="relative pt-12 bg-cover bg-center h-[300px] md:h-[300px] lg:h-[400px] mb-10"
                style={{ backgroundImage: "url('/header.webp')" }}
            >
                {/* Gradient Overlay for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

                {/* Animated subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="text-center space-y-8">
                        {/* Enhanced Title with gradient text */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange via-amber-400 to-orange animate-fade-in drop-shadow-2xl">
                            {pageInformation}
                        </h1>

                        {/* Premium Breadcrumb Navigation */}
                        <nav aria-label="breadcrumb" className="animate-fade-in animation-delay-200">
                            <ol className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
                                <li className="group">
                                    <p className="text-lg md:text-xl font-medium text-orange/90 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer drop-shadow-lg">
                                        {textOne}
                                    </p>
                                </li>
                                <li>
                                    <span className="text-orange/50 text-2xl font-light">•</span>
                                </li>
                                <li className="group">
                                    <p className="text-lg md:text-xl font-medium text-orange/90 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer drop-shadow-lg">
                                        {textTwo}
                                    </p>
                                </li>
                                <li>
                                    <span className="text-orange/50 text-2xl font-light">•</span>
                                </li>
                                <li className="group">
                                    <p className="text-lg md:text-xl font-medium text-orange/90 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer drop-shadow-lg">
                                        {textThree}
                                    </p>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Bottom fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
        </div>
    );
};

export default Header;
