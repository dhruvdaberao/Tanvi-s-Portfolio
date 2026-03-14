"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/portfolio/navigation"
import { useContent } from "@/components/portfolio/content-context"

const PAGE_SIZE = 20

export default function PublicationsPage() {
  const { content } = useContent()
  const items = content.publications || []
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pagedItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background px-6 pb-16 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-serif text-5xl">Publications</h1>
          <Link href="/" className="text-sm text-primary">← Back home</Link>
        </div>

        {pagedItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No publications yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pagedItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
                {item.image ? (
                  <div className="mb-5 aspect-[3/2] w-full rounded-lg overflow-hidden relative">
                    <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                  </div>
                ) : null}
                <h2 className="font-serif text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-4">{item.description}</p>
                <a href={item.link || "#"} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-primary">Read publication →</a>
              </article>
            ))}
          </div>
        )}

        {items.length > PAGE_SIZE ? (
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
