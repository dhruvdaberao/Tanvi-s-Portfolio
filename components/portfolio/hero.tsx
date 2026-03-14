"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Hero() {
  const { content } = useContent()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-4 py-20 sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(140,120,255,0.35) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(160,140,255,0.28) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 55%)",
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
        <div className="w-full max-w-3xl">
          {content.hero.name && (
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
            >
              {content.hero.name}
            </motion.h1>
          )}

          {content.hero.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-5"
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
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-3 text-lg tracking-wide text-muted-foreground md:text-xl"
            >
              {content.hero.subtitle}
            </motion.p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          {content.hero.profilePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-center shadow-lg sm:-bottom-3 sm:px-5 sm:py-2.5"
                >
                  <span className="whitespace-nowrap text-xs font-medium tracking-wide text-primary sm:text-sm">
                    {content.awards.countNumber}+ Awards
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        <div className="mt-10 w-full max-w-4xl">
          {content.hero.quote && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="break-words font-serif text-2xl leading-[1.25] tracking-tight text-foreground sm:text-3xl md:text-4xl"
            >
              <motion.span
                className="block italic text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
              >
                {'"'}{content.hero.quote}{'"'}
              </motion.span>
            </motion.p>
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
