"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { PawPrint } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"
import { SECTIONS } from "@/components/site-nav"

// Imported rather than referenced by path: the site is served from a basePath
// on GitHub Pages, and next/image does not prepend it to a plain src string.
// Static imports resolve through the bundler, so they carry the prefix.
import catJump from "@/assets/pets/cat/cat_jump.gif"
import catPlaying from "@/assets/pets/cat/cat_playing.gif"
import catRun from "@/assets/pets/cat/cat_run.gif"
import catSit from "@/assets/pets/cat/cat_sit.gif"
import catSleep from "@/assets/pets/cat/cat_sleep.gif"

const CAT_SPRITES = {
  jump: catJump,
  playing: catPlaying,
  run: catRun,
  sit: catSit,
  sleep: catSleep,
}

const EDGE_PADDING = 20
const ARRIVE_EPSILON = 3
const NAP_AFTER = 12000
const PLAY_FOR = 2000
const DISMISS_KEY = "ion-pet-dismissed"

// Hoisted: a fresh array literal on every render would make the scroll-spy
// effect tear down and re-subscribe each time.
const SECTION_IDS = SECTIONS.map((section) => section.id) as unknown as string[]

type Species = "critter" | "cat" | "orbit"

const SPECIES: Species[] = ["critter", "cat", "orbit"]

interface Personality {
  /** Sprite footprint in px — also what keeps it clear of the screen edge. */
  size: number
  /** Walking pace, px per second. */
  speed: number
  /** Where it stands on first load, as a fraction of the viewport width. */
  start: number
  /** Offset from the cursor, so the two never crowd the same spot. */
  followOffset: number
  /** Hover title and accessible name for the animal itself. */
  petLabel: string
  /** Hover title and accessible name for its send-away control. */
  hideLabel: string
  hello: string
  welcomeBack: string
  /** What it says when poked, keyed by the section you're reading. */
  sectionLines: Record<string, string[]>
  idleLines: string[]
}

const PERSONALITIES: Record<Species, Personality> = {
  critter: {
    size: 56,
    speed: 70,
    start: 0.18,
    followOffset: 34,
    petLabel: "Pet the companion",
    hideLabel: "Hide the companion",
    hello: "hi — click me 👋",
    welcomeBack: "you came back for me 🐾",
    sectionLines: {
      about: [
        "That's my human up there.",
        "He types a lot. I supervise.",
        "Ask him about encrypted ML. Bring snacks.",
      ],
      experience: [
        "He says yes to a lot of committees.",
        "Treasurer AND president. Wild.",
        "Third place at a hackathon. I helped.",
      ],
      education: [
        "Two years down, one to go.",
        "Cryptography homework smells like coffee.",
        "He revises out loud. I listen.",
      ],
      projects: [
        "There's a lot down here. Scroll on.",
        "One of these is an app about me, actually.",
        "Filter the buttons up top — I'll wait.",
      ],
      skills: [
        "I only know 'sit'.",
        "Kotlin? Never heard of her.",
        "He forgot to list 'losing to me at chess'.",
      ],
    },
    idleLines: ["Hey.", "Boop.", "Nice cursor.", "Still here.", "Try the light switch, top right."],
  },
  cat: {
    size: 64,
    speed: 96, // cats dart; it should out-pace the critter noticeably
    start: 0.62,
    followOffset: -34,
    petLabel: "Pet the cat — the sprite from the Pet Overlay Android app",
    hideLabel: "Hide the cat",
    // The cat says where it came from on arrival, so the connection to the
    // Android project on this page isn't just an in-joke for people who
    // happen to click it in the right section.
    hello: "I'm the cat from his Pet Overlay Android app 🐾",
    welcomeBack: "back from the Android app. again.",
    sectionLines: {
      about: [
        "He's fine. I've had worse humans.",
        "I sit on the keyboard. It helps.",
        "He talks about me in interviews.",
      ],
      experience: [
        "Committees. So many committees.",
        "Third at a hackathon. I slept through it.",
        "Treasurer — ask where my treats went.",
      ],
      education: [
        "Cryptography. I nap through it.",
        "He revises out loud. I judge quietly.",
        "Third year. Allegedly.",
      ],
      projects: [
        "I came out of one of these, you know.",
        "The Android overlay one. I was the sprite.",
        "Scroll. I'll be here. Probably.",
      ],
      skills: [
        "My skill is knocking things off tables.",
        "Kotlin, Python, whatever. I watched.",
        "He can't open doors either. I checked.",
      ],
    },
    idleLines: ["...", "Mrrp.", "You again.", "I was sleeping.", "Don't."],
  },
  orbit: {
    size: 56,
    speed: 52, // the slowest of the three — it drifts rather than trots
    start: 0.4,
    followOffset: 0, // sits between the other two when they all come running
    petLabel: "Poke the orbit",
    hideLabel: "Hide the orbit",
    hello: "◎ orbit online.",
    welcomeBack: "◎ resuming.",
    // Not an animal, so it doesn't talk like one: clipped, observational,
    // reporting rather than chatting.
    sectionLines: {
      about: [
        "Subject: one human. Status: busy.",
        "Scanning. He checks out.",
        "I keep him in frame.",
      ],
      experience: [
        "Committee count: too many.",
        "Hackathon, third place. Logged.",
        "Two titles, one human.",
      ],
      education: [
        "Cryptography module: in progress.",
        "Three years elapsed. One remaining.",
        "Coursework detected. Coffee detected.",
      ],
      projects: [
        "Entries indexed. Scroll to browse.",
        "Filter above. I'll re-index.",
        "Some of these ship. Some sleep.",
      ],
      skills: [
        "Inventory: extensive.",
        "Languages parsed. All of them.",
        "No entry for chess. Noted.",
      ],
    },
    idleLines: ["◎", "Holding position.", "Still tracking.", "Nothing to report.", "Orbiting."],
  },
}

