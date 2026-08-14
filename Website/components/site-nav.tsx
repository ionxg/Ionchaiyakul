"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"
import { ThemeToggle } from "@/components/theme-toggle"

export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
] as const

const SECTION_IDS = SECTIONS.map((section) => section.id)

export function SiteNav() {
  const activeId = useActiveSection(SECTION_IDS as unknown as string[])
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // The bar is transparent over the hero and gains a background once you
  // scroll, so it never sits as a hard band across the top on load.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the mobile menu on Escape, and whenever the viewport grows into the
  // desktop layout where the panel is hidden anyway.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-12 lg:px-8">
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight transition-colors hover:text-primary"
        >
          ion<span className="text-primary">.</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => {
            const isActive = section.id === activeId
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <nav
        id="mobile-nav"
        className={`overflow-hidden border-t border-border bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  section.id === activeId
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
