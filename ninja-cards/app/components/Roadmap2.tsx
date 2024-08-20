'use client';
import React from 'react';

const Roadmap2: React.FC = () => {
  return (
    <section className="min-h-screen bg-darkBg pt-6 pb-10 flex flex-col justify-center">
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange tracking-wide">
          Your Journey with Ninja NFC Card
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mt-4 max-w-xl mx-auto">
          Follow these steps to get started with your personalized Ninja NFC
          Card
        </p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {roadmapSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center bg-charcoal rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105 group hover:shadow-2xl"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-0 group-hover:opacity-100 group-hover:duration-200 rounded-lg"
                aria-hidden="true"
              ></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-orange text-darkBg font-bold rounded-full mb-4 text-2xl transition-all duration-300 group-hover:scale-110">
                  {index + 1}
                </div>
                <img
                  src={`/ninja-steps/ninja-step-${index + 1}.png`}
                  alt={`Step ${index + 1}`}
                  className="w-28 h-28 mb-4 object-contain transition-transform duration-300 group-hover:rotate-6"
                />
                <h3 className="text-lg sm:text-xl font-bold text-orange mb-2 text-center transition-colors duration-300 group-hover:text-pink-600">
                  {step.title}
                </h3>
                <p className="text-gray-200 text-sm sm:text-base text-center transition-opacity duration-300 group-hover:opacity-90">
                  {step.description}
                </p>
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

export default Roadmap2;
