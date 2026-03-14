"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Publications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const publications = content.publications || []

  return (
    <section id="publications" className="py-32 px-6 bg-secondary/50 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">Bibliography</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">Publications</h2>
        </motion.div>

        {publications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">No content added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                {item.image ? <img src={item.image} alt={item.title} className="mb-4 aspect-[4/3] w-full rounded-lg object-cover" /> : null}
                <h3 className="font-serif text-2xl tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <a href={item.link || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Visit <ArrowUpRight className="w-4 h-4" /></a>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
