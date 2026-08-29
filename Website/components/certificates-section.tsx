import { Atom, Award, Lightbulb, Medal, Megaphone, Network, PenTool, Repeat, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

interface Certificate {
  name: string
  issuer: string
  issuerUrl?: string
  period?: string
  icon: LucideIcon
  description: string
  technologies?: string[]
  /** Set while the certification is still being studied for. */
  inProgress?: boolean
}

const certificates: Certificate[] = [
  {
    name: "CCNA — Cisco Certified Network Associate",
    issuer: "Cisco",
    icon: Network,
    inProgress: true,
    description:
      "Currently studying towards the exam — network fundamentals, routing and switching, IP connectivity and services, and security basics.",
    technologies: ["Networking", "Routing & Switching", "TCP/IP", "Network Security"],
  },
  {
    name: "HubSpot Marketing Hub Software Certified",
    issuer: "HubSpot Academy",
    issuerUrl: "https://academy.hubspot.com/",
    period: "Aug 2026 — Sep 2027",
    icon: Megaphone,
    description:
      "HubSpot Academy's certification on Marketing Hub — building and running an inbound marketing strategy across the platform's campaign, email, and CRM tooling.",
    technologies: ["Marketing Hub", "Inbound Marketing", "Campaigns", "CRM"],
  },
  {
    name: "Design Thinking",
    issuer: "Stock Exchange of Thailand (SET)",
    issuerUrl: "https://www.set.or.th/",
    period: "2026",
    icon: Lightbulb,
    description:
      "SET e-Learning course on the design thinking process — framing a problem around the people it affects before reaching for a solution.",
    technologies: ["Design Thinking", "User Research", "Problem Framing"],
  },
  {
    name: "Design Thinking in Practice",
    issuer: "Stock Exchange of Thailand (SET)",
    issuerUrl: "https://www.set.or.th/",
    period: "2026",
    icon: PenTool,
    description:
      "The follow-on course, applying the process to real cases — moving from user research through prototyping and into testing.",
    technologies: ["Design Thinking", "Prototyping", "User Testing"],
  },
  {
    name: "Agile Development",
    issuer: "Stock Exchange of Thailand (SET)",
    issuerUrl: "https://www.set.or.th/",
    period: "2026",
    icon: Repeat,
    description:
      "SET e-Learning course on Agile delivery — iterative planning, short feedback loops, and shipping work in increments rather than one drop.",
    technologies: ["Agile", "Iterative Delivery", "Team Collaboration"],
  },
  {
    name: "Wellington Plus Award",
    issuer: "Victoria University of Wellington",
    issuerUrl: "https://www.wgtn.ac.nz/",
    icon: Award,
    description:
      "The university's co-curricular award, recognising volunteering, leadership, and club involvement carried alongside the degree.",
    technologies: ["Leadership", "Volunteering", "Community Engagement"],
  },
  {
    name: "3rd Place — VUW Hackathon 2025",
    issuer: "Victoria University of Wellington",
    issuerUrl: "https://www.wgtn.ac.nz/",
    period: "2025",
    icon: Trophy,
    description:
      "Collaborated with a team to develop an innovative solution during the VUW Hackathon 2025, demonstrating strong problem-solving skills and creativity in a competitive environment.",
    technologies: ["React", "Node.js", "Git", "Docker"],
  },
  {
    name: "Small Club Supreme Award",
    issuer: "VUWSA",
    issuerUrl: "https://www.vuwsa.org.nz/",
    period: "2025",
    icon: Medal,
    description:
      "Awarded at the VUWSA club awards, recognising the standout small club of the year for the events it ran and the community it built.",
    technologies: ["Leadership", "Event Planning", "Club Management"],
  },
  {
    name: "AINSE Site Visit — Sydney",
    issuer: "Australian Institute of Nuclear Science and Engineering",
    issuerUrl: "https://www.ainse.edu.au/",
    period: "2026",
    icon: Atom,
    description:
      "Attended an AINSE site visit in Sydney, touring research facilities and seeing how nuclear science and engineering work is run in practice.",
    technologies: ["Nuclear Science & Engineering", "Research Facilities"],
  },
]

export function CertificatesSection() {
  return (
    <section id="certificates" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Certificates" title="What I've earned" />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <Reveal key={cert.name} delay={index * 80}>
              <article className="flex h-full flex-col rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <cert.icon className="h-5 w-5" />
                  </span>

                  <div className="space-y-1">
                    <h3 className="text-base font-medium leading-snug">{cert.name}</h3>
                    {cert.issuerUrl ? (
                      <a
                        href={cert.issuerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {cert.issuer}
                      </a>
                    ) : (
                      <p className="text-sm text-primary">{cert.issuer}</p>
                    )}
                  </div>
                </div>

                {/* Either a completion year or an "in progress" marker, so a
                    certification being studied for never reads as already held.
                    Neither one means no row at all, rather than an empty gap. */}
                {cert.inProgress ? (
                  <p className="mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-0.5 font-mono text-xs text-primary">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                      In progress
                    </span>
                  </p>
                ) : (
                  cert.period && (
                    <p className="mb-3 font-mono text-xs text-muted-foreground">{cert.period}</p>
                  )
                )}

                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>

                {cert.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {cert.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
