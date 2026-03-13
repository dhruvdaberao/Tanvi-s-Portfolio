"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "/images/gallery-1.jpg",
    alt: "Speaking at Literary Festival",
    category: "Events",
  },
  {
    id: 2,
    src: "/images/gallery-2.jpg",
    alt: "Book Signing Event",
    category: "Book Launch",
  },
  {
    id: 3,
    src: "/images/gallery-3.jpg",
    alt: "Writing at Home",
    category: "Behind the Scenes",
  },
  {
    id: 4,
    src: "/images/gallery-4.jpg",
    alt: "Panel Discussion",
    category: "Events",
  },
  {
    id: 5,
    src: "/images/gallery-5.jpg",
    alt: "Award Ceremony",
    category: "Awards",
  },
  {
    id: 6,
    src: "/images/gallery-6.jpg",
    alt: "Writing Workshop",
    category: "Workshops",
  },
]

export function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)
  
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length)
    }
  }
  
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <section id="gallery" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
            Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From book launches to literary festivals, a glimpse into the journey.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(index)}
                className="relative group cursor-pointer overflow-hidden rounded-xl"
              >
                <div className={`relative ${index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs tracking-wider uppercase text-primary-foreground/80 mb-1">
                    {image.category}
                  </span>
                  <span className="text-white font-medium">{image.alt}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-background/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 z-10 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-background/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 z-10 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-background/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-white font-medium">{galleryImages[selectedImage].alt}</p>
                <p className="text-white/60 text-sm">{galleryImages[selectedImage].category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