const randomOf = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const clampX = (x: number, size: number) => {
  const max = window.innerWidth - size - EDGE_PADDING
  return Math.min(Math.max(x, EDGE_PADDING), Math.max(EDGE_PADDING, max))
}

/**
 * Which companions have been sent away. Stored as a comma-separated list; the
 * value "1" is what the single-pet version wrote, and still means "all of them".
 */
const readDismissed = (): Species[] => {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return []
    if (raw === "1") return [...SPECIES]
    return raw.split(",").filter((value): value is Species => SPECIES.includes(value as Species))
  } catch {
    // Storage unavailable — show everyone.
    return []
  }
}

const writeDismissed = (list: Species[]) => {
  try {
    if (list.length === 0) window.localStorage.removeItem(DISMISS_KEY)
    else window.localStorage.setItem(DISMISS_KEY, list.join(","))
  } catch {
    // Nothing to persist to; the choice lasts for this visit only.
  }
}

/**
 * The companions that walk along the bottom of the page: a hand-drawn critter
 * and the pixel cat lifted from the Android overlay app. Each wanders on its
 * own, comes when the cursor drops to its level, and says something about
 * whichever section you're reading when you click it.
 *
 * This component owns only the roster — who is on screen and who has been sent
 * away. Everything about how one of them behaves lives in Companion below.
 */
export function PetCompanion() {
  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState<Species[]>([])
  // Still mode: they appear and respond, but never move on their own.
  const [reducedMotion, setReducedMotion] = useState(false)

  // Who has been summoned back at least once, so a returning pet greets you
  // differently from one you're meeting for the first time.
  const returnedRef = useRef<Set<Species>>(new Set())

  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    setDismissed(readDismissed())
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    setReady(true)
  }, [])

  // Persist the roster whenever it changes, rather than from inside the state
  // updaters — React may call those more than once per update. This also
  // quietly migrates the old single-pet "1" value to the new list form.
  useEffect(() => {
    if (!ready) return
    writeDismissed(dismissed)
  }, [ready, dismissed])

  const dismiss = useCallback((species: Species) => {
    setDismissed((current) => (current.includes(species) ? current : [...current, species]))
  }, [])

  const summonAll = useCallback(() => {
    dismissed.forEach((species) => returnedRef.current.add(species))
    setDismissed([])
  }, [dismissed])

  if (!ready) return null

  const onScreen = SPECIES.filter((species) => !dismissed.includes(species))

  return (
    <>
      {/* Deliberately not aria-hidden: these hold real buttons, and a screen
          reader user needs the option to send them away. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden h-0 sm:block">
        {onScreen.map((species) => (
          <Companion
            key={species}
            species={species}
            activeId={activeId}
            reducedMotion={reducedMotion}
            greeting={
              returnedRef.current.has(species)
                ? PERSONALITIES[species].welcomeBack
                : PERSONALITIES[species].hello
            }
            onDismiss={() => dismiss(species)}
          />
        ))}
      </div>

      {/* Sent away, but never for good — the hide control is small and sits
          right on the animal, so it's easy to hit by accident. */}
      {dismissed.length > 0 && (
        <button
          type="button"
          onClick={summonAll}
          aria-label={dismissed.length > 1 ? "Bring back the companions" : "Bring back the companion"}
          title={dismissed.length > 1 ? "Bring back the companions" : "Bring back the companion"}
          className="fixed bottom-6 right-6 z-30 hidden h-9 w-9 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground sm:grid"
        >
          <PawPrint className="h-4 w-4" />
        </button>
      )}
    </>
  )
}

