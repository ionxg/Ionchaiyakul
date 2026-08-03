import { Code2, Database, Layers, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

interface SkillCategory {
  name: string
  icon: LucideIcon
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: Code2,
    skills: ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "SQL", "C", "C++"],
  },
  {
    name: "Frameworks & Libraries",
    icon: Layers,
    skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    name: "Tools & Platforms",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Docker", "Vercel", "AWS"],
  },
  {
    name: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "MySQL", "DuckDB"],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Skills" title="What I work with" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, index) => (
            <Reveal key={category.name} delay={index * 80}>
              <div className="h-full rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <category.icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-medium">{category.name}</h3>
                </div>

                <ul className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
