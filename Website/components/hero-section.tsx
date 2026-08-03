import { ArrowDown, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"

const socials = [
  { href: "https://github.com/ionxg", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/ionchaiyakul", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:chaiyawach@myvuw.ac.nz", label: "Email", Icon: Mail },
]

export function HeroSection() {
  return (
    <section
      id="top"
      className="hero-glow relative isolate flex min-h-screen flex-col justify-center px-6 py-28 md:px-12 lg:px-24"
    >
      {/* Faint grid texture, masked so it fades out before the copy starts. */}
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Left column — who, where, how to reach me */}
        <Reveal className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" />
            Wellington, New Zealand
          </p>

          <div className="space-y-3">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Ion Chaiyakul
            </h1>
            <p className="text-xl font-medium text-primary md:text-2xl">
              Software Engineering Student
            </p>
          </div>

          <p className="max-w-md leading-relaxed text-muted-foreground">
            I build practical things — security tooling, web apps, and whatever a club
            event needs by Friday.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              See my work
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="mailto:chaiyawach@myvuw.ac.nz"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary"
            >
              Get in touch
            </a>
          </div>

          <div className="flex items-center gap-5 pt-4">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:-translate-y-0.5 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>

        {/* Right column — the actual introduction */}
        <Reveal
          id="about"
          delay={120}
          className="scroll-mt-24 space-y-5 leading-relaxed text-muted-foreground"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">About</p>

          <p>
            I&rsquo;m Ion, a penultimate-year Software Engineering student at Victoria
            University of Wellington. Most of what I build starts the same way: someone
            I know has a problem, and the tool for it doesn&rsquo;t exist yet. That&rsquo;s
            how a club event became an offline murder-mystery engine that a room full of
            people ran off their phones, and how a sign-in sheet nobody wanted to maintain
            became a QR attendance system.
          </p>

          <p>
            Security is the thread through most of it. I tutor cyber security at VUW, which
            turns out to be the fastest way to find out what I only <em>thought</em> I
            understood. Alongside that I&rsquo;m researching how to train neural networks on
            data that stays encrypted end to end &mdash; privacy that doesn&rsquo;t cost you
            a usable model.
          </p>

          <p>
            Away from the editor I&rsquo;m president of the Victoria Engineering Club and
            treasurer of the Language Exchange Club, which mostly means I&rsquo;ve learned to
            budget carefully, chase sponsors politely, and get a room full of students to
            actually show up on a Tuesday.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
