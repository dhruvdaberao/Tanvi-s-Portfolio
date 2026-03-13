"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { Quote, BookOpen, Award, PenTool, Play, X } from "lucide-react"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videoOpen, setVideoOpen] = useState(false)

  const stats = [
    { icon: PenTool, value: "10+", label: "Years Writing" },
    { icon: BookOpen, value: "150+", label: "Published Essays" },
    { icon: Award, value: "12", label: "Literary Awards" },
  ]

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 translate-x-1/4 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border-2 border-primary/20 rounded-2xl" />
              <div className="absolute -inset-8 border border-primary/10 rounded-2xl hidden md:block" />
              
              <div className="relative h-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src="/images/tanvi-portrait.jpg"
                  alt="Tanvi Sirsat - Writer Portrait"
                  fill
                  className="object-cover"
                />
                
                {/* Video Play Button Overlay */}
                <motion.button
                  onClick={() => setVideoOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                  <span className="absolute bottom-8 text-sm font-medium text-white bg-foreground/70 px-4 py-2 rounded-full backdrop-blur-sm">
                    Meet the Author
                  </span>
                </motion.button>
              </div>
              
              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 md:-right-12 bg-card p-6 rounded-xl shadow-xl border border-border max-w-xs"
              >
                <Quote className="w-6 h-6 text-primary mb-3" />
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  {'"'}Writing is the art of discovering what you believe.{'"'}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
              About the Author
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 text-balance">
              Crafting stories that
              <span className="text-primary"> resonate</span>
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                I am <span className="text-foreground font-medium">Tanvi Sirsat</span>, a writer exploring the intersections of memory, identity, and the 
                human condition. My work has appeared in <span className="text-foreground font-medium">The New Yorker</span>, <span className="text-foreground font-medium">The Atlantic</span>, 
                <span className="text-foreground font-medium"> Vogue India</span>, and <span className="text-foreground font-medium">Harper{"'"}s Magazine</span>.
              </p>
              <p>
                With over ten years of experience in literary journalism and creative 
                nonfiction, I{"'"}ve dedicated my craft to uncovering the quiet truths that 
                bind us together. My essays examine the spaces between what we remember 
                and what actually happened.
              </p>
              <p>
                Currently based in Mumbai, I write full-time while conducting workshops 
                and speaking at literary events across India and internationally.
              </p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-3">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="font-serif text-3xl md:text-4xl text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground tracking-wide">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm p-4"
          onClick={() => setVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Placeholder for video - would embed actual video player here */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Play className="w-16 h-16 text-primary mb-4" />
              <p className="text-lg font-medium mb-2">Meet the Author</p>
              <p className="text-sm text-muted-foreground">Video introduction coming soon</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
