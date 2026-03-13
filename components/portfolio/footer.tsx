"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUp, Twitter, Instagram, BookOpen, Heart } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden">
      {/* Top Accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-12 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-xl text-primary">EV</span>
                </div>
                <span className="font-serif text-2xl tracking-tight">Eleanor Vance</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Writer and essayist exploring memory, identity, and the human condition
                through words that seek to illuminate our shared experience.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: "Twitter", href: "#" },
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: BookOpen, label: "Substack", href: "#" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2">
              <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">
                Navigation
              </p>
              <ul className="space-y-4">
                {["About", "Writing", "Blog", "Publications", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="md:col-span-2">
              <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">
                Resources
              </p>
              <ul className="space-y-4">
                {["Press Kit", "Speaking", "Book Club Guide", "Newsletter"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Book Promo */}
            <div className="md:col-span-3">
              <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">
                Latest Book
              </p>
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="font-serif text-lg mb-2">The Weight of Unsent Letters</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  National Book Award Finalist
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Order Now
                  <ArrowUp className="w-3 h-3 rotate-45" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Eleanor Vance. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> in Brooklyn
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
