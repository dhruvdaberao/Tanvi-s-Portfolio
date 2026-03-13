"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Hero() {
  const { content } = useContent()
  
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Animated gradient shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: -100 }}
        animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.2, 1], x: [-50, 0, -50] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 100 }}
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.3, 1], x: [50, 0, 50] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-secondary/30 via-primary/20 to-transparent blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10 w-full mt-24">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-3 text-center lg:text-left order-2 lg:order-1">
            {content.hero.badge && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.1 }} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-xs tracking-[0.2em] uppercase rounded-full border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {content.hero.badge}
                </span>
              </motion.div>
            )}

            {content.hero.subtitle && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
                {content.hero.subtitle}
              </motion.p>
            )}

            {content.hero.quote && (
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight mb-8 text-balance">
                <motion.span className="block italic text-foreground" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
                  {'"'}{content.hero.quote}{'"'}
                </motion.span>
              </motion.h1>
            )}

            {content.hero.name && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground mb-8">
                <motion.span initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 0.6, delay: 1.1 }} className="h-px bg-primary/40" />
                <span className="text-sm tracking-widest font-medium uppercase">{content.hero.name}</span>
                <motion.span initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 0.6, delay: 1.1 }} className="h-px bg-primary/40" />
              </motion.div>
            )}
          </div>

          {/* Profile Image Column */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end order-1 lg:order-2">
            {content.hero.profilePhoto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Decorative rings */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border border-dashed border-primary/20 rounded-full" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -inset-8 border border-dashed border-secondary/20 rounded-full hidden md:block" />
                
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-muted/20">
                  <img src={content.hero.profilePhoto} alt={content.hero.name} className="w-full h-full object-cover" />
                </div>
                
                {content.visibility.awards && content.awards.list.length >= 0 && (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.4 }} className="absolute -bottom-4 -right-4 bg-card px-5 py-2.5 rounded-full border border-border shadow-lg z-20">
                     <span className="text-sm font-medium text-primary tracking-wide">{content.awards.countNumber}+ Awards</span>
                   </motion.div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-1 h-1 rounded-full bg-primary" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
