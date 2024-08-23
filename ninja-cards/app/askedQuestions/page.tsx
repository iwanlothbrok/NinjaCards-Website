'use client';

import React, { useState } from 'react';
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkBg to-darkBg2">
      {/* Hero Section */}
      <header className="mt-12 flex flex-col justify-center items-center text-center py-20 bg-darkBg">
        <h1 className="text-5xl font-extrabold text-white">Ninja NFC Cards</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          Have questions? We’ve got answers. Explore our FAQs below or use the
          search bar to find what you’re looking for.
        </p>
        <div className="mt-8 w-full max-w-lg">
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-4 py-2 text-lg text-gray-800 rounded-md shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {/* FAQ Section */}
      <FrequentlyAskedQuestions searchTerm={searchTerm} />
    </div>
  );
};

export default FAQPage;
