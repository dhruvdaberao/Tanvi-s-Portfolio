"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, User as UserIcon } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { useContent } from "./content-context"

export function Navigation() {
  const { content } = useContent()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [adminModalOpen, setAdminModalOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string>("")

  const navItems = [
    { id: "about", label: content.navbar.about, href: "/#about" },
    { id: "writing", label: content.navbar.writings, href: "/writings" },
    { id: "blog", label: content.navbar.blog, href: "/blog" },
    { id: "publications", label: content.navbar.publications, href: "/publications" },
    { id: "awards", label: content.navbar.awards, href: "/awards" },
    { id: "gallery", label: content.navbar.gallery, href: "/gallery" },
    { id: "contact", label: content.navbar.contact, href: "/#contact" },
  ]

  const visibleNavItems = navItems.filter((item) => {
    if (item.id === "writing" && !content.visibility.writings) return false
    if (item.id !== "writing" && content.visibility[item.id as keyof typeof content.visibility] === false) return false
    return true
  })

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)

      const sections = visibleNavItems.filter((item) => item.href.startsWith("/#")).map((item) => item.href.substring(2))
      let current = ""

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = section
            break
          }
        }
      }

      if (current !== activeSection) {
        setActiveSection(current)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection, visibleNavItems])

  React.useEffect(() => {
    if (!mobileMenuOpen) return
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener("resize", closeOnResize)
    return () => window.removeEventListener("resize", closeOnResize)
  }, [mobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/50"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="group min-w-0 flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div
                className="h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border bg-primary/10 shadow-sm transition-all hover:ring-2 hover:ring-primary/30"
                onDoubleClick={(e) => {
                  e.preventDefault()
                  setAdminModalOpen(true)
                }}
                title="Double click to manage content"
              >
                {content.hero.profilePhoto ? (
                  <img src={content.hero.profilePhoto} alt="Author" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <motion.span
                className="truncate font-serif text-base tracking-tight sm:text-xl"
                whileHover={{ opacity: 0.7 }}
                onDoubleClick={(e) => {
                  e.preventDefault()
                  setAdminModalOpen(true)
                }}
                title="Double click to manage content"
              >
                {content.hero.name}
              </motion.span>
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            {visibleNavItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className="relative block whitespace-nowrap px-3 py-2 text-sm tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground xl:px-4"
                >
                  {item.label}
                  {activeSection === item.href.replace("/#", "") && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary xl:left-4 xl:right-4"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="fixed left-3 right-3 top-20 z-50 rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md sm:left-6 sm:right-6 lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {visibleNavItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        activeSection === item.href.replace("/#", "")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {item.label}
                      {activeSection === item.href.replace("/#", "") && (
                        <span className="absolute bottom-2 left-4 h-0.5 w-10 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-4 border-t border-border pt-4 text-center">
                <p className="text-sm font-medium text-primary">{content.hero.subtitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">{content.contact.location}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AdminModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </>
  )
}
