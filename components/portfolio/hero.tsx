"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Hero() {
  const { content } = useContent()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:pt-36"
    >
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

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 lg:grid lg:grid-cols-5 lg:items-center lg:gap-14 xl:gap-16">
        <div className="order-2 text-center lg:order-1 lg:col-span-3 lg:text-left">
          {content.hero.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mb-5"
            >
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-primary sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{content.hero.badge}</span>
              </span>
            </motion.div>
          )}

          {content.hero.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 text-xs uppercase tracking-[0.26em] text-muted-foreground sm:mb-4 sm:text-sm"
            >
              {content.hero.subtitle}
            </motion.p>
          )}

          {content.hero.quote && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 break-words font-serif text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              <motion.span
                className="block italic text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {'"'}{content.hero.quote}{'"'}
              </motion.span>
            </motion.h1>
          )}

          {content.hero.name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mb-2 flex flex-wrap items-center justify-center gap-3 text-muted-foreground lg:justify-start"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="h-px bg-primary/40"
              />
              <span className="text-xs font-medium uppercase tracking-[0.25em] sm:text-sm">{content.hero.name}</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="h-px bg-primary/40"
              />
            </motion.div>
          )}
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:col-span-2 lg:justify-end">
          {content.hero.profilePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-center shadow-lg sm:-bottom-3 sm:px-5 sm:py-2.5 lg:-right-4 lg:left-auto lg:translate-x-0"
                >
                  <span className="whitespace-nowrap text-xs font-medium tracking-wide text-primary sm:text-sm">
                    {content.awards.countNumber}+ Awards
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
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
