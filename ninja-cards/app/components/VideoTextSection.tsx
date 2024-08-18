'use client';

import React, { useEffect } from 'react';

const VideoTextSection: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.text-section, .video-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <section className="bg-darkBg py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 video-section opacity-0 transform translate-y-8 transition-all duration-700 ease-in-out">
          <div className="overflow-hidden rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:shadow-darkOrange">
            <video className="w-96 h-96" controls>
              <source src="/test.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="md:w-1/2 md:pl-12 md:ml-8 ml-0 text-section bg-darkBg rounded-lg p-8 shadow-lg opacity-0 transform translate-y-8 transition-all duration-700 ease-in-out">
          <h2 className="text-4xl font-bold text-orange mb-6">
            Discover Our Smart Cards
          </h2>
          <p className="text-white bg-teil p-4 rounded-lg bg-teil shadow-md mb-6 text-xl font-semibold">
            Step into the future with our NFC-enabled smart cards. Share your
            information effortlessly with just a tap.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Create your account: Set up your profile with ease.
              </span>
            </li>
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Set your links: Add social media, websites, and more.
              </span>
            </li>
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Customize your design: Choose from templates or send us your
                own.
              </span>
            </li>
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Quick creation: Cards ready in 1-5 workdays.
              </span>
            </li>
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Free shipping: Delivered swiftly to your door.
              </span>
            </li>
            <li className="flex items-start hover:scale-105 transition-transform duration-300">
              <span className="text-orange font-semibold mr-2">➤</span>
              <span className="text-gray">
                Easy sharing: Tap your card to share your contacts.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default VideoTextSection;
