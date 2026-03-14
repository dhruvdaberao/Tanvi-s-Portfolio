"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Award as AwardIcon } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Awards() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const awards = content.awards?.list || []

  return (
    <section id="awards" className="py-32 px-6 bg-secondary/30 relative overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : {}}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)]"
      />

      <div className="mx-auto max-w-6xl px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">Recognition</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">Awards & Honors</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognized for contributions to contemporary literature and the art of the essay.
          </p>
        </motion.div>

        {awards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
            No content added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="h-full bg-card rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <AwardIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{award.year}</span>
                        <span className="text-xs text-muted-foreground">{award.org}</span>
                      </div>
                      <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">{award.title}</h3>
                      {award.description && <p className="text-sm text-muted-foreground leading-relaxed">{award.description}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
