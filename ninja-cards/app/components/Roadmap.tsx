'use client';

import React, { useEffect } from 'react';

const Roadmap: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          } else {
            entry.target.classList.remove('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const roadmapElements = document.querySelectorAll('.roadmap-step');
    roadmapElements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount
    return () => {
      roadmapElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="min-h-screen bg-darkBg pt-6 sm:pt-12 pb-0 sm:pb-0 flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange tracking-wider">
          Your Journey with Ninja NFC Card
        </h1>
        <p className="text-lg text-gray-300 mt-4">
          Follow these steps to get started with your personalized Ninja NFC
          Card
        </p>
      </div>

      <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0 pb-0 pt-0">
        <div className="relative text-gray-200 antialiased text-sm font-semibold">
          <div className="hidden sm:block w-1 bg-teil absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"></div>

          {roadmapSteps.map((step, index) => (
            <div
              key={index}
              className={`mt-6 ${
                index === roadmapSteps.length - 1 ? 'mb-0' : 'mb-12'
              } flex ${
                index % 2 === 0
                  ? 'justify-start sm:pr-8'
                  : 'justify-end sm:pl-8'
              } roadmap-step opacity-0 transform transition-all duration-700 ease-in-out`}
            >
              <div className="flex flex-col sm:flex-row items-center w-full mx-auto">
                <div
                  className={`w-1/3 ${
                    index % 2 === 0
                      ? 'sm:mr-8 order-first'
                      : 'sm:ml-8 order-last'
                  }`}
                >
                  <img
                    src={`/ninja-steps/ninja-step-${index + 1}.png`}
                    alt={`Step ${index + 1}`}
                    className="rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="w-full sm:w-2/3 p-4 bg-charcoal rounded-lg shadow-lg transform transition-colors duration-300 hover:bg-darkOrange">
                  <h3 className="text-3xl font-bold text-orange mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-200">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const roadmapSteps = [
  {
    title: 'Create Account',
    description:
      'Sign up on our platform to get started. Fill in your personal information to create your unique profile.',
    // iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    title: 'Set Your Links',
    description:
      'Add the links you want to share on your profile, such as LinkedIn, Facebook, Instagram, and more.',
    // iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    title: 'Design Your Card',
    description:
      'Choose a design from our templates or send us your custom design. We will help you create the perfect look.',
    // iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Card Creation',
    description:
      'We take 1-5 workdays to create your personalized smart card, ensuring the highest quality.',
    // iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  },
  {
    title: 'Free Shipping',
    description:
      'Enjoy free shipping on all orders. We send your cards to your provided address quickly and safely.',
    // iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Share Your Contacts',
    description:
      'Your contacts can easily get your information by scanning your smart card. Networking made easy!',
    // iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
];

export default Roadmap;
