"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useContent } from "./content-context"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const { content } = useContent()

  React.useEffect(() => {
    setMounted(true)
    const storedPreference = localStorage.getItem("music-preference")
    if (storedPreference === "play") {
      setIsPlaying(true)
    } else {
      setIsPlaying(false) // OFF by default
    }
  }, [])

  React.useEffect(() => {
    if (!audioRef.current || !content.music.enabled) return
    const audio = audioRef.current
    audio.loop = content.music.loop

    if (isPlaying) {
      audio.volume = 0
      audio.play().then(() => {
        let vol = 0
        const targetVol = content.music.volume / 100
        const interval = setInterval(() => {
          if (vol < targetVol) {
            vol = Math.min(vol + 0.05, targetVol)
            audio.volume = vol
          } else {
            clearInterval(interval)
          }
        }, 100)
      }).catch(err => {
        console.log("Audio autoplay prevented", err)
        setIsPlaying(false)
      })
      localStorage.setItem("music-preference", "play")
    } else {
      let vol = audio.volume
      const interval = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05
          audio.volume = vol
        } else {
          audio.pause()
          clearInterval(interval)
        }
      }, 100)
      localStorage.setItem("music-preference", "pause")
    }
  }, [isPlaying, content.music.enabled, content.music.loop, content.music.volume])

  if (!mounted || !content.music.enabled || !content.music.fileUrl) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={`/api/media/audio?url=${encodeURIComponent(content.music.fileUrl)}`} preload="auto" />
      
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`group relative flex items-center justify-center w-12 h-12 bg-background/80 backdrop-blur-md border rounded-full shadow-lg transition-all duration-300 ${isPlaying ? 'border-primary shadow-[0_0_15px_rgba(109,92,255,0.3)]' : 'border-border hover:border-primary/50'}`}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        <div className="flex items-end justify-center gap-[3px] h-4">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className={`w-[3px] rounded-full ${isPlaying ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              animate={{
                height: isPlaying 
                  ? ["4px", "16px", "8px", "14px", "4px"]
                  : "4px"
              }}
              transition={{
                duration: isPlaying ? 0.8 : 0.3,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "mirror",
                delay: bar * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </button>
    </div>
  )
}
