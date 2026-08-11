"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { PawPrint } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"
import { SECTIONS } from "@/components/site-nav"

const PET_WIDTH = 56
const EDGE_PADDING = 20
const WALK_SPEED = 70 // px per second
const ARRIVE_EPSILON = 3
const DISMISS_KEY = "ion-pet-dismissed"

/** Things the pet says when you poke it, keyed by the section you're reading. */
const SECTION_LINES: Record<string, string[]> = {
  about: ["That's my human up there.", "He types a lot. I supervise.", "Ask him about encrypted ML. Bring snacks."],
  experience: ["He says yes to a lot of committees.", "Treasurer AND president. Wild.", "Third place at a hackathon. I helped."],
  education: ["Two years down, one to go.", "Cryptography homework smells like coffee.", "He revises out loud. I listen."],
  projects: ["There's a lot down here. Scroll on.", "One of these is an app about me, actually.", "Filter the buttons up top — I'll wait."],
  skills: ["I only know 'sit'.", "Kotlin? Never heard of her.", "He forgot to list 'losing to me at chess'."],
}

const IDLE_LINES = ["Hey.", "Boop.", "Nice cursor.", "Still here.", "Try the light switch, top right."]

const HELLO_LINE = "hi — click me 👋"
const WELCOME_BACK_LINE = "you came back for me 🐾"

const randomOf = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const clampX = (x: number) => {
  const max = window.innerWidth - PET_WIDTH - EDGE_PADDING
  return Math.min(Math.max(x, EDGE_PADDING), Math.max(EDGE_PADDING, max))
}

/**
 * A small companion that walks along the bottom of the page. It wanders on its
 * own, follows the cursor when you come down to its level, and says something
 * about whichever section you're reading when you click it.
 *
 * Position is written straight to the DOM node inside the animation frame —
 * putting it in React state would re-render the tree sixty times a second for
 * a decoration.
 */
