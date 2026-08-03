import { ArrowUp, Github, Linkedin, Mail } from "lucide-react"
import { Reveal } from "@/components/reveal"

const links = [
  { href: "https://github.com/ionxg", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/ionchaiyakul", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:chaiyawach@myvuw.ac.nz", label: "Email", Icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Got something worth building?
          </h2>
          <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted-foreground">
            I&rsquo;m always up for a good problem — internships, side projects, or just a
            question about something on this page. My inbox is open.
          </p>
          <a
            href="mailto:chaiyawach@myvuw.ac.nz"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Say hello
          </a>
        </Reveal>

        <div className="flex flex-col items-center gap-6 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Designed and built by Ion Chaiyakul · Next.js, Tailwind CSS, GitHub Pages
          </p>

          <div className="flex items-center gap-5">
            {links.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Back to top"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
