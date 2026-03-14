"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const posts = content.blog || []

  return (
    <section id="blog" className="py-32 px-6 relative" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">Journal</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">Recent Thoughts</h2>
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">No content added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                className="group"
              >
                <a href={post.link || "#"} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted mb-5">
                    {post.image ? <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
                  </div>
                  <h3 className="font-serif text-xl tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{post.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">Read more <ArrowUpRight className="w-4 h-4" /></span>
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
