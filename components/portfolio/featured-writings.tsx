"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useCallback } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import useEmblaCarousel from 'embla-carousel-react'
import { useContent } from "@/components/portfolio/content-context"

export function FeaturedWritings() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!content.writings || content.writings.length === 0) {
    return null; // Won't render if empty per requirement
  }

  return (
    <section id="writings" className="py-32 px-6 bg-secondary/50 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
              Featured Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Selected Writings
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={scrollPrev} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={scrollNext} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4" 
          ref={emblaRef}
        >
          <div className="flex gap-6 pb-8">
            {content.writings.map((writing) => (
              <div 
                key={writing.id} 
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-1.5rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] relative group"
              >
                <div className="h-full bg-background border border-border flex flex-col rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                  <div className="flex items-start gap-3 mb-6 relative z-10">
                    <span className="text-xs tracking-wider uppercase px-2 py-1 bg-primary/10 text-primary rounded">
                      {writing.category || "General"}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl tracking-tight mb-4 group-hover:text-primary transition-colors duration-300 relative z-10">
                    {writing.title}
                  </h3>
                  
                  {writing.image && (
                     <div className="mb-6 rounded-lg overflow-hidden border border-border relative z-10 aspect-video">
                        <img src={writing.image} alt={writing.title} className="w-full h-full object-cover" />
                     </div>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-8 relative z-10">
                    {writing.desc}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-border pt-6 mt-auto relative z-10">
                    <a
                      href={writing.readUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 ml-auto"
                    >
                      <ArrowUpRight className="w-4 h-4 translate-y-[2px] -translate-x-[2px] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
