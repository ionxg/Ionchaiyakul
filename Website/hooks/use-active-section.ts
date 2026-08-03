"use client"

import { useEffect, useState } from "react"

/**
 * Scroll-spy: returns the id of the section currently under the header.
 *
 * Uses scroll position rather than IntersectionObserver because sections here
 * vary wildly in height — with an observer, a tall section sandwiched between
 * short ones wins the "most visible" contest even after you've scrolled past
 * its heading. Comparing each section's top against a fixed probe line matches
 * what the reader actually sees at the top of the viewport.
 */
export function useActiveSection(sectionIds: string[], offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "")

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const probe = window.scrollY + offset

      // Bottom of the page: the last section can be too short to ever reach
      // the probe line, so award it explicitly.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2

      if (atBottom) {
        setActiveId(sectionIds[sectionIds.length - 1] ?? "")
        return
      }

      let current = sectionIds[0] ?? ""
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top + window.scrollY <= probe) {
          current = id
        }
      }
      setActiveId(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [sectionIds, offset])

  return activeId
}
