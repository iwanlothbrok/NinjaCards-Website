'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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

    const sections = document.querySelectorAll('.fade-in-target');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white py-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 opacity-70"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Custom Moving Shapes */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-teal-500 opacity-30 rounded-full"
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-teal-300 opacity-40 rounded-full"
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
        {/* Video Section */}
        <motion.div
          className="md:w-1/2 flex justify-center items-center video-section fade-in-target opacity-0 transform transition-all duration-700 ease-in-out"
          whileHover={{ rotateY: 15, rotateX: 15 }}
        >
          <div className="relative rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 rounded-3xl border-4 border-teal-700 opacity-70 pointer-events-none"></div>
            <video
              className="w-full h-auto max-w-sm rounded-3xl"
              controls
              aria-label="Product demonstration video"
            >
              <source src="/test.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* Animated Divider Line */}
        <motion.div
          className="w-2 h-32 bg-teal-500 rounded-lg mx-8 hidden md:block"
          animate={{ scaleY: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        ></motion.div>

        {/* Text Section */}
        <motion.div
          className="md:w-1/2 text-section fade-in-target opacity-0 transform translate-y-8 transition-all duration-700 ease-in-out bg-teal-700 bg-opacity-75 backdrop-filter backdrop-blur-lg rounded-3xl p-12 shadow-2xl md:ml-12 mt-12 md:mt-0 relative"
          whileHover={{ rotateY: -15, rotateX: -15 }}
        >
          <h2 className="text-5xl font-extrabold text-orange mb-8">
            Discover Our Smart Cards
          </h2>
          <p className="text-xl font-light mb-8 leading-relaxed text-orange">
            Step into the future with our NFC-enabled smart cards. Share your information effortlessly with just a tap.
          </p>

          <ul className="space-y-6">
            {['Create your account', 'Set your links', 'Customize your design', 'Quick creation', 'Free shipping', 'Easy sharing'].map((item, index) => (
              <li key={index} className="relative flex items-center group">
                <span className="text-orange font-semibold mr-4 transform group-hover:scale-125 transition-transform duration-300">
                  ➤
                </span>
                <span className="text-gray-200 font-medium text-lg">
                  {item}
                </span>
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-teal-900 opacity-0 rounded-lg transition-opacity duration-300 group-hover:opacity-20"
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTextSection;
