"use client"

import { motion, useInView, PanInfo } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"

const writings = [
  {
    id: 1,
    title: "The Architecture of Memory",
    description: "How we construct our past to navigate our present—a meditation on the unreliability of memory.",
    image: "/images/writing-1.jpg",
    publication: "The New Yorker",
    year: "2024",
    href: "#",
  },
  {
    id: 2,
    title: "Unwritten Letters",
    description: "An exploration of the words we never send and the weight of things left unsaid.",
    image: "/images/writing-2.jpg",
    publication: "The Atlantic",
    year: "2024",
    href: "#",
  },
  {
    id: 3,
    title: "The Art of Disappearing",
    description: "In an age of constant connection, what does it mean to vanish? A journey through intentional absence.",
    image: "/images/writing-3.jpg",
    publication: "Vogue India",
    year: "2023",
    href: "#",
  },
  {
    id: 4,
    title: "Borrowed Time",
    description: "On the peculiar grief of watching time transform the places we once called home.",
    image: "/images/writing-4.jpg",
    publication: "Harper's Magazine",
    year: "2023",
    href: "#",
  },
]

export function WritingsCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % writings.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + writings.length) % writings.length)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      nextSlide()
    } else if (info.offset.x > threshold) {
      prevSlide()
    }
  }

  return (
    <section id="writing" className="py-32 px-6 bg-secondary/30 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
              Featured Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Selected Writings
            </h2>
          </div>
          
          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
              aria-label="Previous writing"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
              aria-label="Next writing"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div
              animate={{ x: -currentIndex * 100 + "%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {writings.map((writing, index) => (
                <motion.div
                  key={writing.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <a href={writing.href} className="group block">
                    <div className="grid md:grid-cols-2 gap-8 bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-500">
                      {/* Image */}
                      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                        <Image
                          src={writing.image}
                          alt={writing.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs tracking-wider uppercase px-3 py-1 bg-primary/10 text-primary rounded-full">
                            {writing.publication}
                          </span>
                          <span className="text-xs text-muted-foreground">{writing.year}</span>
                        </div>
                        
                        <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
                          {writing.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed mb-8">
                          {writing.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <span>Read Essay</span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {writings.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
