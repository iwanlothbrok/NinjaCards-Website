'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="relative bg-black text-white flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <motion.div
        className="max-w-md about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center md:text-left">
          Why is it so great?
        </h2>
        <p className="text-gray-400 mb-8 text-center md:text-left">
          Nunc tincidunt vulputate elit. Mauris varius purus malesuada neque
          iaculis malesuada. Aenean gravida magna orci, non efficitur est porta
          id. Donec magna diam.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
        <div className="mt-8 flex justify-center md:justify-start">
          <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105 focus:outline-none">
            Learn More
          </button>
        </div>
      </motion.div>

      {/* iPhone Mockup */}
      <motion.section
        className="relative flex items-center justify-center mt-8 md:mt-0 w-[212px] h-[438px] bg-cover bg-center rounded-[35px] border border-white"
        style={{
          backgroundImage:
            "url('https://webdevartur.com/wp-content/uploads/2022/08/ryan-klaus-8QjsdoXDsZs-unsplash-scaled.jpg')",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* iPhone Details */}
        <img
          src="/profile-details-screenshot-iphone-mockup.png"
          alt="Profile Details Screenshot"
          className="absolute w-[50%] h-[50%] object-cover rounded-[29px] transform transition-transform duration-500 hover:scale-110"
        />
        {/* Additional Elements */}
        <div className="absolute left-[35px] top-[35px] text-xs text-gray-400">
          Codepen by{' '}
          <a
            href="https://webdevartur.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fc7904] hover:underline"
          >
            Artur Burkalo
          </a>
        </div>
      </motion.section>

      {/* Parallax Background */}
      <div className="absolute inset-0 bg-[url('/path-to-your-svg.svg')] bg-fixed bg-center bg-no-repeat bg-opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default About;
