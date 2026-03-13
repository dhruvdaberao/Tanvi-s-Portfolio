"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight, Calendar, Clock } from "lucide-react"
import Image from "next/image"

const posts = [
  {
    title: "On the Practice of Daily Writing",
    date: "March 8, 2026",
    readTime: "5 min",
    excerpt: "The discipline of showing up to the page, regardless of inspiration, has transformed my relationship with creativity.",
    href: "#",
    image: "/images/blog-1.jpg",
    category: "Craft",
  },
  {
    title: "Notes from a Writing Residency",
    date: "February 22, 2026",
    readTime: "8 min",
    excerpt: "Two weeks in the mountains taught me more about silence than any book ever could.",
    href: "#",
    image: "/images/blog-2.jpg",
    category: "Life",
  },
  {
    title: "Why I Returned to Handwriting",
    date: "February 5, 2026",
    readTime: "4 min",
    excerpt: "In abandoning the keyboard, I rediscovered the physical pleasure of language.",
    href: "#",
    image: "/images/blog-3.jpg",
    category: "Craft",
  },
  {
    title: "The Books That Shaped 2025",
    date: "January 15, 2026",
    readTime: "12 min",
    excerpt: "A reflection on the reading that moved, challenged, and transformed me this past year.",
    href: "#",
    image: "/images/blog-4.jpg",
    category: "Reading",
  },
]

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="blog" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
              Journal
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Recent Thoughts
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm tracking-wide hover:text-primary transition-colors group"
          >
            View all entries
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="group mb-12"
        >
          <a href={posts[0].href} className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src={posts[0].image}
                alt={posts[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-300" />
              <span className="absolute top-4 left-4 text-xs tracking-wider uppercase px-3 py-1.5 bg-background/90 backdrop-blur-sm text-foreground rounded-full">
                {posts[0].category}
              </span>
            </div>
            <div className="py-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {posts[0].date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {posts[0].readTime}
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
                {posts[0].title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {posts[0].excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Read essay
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </div>
          </a>
        </motion.article>

        {/* Other Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <a href={post.href} className="block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted mb-5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-300" />
                  <span className="absolute top-3 left-3 text-xs tracking-wider uppercase px-2.5 py-1 bg-background/90 backdrop-blur-sm text-foreground rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif text-xl tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 p-8 md:p-12 bg-accent/50 rounded-2xl border border-border text-center"
        >
          <h3 className="font-serif text-2xl md:text-3xl mb-4">Subscribe to my newsletter</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Monthly reflections on writing, reading, and the creative life. No spam, unsubscribe anytime.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
