// page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useTranslations } from 'next-intl';
import Header from '../components/layout/Header';
import FrequentlyAskedQuestions from './FAQQuestions';
import FAQVideos from './FAQVideos';

type VideoItem = {
  imagePath: string;
  headerText: string;
  paragraphText: string;
  url: string;
};

const FAQPage = () => {
  // Namespaced translators
  const t = useTranslations('FAQPage');      // page strings + videos
  const tv = useTranslations('FAQVideos');   // CTA + alt

  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);

  // Read videos array from translations
  const videos = (t.raw('videos') as VideoItem[]) || [];

  const openModal = (url: string) => {
    setVideoUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setVideoUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-950 text-white">
      <Header
        pageInformation={t('header.pageInformation')}
        textOne={t('header.textOne')}
        textTwo={t('header.textTwo')}
        textThree={t('header.textThree')}
      />

      {/* Videos grid */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v, i) => (
            <FAQVideos
              key={i}
              imagePath={v.imagePath}
              headerText={v.headerText}
              paragraphText={v.paragraphText}
              url={v.url}
              openModal={openModal}
              ctaText={tv('cta')}
              alt={tv('alt')}
            />
          ))}
        </div>
      </div>

      {/* Hero / Search */}
      <header className="container mx-auto px-4 md:px-8 lg:px-12 pb-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-200">{t('intro')}</p>
          <div className="mt-6 w-full">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="w-full px-5 py-3 text-base text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={t('search.ariaLabel')}
            />
          </div>
        </div>
      </header>

      {/* FAQ */}
      <div className="pb-12">
        <FrequentlyAskedQuestions searchTerm={searchTerm} />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={t('modal.label')}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black/80 z-40"
      >
        <div className="relative w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-xl">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-800 bg-gray-100 rounded-full w-9 h-9 grid place-items-center hover:bg-gray-200 transition-colors"
            aria-label={t('modal.close')}
          >
            ×
          </button>
          {videoUrl && (
            <iframe
              width="100%"
              height="480"
              src={videoUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube video player"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FAQPage;
