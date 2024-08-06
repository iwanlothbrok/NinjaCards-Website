import Image from 'next/image'
import Link from 'next/link'
import { HomePage } from './components/Home'
import Features from './components/Features'
import About from './components/About'
import Roadmap from './components/Roadmap'
import VideoTextSection from './components/VideoTextSection'
import FeaturesSection from './components/FeaturesSection'

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <Features />
      <About />
      <VideoTextSection />
      <Roadmap />
      <FeaturesSection />
    </main>
  )
}
