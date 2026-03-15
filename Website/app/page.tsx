import { Section } from "@/components/section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Section />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <Footer />
    </main>
  )
}
