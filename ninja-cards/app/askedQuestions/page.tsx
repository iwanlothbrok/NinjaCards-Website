// page.tsx
'use client';

import React, { useState } from 'react';
import FrequentlyAskedQuestions from './FAQQuestions';
import Modal from 'react-modal';
import { FaPlay } from 'react-icons/fa'; // Importing the play icon from Font Awesome
import FAQVideos from './FAQVideos';
import Header from '../components/layout/Header';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openModal = (url: string) => {
    setVideoUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setVideoUrl('');
  };

  return (
    <div className="min-h-screen text-white">
      <Header pageInformation='Имате въпрос' textOne='Визитки' textTwo='Ревюта' textThree='Дизайн' />

      {/* Hero Section */}
      <FAQVideos openModal={openModal} />
      <header className="mt-0 mb-6 p-6 flex flex-col justify-center items-center text-center ">
        <p className="text-lg max-w-2xl">
          Имате въпроси? Имаме отговори. Разгледайте нашите често задавани въпроси по-долу или използвайте лентата за търсене, за да намерите това, което търсите.
        </p>
        <div className="mt-8 w-full max-w-lg">
          <input
            type="text"
            placeholder="Търсене на отговор на..."
            className="w-full px-6 py-2 text-lg text-gray-800 rounded-md shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>
      {/* FAQ Section */}
      <FrequentlyAskedQuestions searchTerm={searchTerm} />

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Video Modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="relative w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-xl">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-800 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
          >
            &times;
          </button>
          <iframe
            width="100%"
            height="450px"
            src={videoUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="YouTube video player"
          />
        </div>
      </Modal>
    </div>
  );
};

export default FAQPage;
