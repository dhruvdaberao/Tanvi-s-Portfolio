"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useContent } from "./content-context"

export function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryImages = content.gallery || []

  return (
    <section id="gallery" className="px-4 py-20 sm:px-6 sm:py-24 lg:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl">
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
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
            No content added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {galleryImages.map((image, index) => (
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
                  className="glass-card group relative w-full overflow-hidden rounded-xl text-left"
                >
                  <div className="relative aspect-[4/5]">
                    <img
                      src={image.url}
                      alt={image.title || image.caption || "Gallery image"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-1 text-xs uppercase tracking-wider text-primary-foreground/80">{image.year}</span>
                    <span className="line-clamp-2 text-sm font-medium text-white sm:text-base">{image.title || image.caption}</span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage !== null && galleryImages[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedImage !== null) setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
              }}
              className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30 sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (selectedImage !== null) setSelectedImage((selectedImage + 1) % galleryImages.length)
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
                <img
                  src={galleryImages[selectedImage].url}
                  alt={galleryImages[selectedImage].title || galleryImages[selectedImage].caption}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-4 space-y-1 text-center">
                <p className="font-medium text-white">{galleryImages[selectedImage].title || galleryImages[selectedImage].caption}</p>
                <p className="text-sm text-white/60">{galleryImages[selectedImage].year}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
