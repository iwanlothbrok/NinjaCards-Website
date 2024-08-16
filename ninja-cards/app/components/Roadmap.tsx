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

    return () => {
      roadmapElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="min-h-screen bg-darkBg pt-6 sm:pt-12 pb-0 flex flex-col justify-center">
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange tracking-wider">
          Your Journey with Ninja NFC Card
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mt-4">
          Follow these steps to get started with your personalized Ninja NFC
          Card
        </p>
      </div>
      <div className="py-3 max-w-4xl mx-auto w-full px-2 sm:px-4">
        <div className="relative text-gray-200 antialiased text-sm font-semibold">
          <div className="block w-1 bg-teil absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"></div>
          {roadmapSteps.map((step, index) => (
            <div
              key={index}
              className={`mt-6 ${
                index === roadmapSteps.length - 1 ? 'mb-0' : 'mb-12'
              } flex ${
                index % 2 === 0 ? 'justify-start pr-8' : 'justify-end pl-8'
              } roadmap-step opacity-0 transform transition-all duration-700 ease-in-out`}
            >
              <div className="flex items-center w-full mx-auto">
                <div
                  className={`w-1/3 ${
                    index % 2 === 0 ? 'mr-8 order-first' : 'ml-8 order-last'
                  }`}
                >
                  <img
                    src={`/ninja-steps/ninja-step-${index + 1}.png`}
                    alt={`Step ${index + 1}`}
                    className="transform transition-transform duration-300 hover:scale-110 w-full mx-auto"
                  />
                </div>
                <div className="w-2/3 p-4 bg-charcoal rounded-lg shadow-lg transform transition-colors duration-300 hover:bg-darkOrange">
                  <h3 className="text-2xl sm:text-3xl font-bold text-orange mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base">
                    {step.description}
                  </p>
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
  },
  {
    title: 'Set Your Links',
    description:
      'Add the links you want to share on your profile, such as LinkedIn, Facebook, Instagram, and more.',
  },
  {
    title: 'Design Your Card',
    description:
      'Choose a design from our templates or send us your custom design. We will help you create the perfect look.',
  },
  {
    title: 'Card Creation',
    description:
      'We take 1-5 workdays to create your personalized smart card, ensuring the highest quality.',
  },
  {
    title: 'Free Shipping',
    description:
      'Enjoy free shipping on all orders. We send your cards to your provided address quickly and safely.',
  },
  {
    title: 'Share Your Contacts',
    description:
      'Your contacts can easily get your information by scanning your smart card. Networking made easy!',
  },
];

export default Roadmap;
