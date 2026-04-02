import { ArrowUpRight } from "lucide-react"

interface ExperienceItem {
  period: string
  title: string
  company: string
  companyUrl?: string
  description: string
  technologies: string[]
}

const experiences: ExperienceItem[] = [
  {
    period: "2026 — Present",
    title: "Academic Tutor",
    company: "Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Provide academic support and guidance to students in Cyber Security, fostering a positive learning environment and helping them achieve their academic goals.",
    technologies: ["Cyber Security", "Linux", "cryptography"],
  },
  {
    period: "2026 — Present",
    title: "President",
    company: "Victoria Engineering Club (VEC) - Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Lead the Victoria Engineering Club by overseeing club direction, coordinating events, building industry connections, and creating opportunities for engineering and technology students to engage, grow, and connect.",
    technologies: ["Leadership", "Event Planning", "Communication", "Teamwork", "Organizational Skills"],
  },
  {
    period: "2026 — Present",
    title: "Treasurer",
    company: "Language Exchange Club (LEC) - Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Manage the club’s finances, budgeting, and spending while supporting the planning and delivery of events and activities for students.",
    technologies: ["Budgeting", "Financial Management", "Organization", "Communication", "Teamwork"],
  },
  {
    period: "2025 — 2026",
    title: "Sponsorship",
    company: "Language Exchange Club (LEC) - Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Reach out to external partners and sponsors to secure support for club events, helping expand opportunities and resources for members.",
    technologies: ["Sponsorship", "Networking", "Communication", "Relationship Management", "Negotiation"],
  },
  {
    period: "2025",
    title: "3rd Place - VUW Hackathon 2025",
    company: "",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Collaborated with a team to develop an innovative solution during the VUW Hackathon 2025, demonstrating strong problem-solving skills and creativity in a competitive environment.",
    technologies: ["React", "Node.js", "Git", "Docker"],
  },
  {
    period: "2024 — 2025",
    title: "Sponsorship",
    company: "Thai Student Association (TSA) - Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Support sponsorship and partnership efforts for club initiatives and cultural events, helping strengthen community engagement and event success.",
    technologies: ["Sponsorship", "Communication", "Event Support", "Networking", "Teamwork"],
  }
]

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-primary mb-12 font-medium">
          Experience
        </h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <a
              key={index}
              href={exp.companyUrl}
              className="group block p-6 -mx-6 rounded-lg hover:bg-card transition-colors"
            >
              <div className="grid md:grid-cols-[200px_1fr] gap-4">
                {/* Period */}
                <p className="text-sm text-muted-foreground font-mono">
                  {exp.period}
                </p>

                {/* Content */}
                <div className="space-y-4">
                  {/* Title & Company */}
                  <h3 className="text-lg font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                    {exp.title} · {exp.company}
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
