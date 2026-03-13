"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { ArrowUp, Twitter, Instagram, BookOpen, Heart, Send, Linkedin } from "lucide-react"
import { useContent } from "./content-context"

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setStatus("success")
      setMessage(data.message || "Thanks for subscribing!")
      setEmail("")
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          placeholder="your@email.com"
          className="w-full bg-background border border-border rounded-full py-3 px-5 pr-14 text-sm focus:outline-none focus:border-primary disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success" || !email}
          className="absolute right-1 top-1 bottom-1 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? (
             <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
             <Send className="w-4 h-4 -ml-0.5" />
          )}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm font-medium ${status === "success" ? "text-primary" : "text-destructive"}`}>
          {message}
        </p>
      )}
    </form>
  )
}

export function Footer() {
  const { content } = useContent()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socials = [
    { icon: Twitter, label: "Twitter", href: content.social.twitter },
    { icon: Instagram, label: "Instagram", href: content.social.instagram },
    { icon: Linkedin, label: "LinkedIn", href: content.social.linkedin },
    { icon: BookOpen, label: "Medium", href: content.social.medium },
  ].filter((social) => Boolean(social.href))

  const navItems = [
    { label: content.navbar.about, href: "#about", visible: content.visibility.about },
    { label: content.navbar.writings, href: "#writings", visible: content.visibility.writings },
    { label: content.navbar.blog, href: "#blog", visible: content.visibility.blog },
    { label: content.navbar.publications, href: "#publications", visible: content.visibility.publications },
    { label: content.navbar.contact, href: "#contact", visible: content.visibility.contact },
  ].filter((item) => item.visible && item.label)

  const featuredWriting = content.writings[0]

  return (
    <footer className="relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {content.hero.profilePhoto ? (
                    <img src={content.hero.profilePhoto} alt={content.hero.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif text-xl text-primary">{content.hero.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="font-serif text-2xl tracking-tight">{content.hero.name}</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">{content.about.bio}</p>

              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">Navigation</p>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4 lg:col-span-4">
              <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">Newsletter</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Subscribe to receive updates on new writings and upcoming events.
              </p>
              <NewsletterForm />
            </div>

            {featuredWriting && (
              <div className="md:col-span-3">
                <p className="text-sm tracking-[0.2em] uppercase text-primary mb-6 font-medium">Featured Writing</p>
                <div className="bg-card rounded-xl border border-border p-5">
                  <h4 className="font-serif text-lg mb-2">{featuredWriting.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{featuredWriting.category}</p>
                  <a href={featuredWriting.readUrl || "#"} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    Read Now
                    <ArrowUp className="w-3 h-3 rotate-45" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {content.hero.name}. All rights reserved.</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for readers everywhere
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
