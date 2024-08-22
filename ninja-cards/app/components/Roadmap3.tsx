'use client';
import React from 'react';

const RoadmapHybrid: React.FC = () => {
  return (
    <section className="min-h-screen bg-darkBg mt-10 pt-6 pb-10 flex flex-col justify-center">
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange tracking-wide">
          Your Journey with Ninja NFC Card
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mb-6 mt-4 max-w-xl mx-auto">
          Follow these steps to get started with your personalized Ninja NFC
          Card
        </p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmapSteps.map((step, index) => (
            <li
              key={index}
              className="relative flex flex-col items-center bg-gray-800 rounded-xl shadow-lg p-6 m-2 transform transition-transform duration-300 hover:bg-orange group hover:scale-105 hover:text-black group-hover:shadow-2xl mb-8"
            >
              {/* NUMBERS WITH HOVER EFFECTS */}
              <div className="relative  w-12 h-12 mx-auto -mt-16 rounded-full ring-8 ring-white bg-orange group-hover:bg-charcoal group-hover:text-white flex items-center justify-center text-lg font-bold text-darkBg shadow-lg transition-all duration-300 group-hover:scale-110">
                {index + 1}
              </div>
              {/* END OF NUMBERS */}

              <div className="space-y-4 text-center mt-6">
                <img
                  src={`/ninja-steps/ninja-step-${index + 1}.png`}
                  alt={`Step ${index + 1}`}
                  className="h-28 w-auto mx-auto mt-4 object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <h3 className="text-lg sm:text-xl font-bold group-hover:font-extrabold text-orange mb-2 group-hover:text-charcoal text-center transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base group-hover:text-black text-center transition-opacity duration-300 group-hover:opacity-90">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
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

export default RoadmapHybrid;
