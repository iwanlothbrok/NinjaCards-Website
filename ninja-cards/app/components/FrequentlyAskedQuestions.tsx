'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaLightbulb } from 'react-icons/fa';

const faqData = [
  {
    category: 'General',
    items: [
      {
        question: 'What is an NFC Card?',
        answer: `An NFC (Near Field Communication) card is a smart card that can interact with NFC-enabled devices like smartphones. Just tap your Ninja NFC Card on a phone, and instantly share your contact information, social media profiles, or any other digital content. It's like having your personal ninja assistant for networking!`,
      },
      {
        question: 'How do I use my Ninja NFC Card?',
        answer: `Simply tap your Ninja NFC Card on any NFC-enabled smartphone or device, and your customized profile or information will be shared instantly. No app installation needed! It's the stealthy, seamless way to connect.`,
      },
    ],
  },
  {
    category: 'Customization',
    items: [
      {
        question: 'Can I customize my Ninja NFC Card?',
        answer: `Absolutely! You can choose from a variety of designs, or even upload your own custom design. Personalize your Ninja NFC Card to match your style and brand. It's your ninja, your rules!`,
      },
      {
        question: 'How do I update the information on my Ninja NFC Card?',
        answer: `You can easily update the information on your Ninja NFC Card through our online portal. Just log in, make your changes, and your card will be updated instantly. No need for a new card – your ninja adapts to your needs!`,
      },
    ],
  },
  {
    category: 'Security',
    items: [
      {
        question: 'Is my data secure with Ninja NFC Cards?',
        answer: `Yes, your data is safe with Ninja NFC Cards. The card doesn't store any data itself; it simply triggers the transfer of information to a secure URL. Your personal details are always protected, ensuring a ninja-level of stealth and security.`,
      },
    ],
  },
  {
    category: 'Compatibility',
    items: [
      {
        question: 'Do Ninja NFC Cards work on all phones?',
        answer: `Ninja NFC Cards are compatible with most modern smartphones that support NFC technology, including iPhones (iPhone 7 and later) and most Android devices. It's like having a ninja that knows all the moves!`,
      },
    ],
  },
];

const FrequentlyAskedQuestions: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<{ category: number; item: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
    if (activeIndex?.category === categoryIndex && activeIndex.item === itemIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex({ category: categoryIndex, item: itemIndex });
    }
  };

  const filteredFAQs = faqData.map((category) => ({
    ...category,
    items: category.items.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <section className="py-16 bg-darkBg2 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-orange text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-12">
          {filteredFAQs.map((category, categoryIndex) =>
            category.items.length > 0 ? (
              <div key={categoryIndex}>
                <h3 className="text-3xl font-bold text-gray-100 mb-8 border-b-2 border-gray-700 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-6">
                  {category.items.map((faq, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform ${
                        activeIndex?.category === categoryIndex &&
                        activeIndex?.item === itemIndex
                          ? 'scale-105'
                          : 'scale-100'
                      }`}
                    >
                      <div
                        onClick={() => toggleFAQ(categoryIndex, itemIndex)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <h4 className="text-xl font-semibold">{faq.question}</h4>
                        <span className="text-orange">
                          {activeIndex?.category === categoryIndex &&
                          activeIndex?.item === itemIndex ? (
                            <FaChevronUp size={24} />
                          ) : (
                            <FaChevronDown size={24} />
                          )}
                        </span>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          activeIndex?.category === categoryIndex &&
                          activeIndex?.item === itemIndex
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
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
