"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/portfolio/navigation"
import { useContent } from "@/components/portfolio/content-context"

const PAGE_SIZE = 20

export default function GalleryPage() {
  const { content } = useContent()
  const items = content.gallery || []
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pagedItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background px-6 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-serif text-5xl">Gallery</h1>
          <Link href="/" className="text-sm text-primary">← Back home</Link>
        </div>

        {pagedItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No gallery images yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pagedItems.map((image) => (
              <article key={image.id} className="rounded-xl border border-border bg-card p-3 shadow-md transition-shadow duration-200 hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image src={image.url} alt={image.title || image.caption || "Gallery image"} fill unoptimized className="object-cover" />
                </div>
                <h2 className="mt-3 line-clamp-1 font-medium">{image.title || image.caption}</h2>
                <p className="text-xs text-muted-foreground">{image.year}</p>
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
