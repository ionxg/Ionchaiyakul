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
    period: "2023 — Present",
    title: "Software Developer",
    company: "Your Company",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct modern web applications. Work closely with cross-functional teams including developers, designers, and product managers.",
    technologies: ["JavaScript", "TypeScript", "React", "Node.js"],
  },
  {
    period: "2022 — 2023",
    title: "Junior Developer",
    company: "Previous Company",
    companyUrl: "#",
    description:
      "Developed and styled interactive web applications for various clients. Worked with a team to implement responsive designs and ensure cross-browser compatibility.",
    technologies: ["HTML", "CSS", "JavaScript", "Git"],
  },
  {
    period: "2021 — 2022",
    title: "Intern Developer",
    company: "Startup Inc",
    companyUrl: "#",
    description:
      "Assisted in developing web applications and learned best practices for software development. Gained experience with agile methodologies and version control systems.",
    technologies: ["Python", "Django", "PostgreSQL"],
  },
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
