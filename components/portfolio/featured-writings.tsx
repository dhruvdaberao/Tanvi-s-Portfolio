"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useContent } from "@/components/portfolio/content-context"

export function FeaturedWritings() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()

  const writings = content.writings || []
  const previewWritings = writings.slice(0, 3)

  return (
    <section id="writings" className="relative overflow-hidden bg-secondary/50 px-4 py-20 sm:px-6 sm:py-24 lg:py-32" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">Featured Work</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">Selected Writings</h2>
        </motion.div>

        {previewWritings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
            No content added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {previewWritings.map((writing, index) => (
              <motion.article
                key={writing.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass-card h-full rounded-2xl border p-6"
              >
                <span className="text-xs tracking-wider uppercase px-2 py-1 bg-primary/10 text-primary rounded">
                  {writing.category || "General"}
                </span>
                <h3 className="font-serif text-2xl tracking-tight mt-4 mb-4">{writing.title}</h3>

                {writing.image ? (
                  <div className="mb-5 rounded-lg overflow-hidden border border-border relative aspect-video">
                    <Image src={writing.image} alt={writing.title} fill unoptimized className="w-full h-full object-cover" />
                  </div>
                ) : null}

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-4">{writing.desc}</p>

                <a
                  href={writing.readUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  Read more <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.article>
            ))}
          </div>
        )}

        {writings.length > 0 ? (
          <div className="mt-10 text-center">
            <Link href="/writings" className="text-sm font-medium text-primary">View All →</Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
