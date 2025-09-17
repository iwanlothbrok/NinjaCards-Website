'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

type FaqItem = { question: string; answer: string };
type FaqCategory = { category: string; items: FaqItem[] };

interface FrequentlyAskedQuestionsProps {
  searchTerm: string;
}

const FrequentlyAskedQuestions: React.FC<FrequentlyAskedQuestionsProps> = ({ searchTerm }) => {
  const t = useTranslations('FAQ');

  // Взимаме целия масив от преводите
  const categories = (t.raw('categories') as FaqCategory[]) || [];

  const [activeIndex, setActiveIndex] = useState<{ category: number; item: number } | null>(null);

  const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
    if (activeIndex?.category === categoryIndex && activeIndex.item === itemIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex({ category: categoryIndex, item: itemIndex });
    }
  };

  const q = (searchTerm || '').toLowerCase();
  const filtered = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (it) =>
        it.question?.toLowerCase().includes(q) ||
        it.answer?.toLowerCase().includes(q)
    ),
  }));

  return (
    <section className="bg-darkBg2 text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-12">
          {filtered.map((category, categoryIndex) =>
            category.items.length > 0 ? (
              <div key={categoryIndex}>
                <h3 className="text-3xl font-bold text-gray-100 mb-6 border-b border-gray-700 pb-2">
                  {category.category}
                </h3>

                <div className="space-y-4">
                  {category.items.map((faq, itemIndex) => {
                    const isOpen =
                      activeIndex?.category === categoryIndex &&
                      activeIndex?.item === itemIndex;

                    return (
                      <motion.div
                        key={itemIndex}
                        className={`bg-gray-800/80 rounded-lg shadow p-5 transition ${isOpen ? 'ring-1 ring-orange/50' : ''
                          }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          onClick={() => toggleFAQ(categoryIndex, itemIndex)}
                          className="w-full flex items-center justify-between gap-4 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="text-lg font-semibold text-gray-100">
                            {faq.question}
                          </span>
                          <motion.span
                            className="text-orange shrink-0"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                          >
                            {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              className="overflow-hidden"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="mt-4 text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
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
