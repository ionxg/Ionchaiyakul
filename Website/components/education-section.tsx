interface EducationItem {
  period: string
  degree: string
  institution: string
  institutionUrl?: string
  description?: string
  coursework: string[]
}

// TODO: update the degree name, dates, and coursework to match your records.
const education: EducationItem[] = [
  {
    period: "2022 — 2026 (Expected)",
    degree: "Bachelor of Engineering with Honours — Software Engineering",
    institution: "Victoria University of Wellington",
    institutionUrl: "https://www.wgtn.ac.nz/",
    description:
      "Penultimate-year Software Engineering student focusing on software development, cybersecurity, and AI.",
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
    <section id="education" className="px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-primary mb-12 font-medium">
          Education
        </h2>

        <div className="space-y-12">
          {education.map((item) => (
            <div key={item.degree} className="grid md:grid-cols-[200px_1fr] gap-4">
              {/* Period */}
              <p className="text-sm text-muted-foreground font-mono">{item.period}</p>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{item.degree}</h3>
                  {item.institutionUrl ? (
                    <a
                      href={item.institutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      {item.institution}
                    </a>
                  ) : (
                    <p className="text-primary text-sm">{item.institution}</p>
                  )}
                </div>

                {item.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.coursework.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Relevant coursework
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.coursework.map((course) => (
                        <span
                          key={course}
                          className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
