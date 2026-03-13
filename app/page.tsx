"use client"

import { Navigation } from "@/components/portfolio/navigation"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { FeaturedWritings } from "@/components/portfolio/featured-writings"
import { Blog } from "@/components/portfolio/blog"
import { Publications } from "@/components/portfolio/publications"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <FeaturedWritings />
      <Blog />
      <Publications />
      <Contact />
      <Footer />
    </main>
  )
}
