"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  /** Stagger sibling reveals by passing increasing delays, in ms. */
  delay?: number
  className?: string
  as?: ElementType
  /** Set when the wrapper doubles as a scroll-spy anchor. */
  id?: string
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. The animation itself lives in the `.reveal` utility in globals.css, so
 * a reduced-motion visitor gets the content with no movement at all.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer support (or a very old browser): show the content rather
    // than leaving the page blank.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      data-visible={visible}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  )
}
