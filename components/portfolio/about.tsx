"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Quote, Play, User, Video as VideoIcon, AlertTriangle } from "lucide-react"
import { useContent } from "@/components/portfolio/content-context"
import { getVideoType, getEmbedUrl, isValidVideoUrl, getAutoThumbnail, extractYouTubeId, getYouTubeThumbnailCandidates } from "@/utils/video"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videoOpen, setVideoOpen] = useState(false)
  const { content } = useContent()

  const hasVideo = !!content.video.url
  const videoType = getVideoType(content.video.url)
  const embedUrl = getEmbedUrl(content.video.url)
  const isValid = isValidVideoUrl(content.video.url)
  const resolvedThumbnail = getAutoThumbnail(content.video.url, content.video.thumbnail)
  const youtubeId = extractYouTubeId(content.video.url)
  const youtubeCandidates = youtubeId ? getYouTubeThumbnailCandidates(youtubeId) : []
  const [thumbnailSrc, setThumbnailSrc] = useState(resolvedThumbnail || "")

  useEffect(() => {
    setThumbnailSrc(resolvedThumbnail || "")
  }, [resolvedThumbnail])

  return (
    <section id="about" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:py-32" ref={ref}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 translate-x-1/4 hidden lg:block pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          
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
                   className="glass-card absolute -bottom-4 left-4 right-4 z-20 rounded-xl p-4 shadow-2xl sm:-bottom-6 sm:left-auto sm:right-0 sm:max-w-xs sm:p-6 md:-right-12"
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

            {/* Video Inline Player */}
            {hasVideo && isValid && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={isInView ? { opacity: 1, scale: 1 } : {}}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="glass-card mt-10 relative aspect-video w-full overflow-hidden rounded-2xl border-2 shadow-2xl transition-all duration-500 sm:mt-12 sm:rounded-3xl bg-black"
              >
                 {!videoOpen ? (
                    <div 
                      className="absolute inset-0 cursor-pointer group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(109,92,255,0.15)]"
                      onClick={() => setVideoOpen(true)}
                    >
                       {thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            loading="lazy"
                            alt="Video Thumbnail"
                            className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={() => {
                              if (!youtubeCandidates.length) {
                                setThumbnailSrc("")
                                return
                              }
      
                              const currentIndex = youtubeCandidates.indexOf(thumbnailSrc)
                              const nextThumbnail = youtubeCandidates[currentIndex + 1]
                              if (nextThumbnail) {
                                setThumbnailSrc(nextThumbnail)
                                return
                              }
      
                              setThumbnailSrc("")
                            }}
                          />
                       ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/30 to-primary/5 flex flex-col items-center justify-center">
                             <VideoIcon className="w-16 h-16 mb-4 text-muted-foreground/40" />
                             <span className="text-sm font-medium text-muted-foreground/60">Video Preview</span>
                          </div>
                       )}
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center pointer-events-none pb-12 sm:pb-0">
                          {/* Play button shifted slightly up on mobile (pb-12) to avoid overlap with bottom text */}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl backdrop-blur-sm relative pointer-events-auto">
                             <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-primary rounded-full" />
                             <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1 relative z-10" />
                          </motion.div>
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                          <h3 className="text-white font-serif text-lg sm:text-xl lg:text-2xl mb-1 truncate">{content.video.title || "An Introduction"}</h3>
                          <p className="text-white/80 text-[10px] sm:text-xs font-medium uppercase tracking-widest">{content.video.caption || `Meet ${content.hero.name}`}</p>
                       </div>
                    </div>
                 ) : (
                    <div className="absolute inset-0 w-full h-full bg-black">
                       {(videoType === "youtube" || videoType === "vimeo") && embedUrl && (
                         <iframe
                           src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                           title={content.video.title || `${content.hero.name} introduction video`}
                           frameBorder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                           allowFullScreen
                           className="w-full h-full border-none"
                         />
                       )}
                       {videoType === "mp4" && (
                         <video 
                           src={content.video.url}
                           controls 
                           autoPlay
                           playsInline
                           className="w-full h-full object-contain"
                         />
                       )}
                    </div>
                 )}
              </motion.div>
            )}
            {/* Invalid URL Warning */}
            {hasVideo && !isValid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Invalid video link. Please enter a valid YouTube or Vimeo URL.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
