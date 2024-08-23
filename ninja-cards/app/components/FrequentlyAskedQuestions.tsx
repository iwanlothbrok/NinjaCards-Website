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
    <section className="py-16 bg-darkBg2 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-orange text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform ${
                activeIndex === index ? 'scale-105' : 'scale-100'
              }`}
            >
              <div
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <span className="text-orange">
                  {activeIndex === index ? (
                    <FaChevronUp size={24} />
                  ) : (
                    <FaChevronDown size={24} />
                  )}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  activeIndex === index
                    ? 'max-h-[200px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="mt-4 text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
