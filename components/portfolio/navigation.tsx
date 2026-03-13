"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Writing", href: "#writing" },
  { label: "Blog", href: "#blog" },
  { label: "Publications", href: "#publications" },
  { label: "Awards", href: "#awards" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [adminModalOpen, setAdminModalOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
              onDoubleClick={handleProfileDoubleClick}
            >
              <Image
                src="/images/tanvi-portrait.jpg"
                alt="Tanvi Sirsat"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <motion.span
              className="font-serif text-xl tracking-tight hidden sm:block"
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              Tanvi Sirsat
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
                >
                  {item.label}
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
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-4 font-serif text-2xl border-b border-border hover:text-primary transition-colors"
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
              <p className="text-sm text-muted-foreground">Writer & Essayist</p>
              <p className="text-sm text-muted-foreground mt-1">Mumbai, India</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Modal */}
      <AdminModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </>
  )
}
