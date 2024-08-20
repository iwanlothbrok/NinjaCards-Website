"use client";

import { HomePage } from './components/Home'
import Features from './components/Features'
import About from './components/About'
import Roadmap from './components/Roadmap'
import VideoTextSection from './components/VideoTextSection'
import FeaturesSection from './components/FeaturesSection'
import Testimonies from './components/Testimonies'
import { motion } from 'framer-motion';
import ProductGallery from './components/ProductCard';
import Product from './components/Product';

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <Features />
      <About />
      <VideoTextSection />
      <Roadmap />
      <Testimonies />
      <ProductGallery />
      <FeaturesSection />
    </main>
  )
}
