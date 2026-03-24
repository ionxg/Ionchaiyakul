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
    title: "President - Victoria Engineering Club",
    company: "Victoria University of Wellington",
    companyUrl: "https://nz.linkedin.com/company/vecnz",
    description:
      "Lead the Victoria Engineering Club as President, overseeing club operations, organizing events, and fostering a community for engineering students to connect and collaborate.",
    technologies: ["Leadership", "Event Planning", "Communication", "Teamwork", "Organizational Skills"],
  },
  {
    period: "2024 — Present",
    title: "Club Executive - VUW",
    company: "Victoria University of Wellington",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Serve as a club executive in many positions (Sponsorship, Treasurer, Events co-ordinator, etc.) at Victoria University of Wellington, organizing events, workshops, and activities to promote engagement.",
    technologies: ["Leadership", "Event Planning", "Communication", "Teamwork", "Organizational Skills"],
  },
  {
    period: "2025",
    title: "3rd Place - VUW Hackathon 2025",
    company: "",
    companyUrl: "https://www.wgtn.ac.nz/",
    description:
      "Collaborated with a team to develop an innovative solution during the VUW Hackathon 2025, demonstrating strong problem-solving skills and creativity in a competitive environment.",
    technologies: ["React", "Node.js", "Git", "Docker"],
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
