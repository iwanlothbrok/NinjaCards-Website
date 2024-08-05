"use client";

import React from 'react';

const VideoTextSection: React.FC = () => {
    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <div className="overflow-hidden rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-110 hover:shadow-teal">
                        <video className="w-full h-auto" controls>
                            <source src="/test.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                    <h2 className="text-4xl font-bold text-teal mb-4">Discover Our Smart Cards</h2>
                    <p className="text-gray-700 mb-4">
                        Step into the future with our NFC-enabled smart cards. Share your information effortlessly with just a tap.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><span className="text-orange">Create your account:</span> Set up your profile with ease.</li>
                        <li><span className="text-orange">Set your links:</span> Add social media, websites, and more.</li>
                        <li><span className="text-orange">Customize your design:</span> Choose from templates or send us your own.</li>
                        <li><span className="text-orange">Quick creation:</span> Cards ready in 1-5 workdays.</li>
                        <li><span className="text-orange">Free shipping:</span> Delivered swiftly to your door.</li>
                        <li><span className="text-orange">Easy sharing:</span> Tap your card to share your contacts.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default VideoTextSection;
