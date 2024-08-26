'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt } from 'react-icons/fa';

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white flex flex-col md:flex-row items-center justify-evenly p-8 md:p-16">
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
          {[
            'Instant Sharing',
            'Eco-Friendly',
            'Customizable',
            'Secure Data',
            'Professional Design',
            'Durable',
            'Easy Integration',
            'Versatile Use',
            'Contactless',
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              {isMobile && (
                <FaMobileAlt className="text-green-500 mr-2" />
              )}
              <span className="mr-2 text-lg text-green-500">✔</span> {item}
            </div>
          ))}
        </div>
        <div className="mt-10 mb-8 flex justify-center md:justify-start">
          <button className="bg-gradient-to-r from-orange to-teal-700 text-white px-9 py-5 rounded-full transition-transform transform hover:scale-105 focus:outline-none shadow-lg">
            Get Your NFC Ninja Card
          </button>
        </div>
      </motion.div>

      {/* iPhone Mockup */}
      <motion.section
        className="relative flex items-center justify-center w-[300px] h-[600px] bg-cover bg-center rounded-[35px] transform transition-transform duration-500 hover:scale-105 border border-white shadow-2xl"
        style={{
          backgroundImage:
            "url('https://webdevartur.com/wp-content/uploads/2022/08/ryan-klaus-8QjsdoXDsZs-unsplash-scaled.jpg')",
        }}
      >
        <img
          src="/mocked.png"
          alt="Profile Details Screenshot"
          className="absolute w-[99%] h-[100%] object-cover rounded-[29px] transform transition-transform duration-500 hover:scale-100"
        />
      </motion.section>

      {/* Parallax Background */}
      {/* <div className="absolute inset-0 bg-[url('/path-to-your-svg.svg')] bg-fixed bg-center bg-no-repeat bg-opacity-50 pointer-events-none"></div> */}
    </div>
  );
};

export default About;
