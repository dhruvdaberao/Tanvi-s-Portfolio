"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  const isDarkMode = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 transition-all duration-200 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
