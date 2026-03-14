"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Download, X } from "lucide-react"

const STICKERS = [
  "/stickers/sticker-1.png",
  "/stickers/sticker-2.png",
  "/stickers/sticker-3.png",
  "/stickers/sticker-4.png",
  "/stickers/sticker-5.png",
  "/stickers/sticker-6.png",
  "/stickers/sticker-7.jpg",
  "/stickers/sticker-8.png",
  "/stickers/sticker-9.png",
  "/stickers/sticker-10.png",
  "/stickers/sticker-11.jpg",
]

export function VirtualGift() {
  const [isOpen, setIsOpen] = useState(false)
  const [giftIndex, setGiftIndex] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const openGift = () => {
    const randomIdx = Math.floor(Math.random() * STICKERS.length)
    setGiftIndex(randomIdx)
    setIsOpen(true)
  }

  const closeGift = () => {
    setIsOpen(false)
  }

  const downloadGift = async () => {
    if (giftIndex === null) return
    const url = STICKERS[giftIndex]
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `tanvi-gift-${giftIndex + 1}${url.endsWith('.jpg') ? '.jpg' : '.png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Failed to download image", err)
    }
  }

  if (!isClient) return null

  return (
    <div className="w-full flex justify-center py-10 mb-8 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 bg-primary/5 blur-3xl pointer-events-none" />
      
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-4 text-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">A Token of Appreciation</span>
          <p className="font-serif text-xl italic text-foreground/80">Take a little gift before you leave</p>
          <button 
            onClick={openGift}
            className="group mt-2 px-6 py-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <Gift className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-foreground">Open Gift</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && giftIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto bg-card rounded-2xl border border-border p-6 shadow-2xl shadow-primary/5"
          >
            <button 
              onClick={closeGift} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Close gift pane"
            >
              <X className="w-4 h-4" />
            </button>
            
            <p className="font-serif text-lg text-primary mb-6 mt-2">A tiny piece of inspiration.</p>
            
            <div className="relative w-48 h-48 mb-8 mx-auto rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center p-3 border border-border shadow-inner">
              <motion.img 
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                src={STICKERS[giftIndex]} 
                alt="A virtual gift sticker" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            <button 
              onClick={downloadGift}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              Download Sticker
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
