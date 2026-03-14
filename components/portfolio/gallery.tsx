"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useContent } from "./content-context"

export function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryImages = content.gallery || []
  const previewImages = galleryImages.slice(0, 6)

  return (
    <section id="gallery" className="px-4 py-20 sm:px-6 sm:py-24 lg:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-primary">Moments</p>
          <h2 className="mb-6 font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">Gallery</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            From book launches to literary festivals, a glimpse into the journey.
          </p>
        </motion.div>

        {galleryImages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground shadow-md">
            No content added yet.
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {previewImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImage(index)}
                  className="glass-card group relative mx-auto w-full overflow-hidden rounded-xl text-left"
                >
                  <div className="relative flex aspect-[4/5] items-center justify-center">
                    <Image
                      src={image.url}
                      alt={image.title || image.caption || "Gallery image"}
                      fill
                      unoptimized
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </motion.button>
                <div className="mt-3 text-center">
                  <p className="line-clamp-2 text-sm font-medium sm:text-base">{image.title || image.caption}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">{image.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {galleryImages.length > 0 ? (
          <div className="mt-10 text-center">
            <Link href="/gallery" className="text-sm font-medium text-primary">View All →</Link>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {selectedImage !== null && previewImages[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30 sm:right-6 sm:top-6 sm:h-12 sm:w-12">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedImage !== null) setSelectedImage((selectedImage - 1 + previewImages.length) % previewImages.length)
              }}
              className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30 sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedImage !== null) setSelectedImage((selectedImage + 1) % previewImages.length)
              }}
              className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30 sm:right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <motion.div
              key={selectedImage}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative mx-4 w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={previewImages[selectedImage].url}
                  alt={previewImages[selectedImage].title || previewImages[selectedImage].caption}
                  fill
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-4 space-y-1 text-center">
                <p className="font-medium text-white">{previewImages[selectedImage].title || previewImages[selectedImage].caption}</p>
                <p className="text-sm text-white/60">{previewImages[selectedImage].year}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
