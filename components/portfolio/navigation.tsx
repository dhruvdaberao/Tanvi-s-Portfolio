"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
    { id: "about", label: content.navbar.about, href: "#about" },
    { id: "writing", label: content.navbar.writings, href: "#writings" },
    { id: "blog", label: content.navbar.blog, href: "#blog" },
    { id: "publications", label: content.navbar.publications, href: "#publications" },
    { id: "awards", label: content.navbar.awards, href: "#awards" },
    { id: "gallery", label: content.navbar.gallery, href: "#gallery" },
    { id: "contact", label: content.navbar.contact, href: "#contact" },
  ]

  // Filter out sections that are not visible in settings
  const visibleNavItems = navItems.filter(item => {
     if (item.id === "writing" && !content.visibility.writings) return false
     if (item.id !== "writing" && content.visibility[item.id as keyof typeof content.visibility] === false) return false
     return true
  })

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Determine active section for highlight
      const sections = visibleNavItems.map(item => item.href.substring(1))
      let current = ""
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
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
    return () => window.removeEventListener("scroll", handleScroll)
  }, [visibleNavItems, activeSection])

  const handleProfileDoubleClick = () => {
    setAdminModalOpen(true)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            {/* Profile Icon - Double click for admin access */}
            <div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all shadow-sm border border-border"
              onDoubleClick={handleProfileDoubleClick}
              title="Double click to manage content"
            >
              {content.hero.profilePhoto ? (
                 <img
                    src={content.hero.profilePhoto}
                    alt="Author"
                    className="w-full h-full object-cover"
                 />
              ) : (
                 <UserIcon className="w-5 h-5 text-primary" />
              )}
            </div>
            <motion.span
              className="font-serif text-xl tracking-tight hidden sm:block"
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {content.hero.name}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleNavItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-all duration-200 block"
                >
                  {item.label}
                  {activeSection === item.href.substring(1) && (
                     <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {visibleNavItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-4 font-serif text-2xl border-b border-border transition-colors ${
                       activeSection === item.href.substring(1) ? "text-primary" : "hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-primary font-medium">{content.hero.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-1">{content.contact.location}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </>
  )
}
