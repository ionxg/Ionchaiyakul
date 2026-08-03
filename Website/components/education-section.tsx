import { GraduationCap } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

interface EducationItem {
  period: string
  degree: string
  institution: string
  institutionUrl?: string
  description?: string
  coursework: string[]
}

const education: EducationItem[] = [
  {
    period: "2024 — 2027 (Expected)",
    degree: "Bachelor of Engineering with Honours — Software Engineering",
    institution: "Victoria University of Wellington",
    institutionUrl: "https://www.wgtn.ac.nz/",
    description: "Penultimate-year Software Engineering student",
    coursework: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Computer Networks",
      "Cybersecurity",
      "Cryptography",
      "Databases",
      "Machine Learning",
      "Software Engineering",
    ],
  },
]

export function EducationSection() {
  return (
    <section id="education" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Education" title="What I'm studying" />

        <div className="space-y-8">
          {education.map((item, index) => (
            <Reveal key={item.degree} delay={index * 80}>
              <article className="rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 md:p-8">
                <div className="grid gap-6 md:grid-cols-[170px_1fr]">
                  <p className="font-mono text-sm text-muted-foreground">{item.period}</p>

                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <GraduationCap className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-medium">{item.degree}</h3>
                        {item.institutionUrl ? (
                          <a
                            href={item.institutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {item.institution}
                          </a>
                        ) : (
                          <p className="text-sm text-primary">{item.institution}</p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                    )}

                    {item.coursework.length > 0 && (
                      <div>
                        <p className="mb-3 text-sm font-medium text-foreground">
                          Relevant coursework
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.coursework.map((course) => (
                            <span
                              key={course}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
