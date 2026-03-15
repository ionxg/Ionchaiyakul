import { ArrowUpRight, Github } from "lucide-react"

interface Project {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio website showcasing projects and skills. Built with performance and accessibility in mind.",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "Murder Mystery Game - Mechanic",
    description:
      "A personal portfolio website showcasing projects and skills. Built with performance and accessibility in mind.",
    technologies: ["Next.js", "CSS", "HTML"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "Privacy-Preserving Machine Learning (Ongoing Research) | Self-Directed",
    description:
      "Investigating method for training neural networks on encrypted datasets to ensure data privacy without sacrificing model utility.",
    technologies: ["AI", "Homomorphic Encryption", "Privacy"],
    githubUrl: "#",
    liveUrl: "#",
  }
]

export function ProjectsSection() {
  return (
    <section id="projects" className="px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-primary mb-12 font-medium">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
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
                  {project.liveUrl && (
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
