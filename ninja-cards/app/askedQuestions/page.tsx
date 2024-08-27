'use client';

import React, { useState } from 'react';
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions';
import Modal from 'react-modal';
import { FaPlay } from 'react-icons/fa'; // Importing the play icon from Font Awesome

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
    <div className="min-h-screen   text-white">
      {/* Hero Section */}
      <header className="mt-12 flex flex-col justify-center items-center text-center pt-20">
        <h1 className="text-5xl font-extrabold">Ninja NFC Cards</h1>
        <p className="mt-4 text-lg max-w-2xl">
          Have questions? We’ve got answers. Explore our FAQs below or use the search bar to find what you’re looking for.
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
      {/* Card Section */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-5 gap-8">
          <div className="max-w-md">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src="/front.png"
                alt="TAP Metal Card"
                className="w-full h-68 object-cover cursor-pointer"
                onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">How to TAP Metal Cards</h3>
                <p className="text-gray-600 mb-4">Here’s a short video to show you how to TAP our metal cards.</p>
                <button
                  className="bg-orange text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                  onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                >
                  <FaPlay className="mr-2" /> Watch
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-md ">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src="/front.png"
                alt="TAP PVC Card"
                className="w-full h-68 object-cover cursor-pointer"
                onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">How to TAP PVC Cards</h3>
                <p className="text-gray-600 mb-4">Here’s a short video to show you how to TAP our PVC cards.</p>
                <button
                  className="bg-orange text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                  onClick={() => openModal('https://www.youtube.com/embed/jpUATY8-hpo')}
                >
                  <FaPlay className="mr-2" /> Watch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


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
