'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqData = [
  {
    question: 'What is an NFC Card?',
    answer: `An NFC (Near Field Communication) card is a smart card that can interact with NFC-enabled devices like smartphones. Just tap your Ninja NFC Card on a phone, and instantly share your contact information, social media profiles, or any other digital content. It's like having your personal ninja assistant for networking!`,
  },
  {
    question: 'How do I use my Ninja NFC Card?',
    answer: `Simply tap your Ninja NFC Card on any NFC-enabled smartphone or device, and your customized profile or information will be shared instantly. No app installation needed! It's the stealthy, seamless way to connect.`,
  },
  {
    question: 'Can I customize my Ninja NFC Card?',
    answer: `Absolutely! You can choose from a variety of designs, or even upload your own custom design. Personalize your Ninja NFC Card to match your style and brand. It's your ninja, your rules!`,
  },
  {
    question: 'Is my data secure with Ninja NFC Cards?',
    answer: `Yes, your data is safe with Ninja NFC Cards. The card doesn't store any data itself; it simply triggers the transfer of information to a secure URL. Your personal details are always protected, ensuring a ninja-level of stealth and security.`,
  },
  {
    question: 'Do Ninja NFC Cards work on all phones?',
    answer: `Ninja NFC Cards are compatible with most modern smartphones that support NFC technology, including iPhones (iPhone 7 and later) and most Android devices. It's like having a ninja that knows all the moves!`,
  },
  {
    question: 'How do I update the information on my Ninja NFC Card?',
    answer: `You can easily update the information on your Ninja NFC Card through our online portal. Just log in, make your changes, and your card will be updated instantly. No need for a new card – your ninja adapts to your needs!`,
  },
];

const FrequentlyAskedQuestions: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-darkBg to-darkBg2 pt-12 pb-24 flex flex-col justify-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-orange tracking-wide text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 transition-all duration-500 transform ${
                activeIndex === index ? '' : 'hover:scale-105'
              }`}
            >
              <div
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {faq.question}
                </h3>
                <span className="text-orange transform transition-transform duration-500">
                  {activeIndex === index ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </span>
              </div>
              {activeIndex === index && (
                <div
                  onClick={() => toggleFAQ(index)}
                  className="mt-4 text-orange text-sm sm:text-base opacity-90 transition-opacity duration-500 cursor-pointer"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