export function PetCompanion() {
  const petRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const targetRef = useRef(0)
  const lastFrameRef = useRef(0)
  const bubbleTimerRef = useRef<number | undefined>(undefined)
  // What the pet says the next time it appears — a hello on first load, and a
  // warmer line when you've deliberately summoned it back.
  const greetingRef = useRef(HELLO_LINE)

  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Still mode: the pet appears and responds, but never moves on its own.
  const [reducedMotion, setReducedMotion] = useState(false)
  const [walking, setWalking] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [bubble, setBubble] = useState<string | null>(null)

  const activeId = useActiveSection(SECTIONS.map((section) => section.id) as unknown as string[])
  // The animation loop must not restart every time the reader scrolls into a
  // new section, so the loop reads the section from a ref instead.
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId

  const say = useCallback((line: string, duration = 3200) => {
    setBubble(line)
    window.clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = window.setTimeout(() => setBubble(null), duration)
  }, [])

  // Put the pet on stage. Both entry points run this — the first page load and
  // a summon after the reader has sent it away — so there's one definition of
  // where it comes in and how it behaves.
  const start = useCallback(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    xRef.current = clampX(window.innerWidth * 0.18)
    targetRef.current = xRef.current
    setReady(true)
  }, [])

  // A dismissal is the only thing that hides the pet outright. "Reduce motion"
  // asks for no movement, not for the feature to disappear — so in that mode
  // the pet still shows up and still talks, it just stays put.
  useEffect(() => {
    let hidden = false
    try {
      hidden = window.localStorage.getItem(DISMISS_KEY) === "1"
    } catch {
      // Storage unavailable — just show the pet.
    }
    if (hidden) {
      setDismissed(true)
      return
    }
    start()
  }, [start])

  // Place the pet at its starting spot. In still mode this is the only time
  // the transform is written; otherwise the walk loop takes over from here.
  useEffect(() => {
    if (!ready || !petRef.current) return
    petRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`
  }, [ready])

  // Walk loop: ease toward the current target, flip to face the way we move.
  useEffect(() => {
    if (!ready || dismissed || reducedMotion) return
    let frame = 0

    const step = (now: number) => {
      const previous = lastFrameRef.current || now
      // Clamp the delta so returning to a backgrounded tab doesn't teleport it.
      const delta = Math.min((now - previous) / 1000, 0.05)
      lastFrameRef.current = now

      const distance = targetRef.current - xRef.current
      if (Math.abs(distance) > ARRIVE_EPSILON) {
        const direction = Math.sign(distance)
        const travel = Math.min(WALK_SPEED * delta, Math.abs(distance))
        xRef.current += direction * travel
        setWalking(true)
        setFacingLeft(direction < 0)
      } else {
        setWalking(false)
      }

      if (petRef.current) {
        petRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`
      }
      frame = window.requestAnimationFrame(step)
    }

    frame = window.requestAnimationFrame(step)
    return () => {
      lastFrameRef.current = 0
      window.cancelAnimationFrame(frame)
    }
  }, [ready, dismissed, reducedMotion])

  // Wander to a new spot every few seconds when left alone.
  useEffect(() => {
    if (!ready || dismissed || reducedMotion) return
    const wander = window.setInterval(() => {
      if (document.hidden) return
      targetRef.current = clampX(Math.random() * window.innerWidth)
    }, 5000)
    return () => window.clearInterval(wander)
  }, [ready, dismissed, reducedMotion])

  // Come when called: the pet only notices the cursor near the bottom strip,
  // so it doesn't chase the reader around the whole page. Chasing is movement,
  // so it's off in still mode — but the pet must still be kept on screen when
  // the window is resized.
  useEffect(() => {
    if (!ready || dismissed) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY > window.innerHeight - 180) {
        targetRef.current = clampX(event.clientX - PET_WIDTH / 2)
      }
    }
    const onResize = () => {
      xRef.current = clampX(xRef.current)
      targetRef.current = clampX(targetRef.current)
      // Nothing else writes the transform in still mode, so do it here.
      if (reducedMotion && petRef.current) {
        petRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`
      }
    }
    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("resize", onResize)
    }
  }, [ready, dismissed, reducedMotion])

  // A greeting on arrival, so people know it's clickable. The line lives in a
  // ref so each way of arriving gets its own — a hello on first load, a warmer
  // one when the reader has gone out of their way to summon it back.
  useEffect(() => {
    if (!ready || dismissed) return
    const line = greetingRef.current
    const hello = window.setTimeout(() => say(line, 4200), 1800)
    return () => window.clearTimeout(hello)
  }, [ready, dismissed, say])

  useEffect(() => () => window.clearTimeout(bubbleTimerRef.current), [])

  const onPet = () => {
    const lines = SECTION_LINES[activeIdRef.current] ?? IDLE_LINES
    say(randomOf(lines))
  }

  const onDismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // Nothing to persist to; it'll be back next visit.
    }
  }

  const onSummon = () => {
    greetingRef.current = WELCOME_BACK_LINE
    try {
      window.localStorage.removeItem(DISMISS_KEY)
    } catch {
      // Nothing to clear; the pet is back for this visit either way.
    }
    start()
    setDismissed(false)
  }

  // Sent away, but never for good — the hide control is small and sits right on
  // the critter, so it's easy to hit by accident. Leave a way back.
  if (dismissed) {
    return (
      <button
        type="button"
        onClick={onSummon}
        aria-label="Bring back the companion"
        title="Bring back the companion"
        className="fixed bottom-6 right-6 z-30 hidden h-9 w-9 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground sm:grid"
      >
        <PawPrint className="h-4 w-4" />
      </button>
    )
  }

  if (!ready) return null

  // Deliberately not aria-hidden: it holds real buttons, and a screen-reader
  // user needs the option to dismiss it.
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden h-0 sm:block">
      <div ref={petRef} className="absolute bottom-6 left-0 will-change-transform">
        {/* Speech bubble */}
        {bubble && (
          <div
            className="absolute bottom-full left-1/2 mb-3 w-max max-w-[16rem] -translate-x-1/2 rounded-xl border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
            style={{ animation: "bubble-in 220ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {bubble}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-border bg-popover" />
          </div>
        )}

        <div className="group relative">
          <button
            type="button"
            onClick={onPet}
            aria-label="Pet the companion"
            className="pointer-events-auto block cursor-pointer border-0 bg-transparent p-0"
            style={{ animation: walking ? "pet-bob 380ms ease-in-out infinite" : undefined }}
          >
            <Critter walking={walking} facingLeft={facingLeft} />
          </button>

          {/* Send-away control, revealed on hover. */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Hide the companion"
            title="Hide the companion"
            className="pointer-events-auto absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border border-border bg-background text-[9px] leading-none text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

/** The character itself. Colours come from the theme, so it flips with the page. */
function Critter({ walking, facingLeft }: { walking: boolean; facingLeft: boolean }) {
  const legStyle = walking
    ? { animation: "pet-step 380ms ease-in-out infinite", transformOrigin: "top center" }
    : undefined
  const legStyleOffset = walking
    ? {
        animation: "pet-step 380ms ease-in-out infinite",
        animationDelay: "-190ms",
        transformOrigin: "top center",
      }
    : undefined

  return (
    <svg
      aria-hidden="true"
      width={PET_WIDTH}
      height={PET_WIDTH}
      viewBox="0 0 56 56"
      fill="none"
      className="drop-shadow-sm transition-transform"
      style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}
    >
      {/* Soft shadow on the ground */}
      <ellipse cx="28" cy="50" rx="14" ry="3" className="fill-foreground/10" />

      {/* Tail */}
      <path
        d="M13 36 C4 34, 4 24, 11 22"
        className="stroke-primary"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Legs */}
      <g className="stroke-primary" strokeWidth="3.5" strokeLinecap="round">
        <line x1="21" y1="40" x2="21" y2="48" style={legStyle} />
        <line x1="34" y1="40" x2="34" y2="48" style={legStyleOffset} />
      </g>

      {/* Ears */}
      <path d="M17 16 L15 7 L24 12 Z" className="fill-primary" />
      <path d="M39 16 L41 7 L32 12 Z" className="fill-primary" />

      {/* Body */}
      <rect x="13" y="12" width="30" height="30" rx="13" className="fill-primary" />

      {/* Face plate */}
      <rect x="18" y="19" width="20" height="15" rx="7" className="fill-background/85" />

      {/* Eyes — blink on a slow loop */}
      <g
        className="fill-foreground"
        style={{ animation: "pet-blink 5.5s ease-in-out infinite", transformOrigin: "center" }}
      >
        <circle cx="24" cy="26" r="2.2" />
        <circle cx="33" cy="26" r="2.2" />
      </g>

      {/* Smile */}
      <path
        d="M26 30 Q28.5 32.5, 31 30"
        className="stroke-foreground"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
