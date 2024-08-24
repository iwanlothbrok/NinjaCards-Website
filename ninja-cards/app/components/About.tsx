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
    <div className="relative bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col md:flex-row items-center justify-evenly p-8 md:p-16">
      <motion.div
        className="max-w-md about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center md:text-left">
          What Are NFC Ninja Cards?
        </h2>
        <p className="text-gray-400 mb-8 text-center md:text-left">
          NFC Ninja Cards are the future of networking, combining sleek design
          with cutting-edge technology. With just a tap, you can share your
          contact information, social media profiles, or any other digital
          content instantly and securely. No more fumbling for paper cards—NFC
          Ninja Cards streamline your connections, making it easier than ever to
          leave a lasting impression.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Instant Sharing
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Eco-Friendly
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Customizable
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Secure Data
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Professional Design
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Durable
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Easy Integration
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Versatile Use
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Contactless
            </div>
          </div>
        </div>
        <div className="mt-8 mb-8 flex justify-center md:justify-start">
          <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105 focus:outline-none">
            Get Your NFC Ninja Card
          </button>
        </div>
      </motion.div>

      {/* iPhone Mockup */}
      <motion.section
        className="relative flex items-center justify-center w-[212px] h-[438px] bg-cover bg-center rounded-[35px] transform transition-transform duration-500 hover:scale-105 border border-white"
        style={{
          backgroundImage:
            "url('https://webdevartur.com/wp-content/uploads/2022/08/ryan-klaus-8QjsdoXDsZs-unsplash-scaled.jpg')",
        }}
      // initial={{ opacity: 0, scale: 0.9 }}
      // animate={{ opacity: 1, scale: 1 }}
      // transition={{ duration: 1, ease: 'easeOut' }}
      >
        <img
          src="/profile-details-screenshot-iphone-mockup.png"
          alt="Profile Details Screenshot"
          className="absolute w-[95%] h-[95%] object-cover rounded-[29px] transform transition-transform duration-500 hover:scale-100"
        />
      </motion.section>

      {/* Parallax Background */}
      <div className="absolute inset-0 bg-[url('/path-to-your-svg.svg')] bg-fixed bg-center bg-no-repeat bg-opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default About;
