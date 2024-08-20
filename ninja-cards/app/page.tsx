"use client";

import { HomePage } from './components/Home'
import Features from './components/Features'
import About from './components/About'
import Roadmap from './components/Roadmap'
import Roadmap2 from './components/Roadmap2'
import Roadmap3 from './components/Roadmap3'
import VideoTextSection from './components/VideoTextSection'
import FeaturesSection from './components/FeaturesSection'
import Testimonies from './components/Testimonies'
import { motion } from 'framer-motion';
import ProductGallery from './components/ProductCard';

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <Features />
      {/* <About /> */}
      <VideoTextSection />
      {/* <Roadmap /> */}
      {/* <Roadmap2 /> */}
      <Roadmap3 />
      <Testimonies />
      <ProductGallery />
      <FeaturesSection />
    </main>
  )
}
