'use client';

import React, { useEffect } from 'react';

const About: React.FC = () => {
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

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-teal-800 via-teal-900 to-teal-950 text-white py-20 overflow-hidden">
      {/* 3D Floating Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-teal-600 opacity-40 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-teal-700 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

      <section
        id="features"
        className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-800"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-orange-500 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
            Why Choose Our Cards
          </span>
          <h2 className="block w-full font-bold text-orange text-3xl sm:text-5xl">
            Elevate Your Networking with NFC Technology
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-300 transition-colors duration-500 hover:text-gray-100">
            Our NFC Business and Google Cards are designed to simplify and
            enhance your professional connections. Whether you're networking in
            person or sharing your information online, our cards offer seamless
            and innovative solutions.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-white-700 bg-neutral-800/70 p-8 text-center shadow-lg transform transition-transform hover:scale-105 hover:bg-teil hover:shadow-2xl hover:translate-y-2">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-teal-700 bg-neutral-800 shadow-inner transform transition-transform hover:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-device-mobile text-teil"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="7" y="3" width="10" height="18" rx="2"></rect>
                <line x1="12" y1="17" x2="12" y2="17.01"></line>
              </svg>
            </div>
            <h3 className="mt-6 text-orange">Seamless Integration</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-300 transition-colors duration-500 hover:text-gray-100">
              Easily integrate your NFC cards with Google Contacts and other
              digital services for instant sharing.
            </p>
          </div>

          <div className="rounded-md border border-white bg-neutral-800/70 p-8 text-center shadow-lg transform transition-transform hover:scale-105 hover:bg-teil hover:shadow-2xl hover:translate-y-2">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-teal-700 bg-neutral-800 shadow-inner transform transition-transform hover:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-network text-teil"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="9" r="6"></circle>
                <line x1="12" y1="15" x2="12" y2="21"></line>
                <line x1="9" y1="18" x2="15" y2="18"></line>
              </svg>
            </div>
            <h3 className="mt-6 text-orange">Innovative Networking</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-300 transition-colors duration-500 hover:text-gray-100">
              Exchange contact information instantly and effortlessly with
              NFC-enabled business cards.
            </p>
          </div>

          <div className="rounded-md border border-white-700 bg-neutral-800/70 p-8 text-center shadow-lg transform transition-transform hover:scale-105 hover:bg-teil hover:shadow-2xl hover:translate-y-2">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-teal-700 bg-neutral-800 shadow-inner transform transition-transform hover:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-credit-card text-teil"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="7" y1="15" x2="7.01" y2="15"></line>
                <line x1="11" y1="15" x2="13" y2="15"></line>
              </svg>
            </div>
            <h3 className="mt-6 text-orange">Custom Designs</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-300 transition-colors duration-500 hover:text-gray-100">
              Choose from a variety of customizable designs to match your brand
              and personality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
