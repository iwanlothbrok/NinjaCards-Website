'use client';

import { HomePage } from './components/layout/Home';
import About from './components/layout/About';
import Roadmap3 from './components/layout/Roadmap3';
import VideoTextSection from './components/layout/VideoTextSection';
import Testimonies from './components/layout/Testimonies';
import { motion } from 'framer-motion';
import ProductGallery from './components/product/ProductCard';
import FrequentlyAskedQuestions from './askedQuestions/FAQQuestions';
import SimpleContactForm from './components/layout/SimpleContactForm';
import Hero from './components/layout/Hero';
import { BASE_API_URL } from '@/utils/constants';

export default function Home() {
  if (!BASE_API_URL) {
    return null;
  }
  return (
    <main className="">

      {/* <HomePage /> */}
      <Hero />
      <About />
      <ProductGallery />
      <Testimonies />
      <SimpleContactForm />

    </main>
  );
}
