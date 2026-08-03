import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

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
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Experience" title="Where I've been putting the hours" />

        {/* Timeline rail — the vertical line and dots line up with each entry. */}
        <ol className="relative space-y-2 border-l border-border pl-6 md:pl-8">
          {experiences.map((exp, index) => {
            const content = (
              <>
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(1.5rem+4.5px)] top-8 h-2 w-2 rounded-full bg-border ring-4 ring-background transition-colors group-hover:bg-primary md:-left-[calc(2rem+4.5px)]"
                />
                <div className="grid gap-4 md:grid-cols-[170px_1fr]">
                  <p className="font-mono text-sm text-muted-foreground">{exp.period}</p>

                  <div className="space-y-3">
                    <h3 className="flex flex-wrap items-center gap-x-2 text-lg font-medium transition-colors group-hover:text-primary">
                      <span>
                        {exp.title}
                        {exp.company && ` · ${exp.company}`}
                      </span>
                      {exp.companyUrl && (
                        <ArrowUpRight className="h-4 w-4 shrink-0 -translate-y-1 translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                      )}
                    </h3>

                    <p className="leading-relaxed text-muted-foreground">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )

            return (
              <Reveal as="li" key={`${exp.title}-${exp.period}`} delay={index * 60}>
                {/* Only entries with a real destination become links — the
                    hackathon placing isn't somewhere you can click through to. */}
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-lg p-5 transition-colors hover:bg-card"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group relative rounded-lg p-5 transition-colors hover:bg-card">
                    {content}
                  </div>
                )}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
