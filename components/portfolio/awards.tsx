"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Trophy, Medal, Star, Award, Crown, Sparkles } from "lucide-react"

const awards = [
  {
    icon: Trophy,
    title: "National Book Award",
    year: "2024",
    category: "Finalist - Nonfiction",
    description: "For 'The Weight of Unsent Letters'",
  },
  {
    icon: Crown,
    title: "Pulitzer Prize",
    year: "2022",
    category: "Finalist - Feature Writing",
    description: "For 'Cartography of Loss'",
  },
  {
    icon: Star,
    title: "PEN/Diamonstein-Spielvogel Award",
    year: "2024",
    category: "Winner",
    description: "For the Art of the Essay",
  },
  {
    icon: Medal,
    title: "Whiting Award",
    year: "2019",
    category: "Winner",
    description: "Emerging Writers",
  },
  {
    icon: Award,
    title: "Pushcart Prize",
    year: "2021",
    category: "Winner",
    description: "Best of Small Presses",
  },
  {
    icon: Sparkles,
    title: "Vogue India Women of the Year",
    year: "2023",
    category: "Literature",
    description: "Breakthrough Voice",
  },
]

export function Awards() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="awards" className="py-32 px-6 bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : {}}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)]"
      />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
            Recognition
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Awards & Honors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognized for contributions to contemporary literature and the art of the essay.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <award.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {award.year}
                      </span>
                      <span className="text-xs text-muted-foreground">{award.category}</span>
                    </div>
                    <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                      {award.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{award.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
