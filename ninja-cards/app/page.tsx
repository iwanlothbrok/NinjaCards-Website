'use client';

import { HomePage } from './components/layout/Home';
import Features from './components/Features';
import About from './components/layout/About';

import Roadmap3 from './components/layout/Roadmap3';
import VideoTextSection from './components/layout/VideoTextSection';
import FeaturesSection from './components/FeaturesSection';
import Testimonies from './components/layout/Testimonies';
import { motion } from 'framer-motion';
import ProductGallery from './components/product/ProductCard';
import FrequentlyAskedQuestions from './components/FrequentlyAskedQuestions';

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <About />
      <VideoTextSection />
      {/* <Roadmap /> */}
      {/* <Roadmap2 /> */}
      {/* <Roadmap3 /> */}
      {/* <Testimonies /> */}
      {/* <ProductGallery /> */}
      {/* <FeaturesSection /> */}
      {/* <FrequentlyAskedQuestions searchTerm={''} /> */}
    </main>
  );
}
