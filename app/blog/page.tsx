"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/portfolio/navigation"
import type { BlogPost } from "@/lib/blog"
import { getExcerptFromHtml } from "@/lib/blog"

const PAGE_SIZE = 20

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.posts || [])
      })
      .catch(() => undefined)
  }, [])

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const pagedPosts = useMemo(() => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [posts, page])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Tanvi&apos;s Journal</p>
          <h1 className="font-serif text-5xl">Published Articles</h1>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pagedPosts.map((post) => {
              const href = `/blog/${post.slug}`
              const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""

              return (
                <article key={post.id} className="rounded-2xl border border-border bg-card p-5">
                  {post.coverImage ? (
                    <div className="mb-5 aspect-[3/2] w-full rounded-lg overflow-hidden relative">
                      <Image src={post.coverImage} alt={post.title || "Blog cover"} fill unoptimized className="object-cover" />
                    </div>
                  ) : null}
                  <h2 className="font-serif text-2xl">{post.title}</h2>
                  {createdAt ? <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">{createdAt}</p> : null}
                  <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-4">{getExcerptFromHtml(post.content || "")}</p>
                  <Link href={href} className="mt-4 inline-block text-sm font-medium text-primary">Read article →</Link>
                </article>
              )
            })}
            {pagedPosts.length === 0 ? <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No published articles yet.</p> : null}
          </div>

          {posts.length > PAGE_SIZE ? (
            <div className="mt-10 flex items-center justify-center gap-4 text-sm">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button>
              <span className="text-muted-foreground">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
