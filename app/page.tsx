"use client"

import { Navigation } from "@/components/portfolio/navigation"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { FeaturedWritings } from "@/components/portfolio/featured-writings"
import { Awards } from "@/components/portfolio/awards"
import { Gallery } from "@/components/portfolio/gallery"
import { QuoteSection } from "@/components/portfolio/quote-section"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { MusicPlayer } from "@/components/portfolio/music-player"

import { useContent } from "@/components/portfolio/content-context"

export default function Home() {
  const { content } = useContent()
  const { visibility } = content

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {visibility.hero && <Hero />}
      {visibility.about && <About />}
      {visibility.writings && <FeaturedWritings />}
      
      {/* Quote Section rendered anywhere, let's say between writings and awards */}
      {visibility.quote && <QuoteSection />}
      
      {visibility.awards && <Awards />}
      {visibility.gallery && <Gallery />}
      {visibility.contact && <Contact />}
      
      <Footer />
      <MusicPlayer />
    </main>
  )
}
