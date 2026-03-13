"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Quote } from "lucide-react"
import { useContent } from "./content-context"

export function QuoteSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()

  if (!content.quote.text) return null;

  return (
    <section className="py-32 px-6 bg-primary relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-primary-foreground leading-tight tracking-tight text-balance"
          >
            {'"'}{content.quote.text}{'"'}
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <span className="w-12 h-px bg-primary-foreground/30" />
            <span className="text-primary-foreground/80 text-sm tracking-widest uppercase">
              {content.hero.name}
            </span>
            <span className="w-12 h-px bg-primary-foreground/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
