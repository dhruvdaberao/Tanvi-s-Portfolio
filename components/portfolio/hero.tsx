"use client"

import { motion } from "framer-motion"
import { ArrowDown, Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Animated gradient background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: -100 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15], 
          scale: [1, 1.2, 1],
          x: [-50, 0, -50]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 100 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1], 
          scale: [1, 1.3, 1],
          x: [50, 0, 50]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-secondary/30 via-primary/20 to-transparent blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-xs tracking-[0.2em] uppercase rounded-full border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Award-Winning Author
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            >
              Writer & Essayist
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight mb-8"
            >
              <motion.span 
                className="block italic text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {'"'}Words have the power
              </motion.span>
              <motion.span 
                className="block italic text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                to change the world.{'"'}
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground mb-8"
            >
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="h-px bg-primary/40" 
              />
              <span className="text-sm tracking-widest font-medium">Tanvi Sirsat</span>
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="h-px bg-primary/40" 
              />
            </motion.div>

            {/* Featured publications badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs tracking-wider text-muted-foreground"
            >
              <span>As featured in</span>
              <span className="font-serif text-sm text-foreground px-3 py-1 bg-card rounded-full border border-border">The New Yorker</span>
              <span className="font-serif text-sm text-foreground px-3 py-1 bg-card rounded-full border border-border">The Atlantic</span>
              <span className="font-serif text-sm text-foreground px-3 py-1 bg-card rounded-full border border-border">Vogue India</span>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-dashed border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-dashed border-secondary/20 rounded-full hidden md:block"
              />
              
              {/* Profile image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                <Image
                  src="/images/tanvi-portrait.jpg"
                  alt="Tanvi Sirsat"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-4 -right-4 bg-card px-4 py-2 rounded-full border border-border shadow-lg"
              >
                <span className="text-xs font-medium text-primary">12+ Awards</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-wider text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
