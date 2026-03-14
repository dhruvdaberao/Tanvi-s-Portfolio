"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog"
import { getExcerptFromHtml } from "@/lib/blog"

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.posts || [])
      })
      .catch(() => undefined)
  }, [])

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
          <Link href="/blog" className="text-sm font-medium text-primary">View all articles</Link>
        </motion.div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground shadow-md">No published articles yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
            {posts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-md transition-shadow duration-200 hover:shadow-lg"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted mb-5">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <h3 className="font-serif text-xl tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{getExcerptFromHtml(post.content)}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">Read more <ArrowUpRight className="w-4 h-4" /></span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="mt-10 text-center">
            <Link href="/blog" className="text-sm font-medium text-primary">
              View All →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
