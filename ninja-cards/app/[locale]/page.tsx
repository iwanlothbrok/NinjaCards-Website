'use client';

import About from './components/layout/About';
import Pricing from './components/Pricings';
import { useEffect, useState } from 'react';
import ProductGallery from './components/layout/ProductGallery';
import RealUseCases from './components/layout/RealCases';
import SocialProof from './components/layout/SocialProof';
import CTASection from './components/layout/CTASection';
import FAQSection from './components/layout/FAQSection';
import JoinNowButton from './components/layout/JoinNowButton';
import { motion } from 'framer-motion';
import Hero from './components/layout/Hero';

export default function Home() {
  const [showJoinButton, setShowJoinButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.querySelector('#pricing');
      const ctaSection = document.querySelector('#cta');
      const heroSection = document.querySelector('#hero');
      if (!pricingSection || !ctaSection || !heroSection) return;

      const scrollPosition = window.scrollY + window.innerHeight;
      const windowTop = window.scrollY;

      const pricingTop = pricingSection.getBoundingClientRect().top + window.scrollY;
      const pricingBottom = pricingTop + (pricingSection as HTMLElement).offsetHeight;

      const ctaTop = ctaSection.getBoundingClientRect().top + window.scrollY;
      const ctaBottom = ctaTop + (ctaSection as HTMLElement).offsetHeight;

      const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
      const heroBottom = heroTop + (heroSection as HTMLElement).offsetHeight;

      if (
        (windowTop < pricingBottom && scrollPosition > pricingTop) ||
        (windowTop < heroBottom && scrollPosition > heroTop) ||
        (windowTop < ctaBottom && scrollPosition > ctaTop)
      ) {
        setShowJoinButton(false);
      } else {
        setShowJoinButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div data-section="hero" id="hero">
        <Hero />
      </div>
      <About />
      <ProductGallery />
      <RealUseCases />
      <div data-section="pricing" id="pricing">
        <Pricing />
      </div>
      <SocialProof />
      <div data-section="cta" id="cta">
        <CTASection />
        <FAQSection />
      </div>

      {showJoinButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <JoinNowButton />
        </motion.div>
      )}
    </>
  );
}
