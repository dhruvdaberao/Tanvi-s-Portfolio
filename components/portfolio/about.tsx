"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Quote, Play, X, User, Video } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videoOpen, setVideoOpen] = useState(false)
  const { content } = useContent()

  const hasVideo = !!content.video.url;

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 translate-x-1/4 hidden lg:block pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-4 border-2 border-primary/20 rounded-2xl pointer-events-none" />
              <div className="absolute -inset-8 border border-primary/10 rounded-2xl hidden md:block pointer-events-none" />
              
              <div className="relative h-full overflow-hidden rounded-2xl bg-muted/30 border border-border flex items-center justify-center">
                {content.hero.profilePhoto ? (
                  <img src={content.hero.profilePhoto} alt={content.hero.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-24 h-24 text-muted-foreground opacity-20" />
                )}
              </div>
              
              {content.quote.text && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={isInView ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.8, delay: 0.5 }}
                   className="absolute -bottom-6 -right-6 md:-right-12 bg-card p-6 rounded-xl shadow-2xl border border-border max-w-xs z-20"
                 >
                   <Quote className="w-6 h-6 text-primary mb-3" />
                   <p className="text-sm italic text-foreground leading-relaxed font-serif">
                     {'"'}{content.quote.text}{'"'}
                   </p>
                 </motion.div>
              )}
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight mb-8 text-balance text-primary">
              {content.about.title}
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {content.about.bio}
            </div>

            {hasVideo && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={isInView ? { opacity: 1, scale: 1 } : {}}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="mt-12 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-border bg-muted/20 flex items-center justify-center"
                 onClick={() => setVideoOpen(true)}
              >
                 {content.video.thumbnail ? (
                    <img src={content.video.thumbnail} loading="lazy" alt="Video Thumbnail" className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                       <Video className="w-16 h-16 mb-4" />
                       <span className="text-sm font-medium">No Thumbnail Provided</span>
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl backdrop-blur-sm relative">
                       <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-primary rounded-full" />
                       <Play className="w-8 h-8 text-white ml-1 relative z-10" />
                    </motion.div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-white font-serif text-2xl mb-2">{content.video.title || "An Introduction"}</h3>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-widest">{content.video.caption || "Meet Tanvi"}</p>
                 </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {videoOpen && hasVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-md p-4"
          onClick={() => setVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            {content.video.url.includes("youtube.com") || content.video.url.includes("vimeo.com") ? (
               <iframe
                 src={content.video.url}
                 title="Author Video"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 allowFullScreen
                 className="absolute inset-0 w-full h-full bg-black border-none"
               />
            ) : (
               <video 
                  src={content.video.url}
                  controls 
                  autoPlay 
                  className="absolute inset-0 w-full h-full object-contain"
               />
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
