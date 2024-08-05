import Image from 'next/image'
import Link from 'next/link'
import { HomePage } from './components/Home'
import Features from './components/Features'
import About from './components/About'

export default function Home() {
  return (
    <main className="">
      <HomePage />
      <Features />
      <About />
    </main>
  )
}
