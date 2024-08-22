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
    <div className="bg-black text-white flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why is it so great?</h2>
        <p className="text-gray-400 mb-8">
          Nunc tincidunt vulputate elit. Mauris varius purus malesuada neque iaculis malesuada.
          Aenean gravida magna orci, non efficitur est porta id. Donec magna diam.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Support 24/7
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Updates
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Modules
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Analytics
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Reports
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Blocks
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Components
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Mobile
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Templates
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-0">
        {/* iPhone mockup */}
        <div className="relative flex justify-center items-center p-4 bg-black rounded-3xl shadow-lg" style={{ width: '300px', height: '600px' }}>
          <div className="absolute inset-0 bg-black rounded-2xl" style={{ padding: '20px', border: '10px solid #333', borderRadius: '30px' }}>
            <div className="bg-black w-full h-full rounded-lg overflow-hidden shadow-inner">
              <div className="bg-white text-black text-center p-6">
                <p className="text-lg">Good evening,</p>
                <p className="text-2xl font-bold">Friday, October 2</p>
                <p className="text-sm text-gray-500">Mahatma Gandhi Jayanti</p>
              </div>
              <div className="flex justify-around mt-8">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 h-6" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="7" y="3" width="10" height="18" rx="2"></rect>
                    <line x1="12" y1="17" x2="12" y2="17.01"></line>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 h-6" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="9" r="6"></circle>
                    <line x1="12" y1="15" x2="12" y2="21"></line>
                    <line x1="9" y1="18" x2="15" y2="18"></line>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 h-6" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <line x1="7" y1="15" x2="7.01" y2="15"></line>
                    <line x1="11" y1="15" x2="13" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
