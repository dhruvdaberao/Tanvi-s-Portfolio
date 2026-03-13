"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowUpRight, Bookmark, Clock } from "lucide-react"

const writings = [
  {
    title: "The Architecture of Memory",
    publication: "The New Yorker",
    year: "2024",
    readTime: "18 min",
    category: "Essay",
    excerpt: "How we construct our past to navigate our present—a meditation on the unreliability of memory and the stories we tell ourselves to survive.",
    href: "#",
    featured: true,
  },
  {
    title: "Unwritten Letters",
    publication: "The Atlantic",
    year: "2024",
    readTime: "12 min",
    category: "Personal Essay",
    excerpt: "An exploration of the words we never send, the conversations we rehearse in silence, and the weight of things left unsaid.",
    href: "#",
    featured: false,
  },
  {
    title: "The Art of Disappearing",
    publication: "Harper's Magazine",
    year: "2023",
    readTime: "22 min",
    category: "Long Form",
    excerpt: "In an age of constant connection, what does it mean to vanish? A journey through the philosophy and practice of intentional absence.",
    href: "#",
    featured: false,
  },
  {
    title: "Borrowed Time",
    publication: "The Paris Review",
    year: "2023",
    readTime: "15 min",
    category: "Memoir",
    excerpt: "On the peculiar grief of watching time transform the places we once called home, and the people who inhabited them.",
    href: "#",
    featured: false,
  },
]

export function FeaturedWritings() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="writing" className="py-32 px-6 bg-secondary/50 relative overflow-hidden" ref={ref}>
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
              Featured Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Selected Writings
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Essays exploring memory, identity, and the stories we construct to make sense of our lives.
          </p>
        </motion.div>

        <div className="space-y-0">
          {writings.map((writing, index) => (
            <motion.article
              key={writing.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group border-t border-border relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover background */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 0.98
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-accent/50 -mx-6 px-6"
              />
              
              <a href={writing.href} className="block py-10 md:py-12 relative">
                <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                  {/* Number & Category */}
                  <div className="md:col-span-1 flex md:flex-col items-center md:items-start gap-3">
                    <span className="font-serif text-2xl text-primary/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  {/* Title & Publication */}
                  <div className="md:col-span-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xs tracking-wider uppercase px-2 py-1 bg-primary/10 text-primary rounded">
                        {writing.category}
                      </span>
                      {writing.featured && (
                        <span className="text-xs tracking-wider uppercase px-2 py-1 bg-card text-muted-foreground rounded border border-border">
                          Editor{"'"}s Pick
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-3 group-hover:text-primary transition-colors duration-300">
                      {writing.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{writing.publication}</span>
                      <span>·</span>
                      <span>{writing.year}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {writing.readTime}
                      </span>
                    </div>
                  </div>
                  
                  {/* Excerpt */}
                  <div className="md:col-span-5">
                    <p className="text-muted-foreground leading-relaxed">
                      {writing.excerpt}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="md:col-span-1 flex justify-end">
                    <motion.div
                      initial={false}
                      animate={{ 
                        x: hoveredIndex === index ? 4 : 0,
                        y: hoveredIndex === index ? -4 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full text-sm tracking-wide font-medium hover:bg-primary transition-colors duration-300 group"
          >
            <Bookmark className="w-4 h-4" />
            View Complete Archive
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
