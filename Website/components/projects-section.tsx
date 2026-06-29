"use client"

import { useState } from "react"
import { ArrowUpRight, Github } from "lucide-react"

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
    title: "Point System",
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

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState(ALL)

  const visibleProjects =
    activeCategory === ALL
      ? projects
      : projects.filter((project) => categoriesOf(project).includes(activeCategory))

  return (
    <section id="projects" className="px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-primary mb-12 font-medium">
          Projects
        </h2>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {visibleProjects.map((project) => (
            <div
              key={project.title}
              className="group p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3">
                  {project.private && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full border border-border text-muted-foreground whitespace-nowrap">
                      Private
                    </span>
                  )}
                  {hasLink(project.githubUrl) && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {hasLink(project.liveUrl) && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`View ${project.title} live`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Category */}
              <p className="text-xs font-mono text-primary mb-3">{categoriesOf(project).join(" · ")}</p>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
