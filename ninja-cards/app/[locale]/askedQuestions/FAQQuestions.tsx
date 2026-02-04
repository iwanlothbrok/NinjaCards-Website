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
    <section className="bg-darkBg2 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="space-y-16">
          {filtered.map((category, categoryIndex) =>
            category.items.length > 0 ? (
              <div key={categoryIndex}>
                <div className="relative mb-8">
                  <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">
                    {category.category}
                  </h3>
                  <div className="w-44 h-1 bg-gradient-to-r from-orange to-transparent rounded-full" />
                </div>

                <div className="space-y-5">
                  {category.items.map((faq, itemIndex) => {
                    const isOpen =
                      activeIndex?.category === categoryIndex &&
                      activeIndex?.item === itemIndex;

                    return (
                      <motion.div
                        key={itemIndex}
                        className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 ${isOpen
                          ? 'border-orange shadow-orange/20 shadow-2xl'
                          : 'border-gray-700/50 hover:border-gray-600/70'
                          }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <button
                          onClick={() => toggleFAQ(categoryIndex, itemIndex)}
                          className="w-full flex items-center justify-between gap-6 text-left p-6"
                          aria-expanded={isOpen}
                        >
                          <span className="text-xl font-semibold text-white leading-relaxed">
                            {faq.question}
                          </span>
                          <motion.span
                            className="text-orange shrink-0"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaChevronDown size={22} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              className="overflow-hidden border-t border-gray-700/50"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                              <div className="px-6 py-5">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                  {faq.answer}
                                </p>
                              </div>
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
