'use client';
import React, { useEffect } from 'react';

const Roadmap: React.FC = () => {
  useEffect(() => {
    const roadmapTitles = document.querySelectorAll('.roadmap-step-title');
    const roadmapLine = document.querySelector('.roadmap-line') as HTMLElement;
    const roadmapContainer = document.querySelector(
      '.roadmap-section'
    ) as HTMLElement;
    const lastStep = document.querySelector(
      '.roadmap-step:last-child'
    ) as HTMLElement;

    const handleScroll = () => {
      let activeStepIndex = -1;

      roadmapTitles.forEach((title, index) => {
        const rect = title.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          activeStepIndex = index;
        }
      });

      if (roadmapLine && activeStepIndex >= 0) {
        const totalSteps = roadmapTitles.length;
        const percentageScrolled = (activeStepIndex + 1) / totalSteps;

        const roadmapContainerHeight =
          roadmapContainer.getBoundingClientRect().height;
        const lastStepOffset = lastStep.offsetTop + lastStep.clientHeight / 2;
        const lineHeight = percentageScrolled * roadmapContainerHeight;

        roadmapLine.style.height = `${Math.min(lineHeight, lastStepOffset)}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="min-h-screen bg-darkBg pt-2 sm:pt-6 pb-0 flex flex-col justify-center roadmap-section">
      <div className="text-center mb-6 px-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-orange tracking-wider">
          Your Journey with Ninja NFC Card
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-2">
          Follow these steps to get started with your personalized Ninja NFC
          Card
        </p>
      </div>
      <div className="py-1 max-w-2xl mx-auto w-full px-1 sm:px-2">
        <div className="relative text-gray-200 antialiased text-xs font-semibold">
          <div className="roadmap-line-container">
            <div className="roadmap-line bg-orange absolute left-1/2 transform -translate-x-1/2 w-1 z-0"></div>
          </div>
          {roadmapSteps.map((step, index) => (
            <div
              key={index}
              className={`mt-3 ${
                index === roadmapSteps.length - 1 ? 'mb-0' : 'mb-6'
              } flex ${
                index % 2 === 0 ? 'justify-start pr-2' : 'justify-end pl-2'
              } roadmap-step transform transition-all duration-700 ease-in-out`}
            >
              <div className="flex items-center w-full mx-auto">
                <div
                  className={`w-1/5 ${
                    index % 2 === 0 ? 'mr-2 order-first' : 'ml-2 order-last'
                  }`}
                >
                  <img
                    src={`/ninja-steps/ninja-step-${index + 1}.png`}
                    alt={`Step ${index + 1}`}
                    className="transform transition-transform duration-300 hover:scale-110 w-full mx-auto"
                  />
                </div>
                <div className="w-4/5 p-4 bg-charcoal rounded-lg shadow-lg transform transition-colors duration-300 hover:bg-darkOrange">
                  <h3 className="text-base sm:text-lg font-bold text-orange mb-1 roadmap-step-title">
                    {step.title}
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm">
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