/**
 * One companion. Position is written straight to the DOM node inside the
 * animation frame — putting it in React state would re-render the tree sixty
 * times a second for a decoration.
 *
 * Being unmounted is what hides a companion, so every loop below stops on its
 * own when one is sent away, and starts fresh when it's summoned back.
 */
function Companion({
  species,
  activeId,
  reducedMotion,
  greeting,
  onDismiss,
}: {
  species: Species
  activeId: string
  reducedMotion: boolean
  greeting: string
  onDismiss: () => void
}) {
  const personality = PERSONALITIES[species]
  const { size, speed, followOffset } = personality

  const petRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const targetRef = useRef(0)
  const lastFrameRef = useRef(0)
  const bubbleTimerRef = useRef<number | undefined>(undefined)
  const playTimerRef = useRef<number | undefined>(undefined)

  const [placed, setPlaced] = useState(false)
  const [walking, setWalking] = useState(false)
  const [asleep, setAsleep] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [bubble, setBubble] = useState<string | null>(null)

  // The animation loop must not restart every time the reader scrolls into a
  // new section, so the click handler reads the section from a ref.
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId

  const say = useCallback((line: string, duration = 3200) => {
    setBubble(line)
    window.clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = window.setTimeout(() => setBubble(null), duration)
  }, [])

  // Pick a starting spot before the first paint, so nothing flashes in at x=0.
  useEffect(() => {
    xRef.current = clampX(window.innerWidth * personality.start, size)
    targetRef.current = xRef.current
    if (petRef.current) {
      petRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`
    }
    setPlaced(true)
  }, [personality.start, size])

  // Walk loop: ease toward the current target, flip to face the way we move.
  useEffect(() => {
    if (!placed || reducedMotion) return
    let frame = 0

    const step = (now: number) => {
      const previous = lastFrameRef.current || now
      // Clamp the delta so returning to a backgrounded tab doesn't teleport it.
      const delta = Math.min((now - previous) / 1000, 0.05)
      lastFrameRef.current = now

      const distance = targetRef.current - xRef.current
      if (Math.abs(distance) > ARRIVE_EPSILON) {
        const direction = Math.sign(distance)
        const travel = Math.min(speed * delta, Math.abs(distance))
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
  }, [placed, reducedMotion, speed])

  // Wander to a new spot every few seconds when left alone.
  useEffect(() => {
    if (!placed || reducedMotion) return
    const wander = window.setInterval(() => {
      if (document.hidden) return
      targetRef.current = clampX(Math.random() * window.innerWidth, size)
    }, 5000)
    return () => window.clearInterval(wander)
  }, [placed, reducedMotion, size])

  // Stand still long enough and the cat curls up. Walking wakes it again.
  useEffect(() => {
    if (walking) {
      setAsleep(false)
      return
    }
    const nap = window.setTimeout(() => setAsleep(true), NAP_AFTER)
    return () => window.clearTimeout(nap)
  }, [walking])

  // Come when called: they only notice the cursor near the bottom strip, so
  // they don't chase the reader around the whole page. Chasing is movement, so
  // it's off in still mode — but they must still be kept on screen on resize.
  useEffect(() => {
    if (!placed) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY > window.innerHeight - 180) {
        targetRef.current = clampX(event.clientX - size / 2 + followOffset, size)
      }
    }
    const onResize = () => {
      xRef.current = clampX(xRef.current, size)
      targetRef.current = clampX(targetRef.current, size)
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
  }, [placed, reducedMotion, size, followOffset])

  // A greeting on arrival, so people know they're clickable.
  useEffect(() => {
    if (!placed) return
    const hello = window.setTimeout(() => say(greeting, 4200), 1800)
    return () => window.clearTimeout(hello)
  }, [placed, greeting, say])

  useEffect(
    () => () => {
      window.clearTimeout(bubbleTimerRef.current)
      window.clearTimeout(playTimerRef.current)
    },
    [],
  )

  const onPet = () => {
    const lines = personality.sectionLines[activeIdRef.current] ?? personality.idleLines
    say(randomOf(lines))
    setAsleep(false)
    setPlaying(true)
    window.clearTimeout(playTimerRef.current)
    playTimerRef.current = window.setTimeout(() => setPlaying(false), PLAY_FOR)
  }

  return (
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
          aria-label={personality.petLabel}
          title={personality.petLabel}
          className="pointer-events-auto block cursor-pointer border-0 bg-transparent p-0"
          style={{
            // The cat's sprite animates itself, so it only needs the bob when
            // the critter does — which is to say, never for the cat.
            animation: walking && species === "critter" ? "pet-bob 380ms ease-in-out infinite" : undefined,
          }}
        >
          {species === "cat" ? (
            <CatSprite walking={walking} asleep={asleep} playing={playing} facingLeft={facingLeft} />
          ) : species === "orbit" ? (
            <OrbitForm walking={walking} playing={playing} />
          ) : (
            <Critter walking={walking} facingLeft={facingLeft} />
          )}
        </button>

        {/* Send-away control, revealed on hover. */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label={personality.hideLabel}
          title={personality.hideLabel}
          className="pointer-events-auto absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border border-border bg-background text-[9px] leading-none text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/**
 * The pixel cat from the Android overlay app. Each state is its own two-frame
 * GIF, so the browser runs the animation — all this has to do is pick one.
 */
function CatSprite({
  walking,
  asleep,
  playing,
  facingLeft,
}: {
  walking: boolean
  asleep: boolean
  playing: boolean
  facingLeft: boolean
}) {
  // A hop on the way in. This mounts with the cat, so it plays on first load
  // and again each time it's summoned back.
  const [arriving, setArriving] = useState(true)
  useEffect(() => {
    const landed = window.setTimeout(() => setArriving(false), 700)
    return () => window.clearTimeout(landed)
  }, [])

  const state = arriving
    ? "jump"
    : playing
      ? "playing"
      : walking
        ? "run"
        : asleep
          ? "sleep"
          : "sit"

  return (
    <Image
      src={CAT_SPRITES[state]}
      alt=""
      width={64}
      height={64}
      unoptimized
      className="cat-sprite block transition-transform"
      style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}
    />
  )
}

/**
 * A core with a ring tumbling around it. Radially symmetric, so unlike the
 * other two it never flips to face its direction of travel — the ring spinning
 * up is what reads as movement.
 */
function OrbitForm({ walking, playing }: { walking: boolean; playing: boolean }) {
  // Poking it makes the ring race for a moment; travelling only spins it up.
  const spin = playing ? "0.45s" : walking ? "1.1s" : "7s"

  return (
    <svg
      aria-hidden="true"
      width={PERSONALITIES.orbit.size}
      height={PERSONALITIES.orbit.size}
      viewBox="0 0 56 56"
      fill="none"
      className="drop-shadow-sm"
    >
      {/* Soft shadow on the ground */}
      <ellipse cx="28" cy="51" rx="10" ry="2.5" className="fill-foreground/10" />

      <g
        style={{
          animation: `orbit-spin ${spin} linear infinite`,
          transformOrigin: "28px 30px",
          transformBox: "view-box",
        }}
      >
        <ellipse
          cx="28"
          cy="30"
          rx="18"
          ry="7"
          className="stroke-primary"
          strokeWidth="2.5"
          opacity="0.9"
        />
      </g>

      <g
        style={{
          animation: walking ? "orbit-hover 640ms ease-in-out infinite" : undefined,
          transformOrigin: "28px 30px",
          transformBox: "view-box",
        }}
      >
        <circle cx="28" cy="30" r="9.5" className="fill-primary" />
        {/* The slit reads as attention — the only feature it has. */}
        <rect x="23" y="28.5" width="10" height="3" rx="1.5" className="fill-background" />
      </g>
    </svg>
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
      width={PERSONALITIES.critter.size}
      height={PERSONALITIES.critter.size}
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
