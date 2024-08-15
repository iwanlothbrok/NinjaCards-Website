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
    <section className="about-section w-full py-16 bg-darkBg text-center opacity-0 transform translate-y-8 transition-all duration-700 ease-in-out">
      <h2 className="text-4xl font-extrabold text-orange mb-6">About Us</h2>
      <p className="max-w-2xl mx-auto text-lg text-gray-300">
        Brief description about the company or the product. This section can
        include the mission, vision, and values of the company.
      </p>
    </section>
  );
};

export default About;
