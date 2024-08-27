'use client';

import { HomePage } from './components/layout/Home';
import About from './components/layout/About';

import Roadmap3 from './components/layout/Roadmap3';
import VideoTextSection from './components/layout/VideoTextSection';
import Testimonies from './components/layout/Testimonies';
import { motion } from 'framer-motion';
import ProductGallery from './components/product/ProductCard';
import FrequentlyAskedQuestions from './components/FrequentlyAskedQuestions';
import SimpleContactForm from './components/layout/SimpleContactForm';
import Features from './components/layout/Features';

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <About />
      <ProductGallery />
      <Testimonies />
      <Roadmap3 />
      <FrequentlyAskedQuestions searchTerm={''} />
      {/* <VideoTextSection /> */}
      {/* <FeaturesSection /> */}
      <SimpleContactForm />
    </main>
  );
}
