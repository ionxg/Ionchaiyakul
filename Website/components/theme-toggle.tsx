"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export const THEME_STORAGE_KEY = "ion-theme"

type Theme = "light" | "dark"

/**
 * Light/dark switch. The initial class is set by the blocking script in
 * app/layout.tsx so there is no flash of the wrong theme; this component only
 * reads back what that script decided and toggles from there.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private browsing can block storage; the toggle still works for this visit.
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Until the effect runs we don't know the theme, so the button is inert
      // rather than lying about which icon is correct.
      disabled={theme === null}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  )
}
