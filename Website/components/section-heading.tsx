import { Reveal } from "@/components/reveal"

/**
 * Shared section header: eyebrow label, title, and a rule that runs out to the
 * edge of the column so every section starts the same way.
 */
export function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">{label}</p>
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
    </Reveal>
  )
}
