"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Award, ExternalLink, Star, ShoppingBag } from "lucide-react"

const books = [
  {
    title: "The Weight of Unsent Letters",
    year: "2024",
    publisher: "Knopf",
    description: "A collection of essays exploring the words we leave unspoken and the relationships shaped by silence.",
    awards: ["National Book Award Finalist", "PEN/Diamonstein-Spielvogel Award"],
    image: "/images/book-1.jpg",
    buyLink: "#",
  },
  {
    title: "Cartography of Loss",
    year: "2021",
    publisher: "Farrar, Straus and Giroux",
    description: "A memoir mapping the landscape of grief through personal narrative and historical reflection.",
    awards: ["Pulitzer Prize Finalist"],
    image: "/images/book-2.jpg",
    buyLink: "#",
  },
]

const moreBooks = [
  {
    title: "The Disappearing Hour",
    year: "2018",
    publisher: "Vintage",
  },
  {
    title: "First Light",
    year: "2015",
    publisher: "Graywolf Press",
  },
]

const publications = [
  { name: "The New Yorker", logo: "TNY" },
  { name: "The Atlantic", logo: "TA" },
  { name: "Harper's Magazine", logo: "HM" },
  { name: "The Paris Review", logo: "TPR" },
  { name: "The New York Times", logo: "NYT" },
  { name: "Granta", logo: "GR" },
]

const awards = [
  { name: "Pulitzer Prize Finalist", year: "2022" },
  { name: "National Book Award Finalist", year: "2024" },
  { name: "PEN/Diamonstein-Spielvogel Award", year: "2024" },
  { name: "Whiting Award", year: "2016" },
]

export function Publications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="publications" className="py-32 px-6 bg-secondary/50 relative overflow-hidden" ref={ref}>
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-accent/30 rounded-tr-[200px] -translate-x-1/4 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
            Bibliography
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Publications & Awards
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four books published, with essays appearing in leading literary magazines worldwide.
          </p>
        </motion.div>

        {/* Featured Books */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {books.map((book, index) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-500"
            >
              <div className="grid md:grid-cols-5 h-full">
                <div className="md:col-span-2 relative aspect-[3/4] md:aspect-auto bg-muted">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs tracking-wider uppercase px-2 py-1 bg-primary/10 text-primary rounded">
                      {book.year}
                    </span>
                    <span className="text-xs text-muted-foreground">{book.publisher}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-3">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {book.description}
                  </p>
                  
                  {book.awards.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {book.awards.map((award) => (
                          <span
                            key={award}
                            className="inline-flex items-center gap-1.5 text-xs tracking-wide px-3 py-1.5 bg-accent text-accent-foreground rounded-full"
                          >
                            <Star className="w-3 h-3 text-primary" />
                            {award}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <a 
                    href={book.buyLink}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Purchase Book
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Books */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6 text-center">
            Earlier Works
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {moreBooks.map((book) => (
              <div
                key={book.title}
                className="px-6 py-4 bg-card rounded-lg border border-border"
              >
                <span className="font-serif text-lg">{book.title}</span>
                <span className="text-sm text-muted-foreground ml-2">({book.year})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Publications Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-8 text-center">
            Featured In
          </h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                className="group flex items-center gap-3 px-6 py-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {pub.logo}
                </span>
                <span className="font-serif text-lg">{pub.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-8 md:p-12"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
              Awards & Recognition
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center p-4"
              >
                <span className="block font-serif text-3xl text-primary mb-2">{award.year}</span>
                <span className="text-sm text-muted-foreground leading-tight">{award.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
