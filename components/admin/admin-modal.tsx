"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Eye, EyeOff } from "lucide-react"
import { AdminDashboard } from "./admin-dashboard"

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminModal({ open, onOpenChange }: AdminModalProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || data.error || "Incorrect password. Please try again.")
        return
      }

      localStorage.setItem("admin-token", data.token)
      setIsAuthenticated(true)
      setError("")
    } catch {
      setError("Login failed. Please try again.")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setPassword("")
    setError("")
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    setIsAuthenticated(false)
    setPassword("")
    setError("")
  }

  if (!open) return null

  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <AdminDashboard onClose={handleClose} onLogout={handleLogout} />
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">Welcome Tanvi</h2>
                  <p className="text-sm text-muted-foreground">Admin Access</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-muted-foreground">Enter your password to manage website content</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
