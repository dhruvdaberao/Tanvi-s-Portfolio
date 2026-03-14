"use client"

import { motion } from "framer-motion"
import { useContent } from "@/components/portfolio/content-context"

export function Hero() {
  const { content } = useContent()

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-4 pt-10 pb-20 sm:px-6 md:pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[58%] opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(147, 51, 234, 0.8) 25%, transparent 25%), linear-gradient(-45deg, rgba(147, 51, 234, 0.8) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(147, 51, 234, 0.8) 75%), linear-gradient(-45deg, transparent 75%, rgba(147, 51, 234, 0.8) 75%)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: -100 }}
        animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.2, 1], x: [-50, 0, -50] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent blur-3xl sm:h-[28rem] sm:w-[28rem]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 100 }}
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.3, 1], x: [50, 0, 50] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-gradient-to-tl from-secondary/30 via-primary/20 to-transparent blur-3xl sm:h-[34rem] sm:w-[34rem]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {content.hero.profilePhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-5 rounded-full bg-purple-400/20 blur-3xl sm:inset-8" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-full border border-dashed border-primary/20 sm:-inset-4"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 hidden rounded-full border border-dashed border-secondary/20 sm:block md:-inset-8"
            />

            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-background bg-muted/20 shadow-2xl sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
              <img src={content.hero.profilePhoto} alt={content.hero.name} className="h-full w-full object-cover" />
            </div>

            {content.visibility.awards && content.awards.list.length >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-center shadow-lg sm:-bottom-3 sm:px-5 sm:py-2.5"
              >
                <span className="whitespace-nowrap text-xs font-medium tracking-wide text-primary sm:text-sm">
                  {content.awards.countNumber}+ Awards
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="mt-10 flex w-full max-w-3xl flex-col items-center gap-3 sm:mt-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-xs uppercase tracking-[0.22em] text-primary"
          >
            {content.hero.badge || "Award-Winning Author"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-lg tracking-wide text-muted-foreground"
          >
            {content.hero.subtitle || "Writer & Essayist"}
          </motion.p>

          {content.hero.quote && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="break-words font-playfair text-2xl italic leading-[1.25] tracking-tight text-foreground md:text-4xl"
            >
              {'"'}{content.hero.quote}{'"'}
            </motion.p>
          )}

          {content.hero.name && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="pt-2 text-sm uppercase tracking-[0.3em] text-foreground/80"
            >
              {content.hero.name}
            </motion.h1>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block lg:bottom-6"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-primary/30 p-1">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="h-1 w-1 rounded-full bg-primary" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
