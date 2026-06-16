"use client"

import { useState } from "react"
import { ArrowUpRight, Github } from "lucide-react"

interface Project {
  title: string
  category: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

const projects: Project[] = [
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
      "Full-stack engagement platform that uses QR code scanning to track participants. It includes login, member-only access, points collection, scan history, and an admin dashboard for QR code and points management.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel", "QR Code System"],
    githubUrl: "https://github.com/ionxg/point",
    // TODO: replace with the real deployed URL; "#" hides the live link for now.
    liveUrl: "#",
  },
  {
    title: "Security Log Analyzer",
    category: "Cybersecurity",
    description:
      "Python-based security log analyzer that reads Linux auth logs and detects suspicious SSH login activity. It tracks failed and successful logins, highlights suspicious IPs, identifies targeted usernames, and flags possible brute-force attacks.",
    technologies: ["Python", "Regular Expressions", "Log Analysis", "Cybersecurity Fundamentals", "SSH"],
    githubUrl: "https://github.com/ionxg/security-log-analyzer",
    liveUrl: "https://github.com/ionxg/security-log-analyzer",
  },
  {
    title: "Telecom Integration Project",
    category: "Backend & Systems",
    description:
      "Built a telecom service integration simulator to model subscriber provisioning, session management, and VoLTE-style call setup. The project focuses on REST API communication, multi-service integration, and testing end-to-end telecom workflows.",
    technologies: ["Python", "FastAPI", "Docker", "REST API", "Postman"],
    githubUrl: "https://github.com/ionxg/telecom-intregration",
    liveUrl: "https://github.com/ionxg/telecom-intregration",
  },
  {
    title: "Murder Mystery Game - Mechanic",
    category: "Games",
    description:
      "A web-based interactive murder mystery system designed for a club event. Players progress through 3 rounds, making choices in each round. After every choice, the server returns a response such as clues, consequences, or story updates, allowing the game to continue dynamically. The website is a core part of the event experience, since the game cannot run properly without it.",
    technologies: ["Javascript", "CSS", "HTML"],
    githubUrl: "https://github.com/ionxg/Murder-mystery-machanic",
    liveUrl: "https://github.com/ionxg/Murder-mystery-machanic",
  },
  {
    title: "Murder Mystery Game - Website",
    category: "Games",
    description:
      "A website designed to present character details, background information, and the storyline for the murder mystery event. It helps players understand the setting, roles, and narrative before and during the game, making the overall experience more immersive and easier to follow.",
    technologies: ["HTML"],
    githubUrl: "https://github.com/ionxg/Website-for-Murder-Mystery",
    liveUrl: "https://github.com/ionxg/Website-for-Murder-Mystery",
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
// Category filters are derived from the project data, so adding a project with a
// new category automatically adds its filter button.
const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))]

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState(ALL)

  const visibleProjects =
    activeCategory === ALL
      ? projects
      : projects.filter((project) => project.category === activeCategory)

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
              <p className="text-xs font-mono text-primary mb-3">{project.category}</p>

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
