"use client"

import { useState } from "react"
import { ArrowUpRight, Github, Lock } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

interface Project {
  title: string
  category: string | string[]
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  private?: boolean
}

const projects: Project[] = [
  {
    title: "Aurora — Studio Landing Page",
    category: "Web Development",
    description:
      "A framework-free landing page for a fictional creative studio — an animated gradient hero, scroll-triggered reveals, a mobile menu, and a floating-label contact form.",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    liveUrl: "https://ionxg.github.io/WebDesign/#",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    description:
      "A personal portfolio website showcasing projects and skills. Built with performance and accessibility in mind.",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/ionxg/Ionchaiyakul",
    liveUrl: "#",
  },
  {
    title: "Tracking System",
    category: "Web Development",
    description:
      "A full-stack engagement platform that tracks participants via QR scanning — login, member-only access, points collection, scan history, and an admin dashboard.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel", "QR Code System"],
    githubUrl: "https://github.com/ionxg/point",
    liveUrl: "#",
  },
  {
    title: "Security Log Analyzer",
    category: "Cybersecurity",
    description:
      "A Python tool that parses Linux auth logs to detect suspicious SSH activity — flagging brute-force attempts, suspicious IPs, and targeted usernames.",
    technologies: ["Python", "Regular Expressions", "Log Analysis", "Cybersecurity Fundamentals", "SSH"],
    githubUrl: "https://github.com/ionxg/security-log-analyzer",
    liveUrl: "https://github.com/ionxg/security-log-analyzer",
  },
  {
    title: "Telecom Integration Project",
    category: "Backend & Systems",
    description:
      "A telecom service integration simulator modeling subscriber provisioning, session management, and VoLTE-style call setup over REST APIs and multi-service workflows.",
    technologies: ["Python", "FastAPI", "Docker", "REST API", "Postman"],
    githubUrl: "https://github.com/ionxg/telecom-intregration",
    liveUrl: "https://github.com/ionxg/telecom-intregration",
  },
  {
    title: "Murder Mystery Game - Mechanic - 2025",
    category: "Games",
    description:
      "A web-based murder mystery engine for a club event — players move through three rounds of choices, with the server returning clues and consequences to drive the story dynamically.",
    technologies: ["Javascript", "CSS", "HTML"],
    githubUrl: "https://github.com/ionxg/Murder-mystery-machanic",
    liveUrl: "https://github.com/ionxg/Murder-mystery-machanic",
  },
  {
    title: "Murder Mystery Game - Website - 2025",
    category: "Games",
    description:
      "A companion site presenting characters, backstory, and the storyline for the murder mystery event, helping players follow the narrative before and during play.",
    technologies: ["HTML"],
    githubUrl: "https://github.com/ionxg/Website-for-Murder-Mystery",
    liveUrl: "https://github.com/ionxg/Website-for-Murder-Mystery",
  },
  {
    title: "Murder Mystery Game - Engine - 2026",
    category: "Games",
    description:
      "A fully offline, local-network web app for running a 3-day in-person 'find the culprit' event — teams join from their phones over WiFi to vote on suspects, unlock code-locked video clips, scan QR info pages, and ask daily hints, all driven by an admin dashboard with a hidden live scoreboard.",
    technologies: ["Node.js", "Express", "EJS", "SQLite", "QR Code System"],
    githubUrl: "https://github.com/ionxg/murder-mystery-2026",
    liveUrl: "https://github.com/ionxg/murder-mystery-2026",
  },
  {
    title: "Pet Overlay (Android)",
    category: "Mobile",
    description:
      "An Android app that floats an interactive pet on top of other apps — a desktop-pet-style companion for your home screen.",
    technologies: ["Kotlin", "Android SDK", "Jetpack Compose"],
    private: true,
  },
  {
    title: "Daily Tracking (Android)",
    category: "Mobile",
    description:
      "A fully offline Android activity tracker for one-off tasks and daily habits — set timeframes, tick items off per day, and follow streaks, stats, and history. Backed by a local Room database with reminder notifications.",
    technologies: ["Kotlin", "Jetpack Compose", "Room", "Material 3", "AlarmManager", "Android SDK"],
    githubUrl: "https://github.com/ionxg/task-tracking",
    liveUrl: "https://github.com/ionxg/task-tracking",
  },
  {
    title: "ML Network Intrusion Detection System",
    category: "Cybersecurity",
    description:
      "A machine-learning intrusion detection system that classifies network connections as normal or attack — a scikit-learn Random Forest trained on NSL-KDD, served via a FastAPI inference API.",
    technologies: ["Python", "scikit-learn", "FastAPI", "pandas", "Machine Learning", "NSL-KDD"],
    private: true,
  },
  {
    title: "Rosy — Location-Based Map",
    category: ["Web Development", "Mobile"],
    description:
      "A location-based web and mobile map for local tourism — a browser-scale take on Pokémon GO, with a live GPS avatar shared in real time over Socket.io and tappable points of interest. Shipped as an Android app via Capacitor.",
    technologies: ["MapLibre GL JS", "Node.js", "Socket.io", "Express", "Capacitor", "Geolocation API"],
    githubUrl: "https://github.com/ionxg/rosy",
    liveUrl: "https://rosy-server.onrender.com",
  },
  {
    title: "Privacy-Preserving Machine Learning (Ongoing Research) | Self-Directed",
    category: "AI & Research",
    description:
      "Investigating method for training neural networks on encrypted datasets to ensure data privacy without sacrificing model utility.",
    technologies: ["AI", "Homomorphic Encryption", "Privacy"],
    githubUrl: "#",
    liveUrl: "#",
  },
]

// Treat empty values and the "#" placeholder as "no link" so we don't render
// dead anchors that go nowhere.
const hasLink = (url?: string) => Boolean(url && url !== "#")

const ALL = "All"
// Normalize a project's category into an array so single- and multi-category
// projects are handled the same way everywhere.
const categoriesOf = (project: Project) =>
  Array.isArray(project.category) ? project.category : [project.category]
// Category filters are derived from the project data, so adding a project with a
// new category automatically adds its filter button.
const categories = [ALL, ...Array.from(new Set(projects.flatMap(categoriesOf)))]

const countFor = (category: string) =>
  category === ALL
    ? projects.length
    : projects.filter((project) => categoriesOf(project).includes(category)).length

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState(ALL)

  const visibleProjects =
    activeCategory === ALL
      ? projects
      : projects.filter((project) => categoriesOf(project).includes(activeCategory))

  return (
    <section id="projects" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Projects" title="Things I've built" />

        {/* Category filters */}
        <Reveal className="mb-10 flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {category}
                <span className={isActive ? "ml-1.5 opacity-70" : "ml-1.5 opacity-50"}>
                  {countFor(category)}
                </span>
              </button>
            )
          })}
        </Reveal>

        <Reveal className="grid gap-5 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <article
              key={project.title}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Accent bar that wipes in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              />

              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="text-base font-medium leading-snug transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <div className="flex shrink-0 items-center gap-3">
                  {project.private && (
                    <span
                      title="Source not public"
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      <Lock className="h-3 w-3" />
                      Private
                    </span>
                  )}
                  {hasLink(project.githubUrl) && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {hasLink(project.liveUrl) && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`View ${project.title} live`}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              <p className="mb-4 font-mono text-xs text-primary">
                {categoriesOf(project).join(" · ")}
              </p>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
