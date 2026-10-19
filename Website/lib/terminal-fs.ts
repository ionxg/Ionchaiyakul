import { certificates } from "@/components/certificates-section"

/**
 * The site, arranged as a filesystem for the terminal overlay.
 *
 * Folders hold other nodes; files hold the lines `cat` prints. The
 * certificates and awards folders are built from the same array the
 * certificates section renders, so a new certificate shows up in both
 * places without being written twice.
 */
export type TermNode =
  | { type: "dir"; children: Record<string, TermNode> }
  | { type: "file"; meta?: string; body: string[] }

/** Turns "Faculty Delegate — Engineering" into "faculty-delegate-engineering". */
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Wraps a description at roughly terminal width so `cat` output has a ragged
    right edge rather than one very long line the viewport has to scroll. */
function wrap(text: string, width = 72): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ""

  for (const word of words) {
    if (line.length + word.length + 1 > width) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)

  return lines
}

function certificateFile(cert: (typeof certificates)[number]): TermNode {
  const when = cert.inProgress ? "in progress" : cert.period ?? ""
  const heading = cert.inProgress ? `${cert.name}  [in progress]` : cert.name

  return {
    type: "file",
    meta: [when, cert.issuer].filter(Boolean).join(" · "),
    body: [
      `# ${heading}`,
      "",
      `issuer    ${cert.issuer}`,
      ...(when ? [`when      ${when}`] : []),
      ...(cert.technologies?.length ? [`tags      ${cert.technologies.join(" · ")}`] : []),
      "",
      ...wrap(cert.description),
    ],
  }
}

/** Awards live apart from study certificates — they read as different things
    in a shell listing, the way they do on the page. */
const AWARD_ISSUERS = ["VUWSA", "Victoria University of Wellington"]

function certificateFolder(predicate: (cert: (typeof certificates)[number]) => boolean) {
  const children: Record<string, TermNode> = {}

  for (const cert of certificates.filter(predicate)) {
    children[`${slug(cert.name)}.md`] = certificateFile(cert)
  }

  return { type: "dir", children } satisfies TermNode
}

export const TERMINAL_TREE: TermNode = {
  type: "dir",
  children: {
    about: {
      type: "dir",
      children: {
        "bio.txt": {
          type: "file",
          meta: "the long version",
          body: [
            "Ion Chaiyakul — penultimate-year Software Engineering student,",
            "Victoria University of Wellington.",
            "",
            ...wrap(
              "Most of what I build starts the same way: someone I know has a problem, and the tool for it doesn't exist yet. That's how a club event became an offline murder-mystery engine that a room full of people ran off their phones, and how a sign-in sheet nobody wanted to maintain became a QR attendance system.",
            ),
          ],
        },
        "security.txt": {
          type: "file",
          meta: "the thread through it",
          body: [
            ...wrap(
              "Security is the thread through most of it. I tutored cyber security at VUW, which turned out to be the fastest way to find out what I only thought I understood.",
            ),
            "",
            ...wrap(
              "Alongside that I'm researching how to train neural networks on data that stays encrypted end to end — privacy that doesn't cost you a usable model.",
            ),
          ],
        },
        "now.txt": {
          type: "file",
          meta: "what I'm on",
          body: [
            "Studying for the CCNA.",
            "Researching ML over end-to-end encrypted data.",
            "President, Victoria Engineering Club.",
            "Treasurer, Language Exchange Club.",
          ],
        },
      },
    },

    awards: certificateFolder((cert) => AWARD_ISSUERS.includes(cert.issuer)),

    certificates: certificateFolder((cert) => !AWARD_ISSUERS.includes(cert.issuer)),

    projects: {
      type: "dir",
      children: {
        "murder-mystery-engine": {
          type: "dir",
          children: {
            "README.md": {
              type: "file",
              meta: "node · express",
              body: [
                "# Murder Mystery Engine",
                "",
                ...wrap(
                  "A web-based murder mystery engine for a club event — players move through three rounds of choices, with the server returning clues and consequences to drive the story dynamically.",
                ),
              ],
            },
          },
        },
        "qr-attendance": {
          type: "dir",
          children: {
            "README.md": {
              type: "file",
              meta: "next.js · postgres",
              body: [
                "# QR Attendance",
                "",
                ...wrap(
                  "The sign-in sheet nobody wanted to maintain, replaced by a scan at the door and a roll that writes itself.",
                ),
              ],
            },
          },
        },
      },
    },

    "contact.txt": {
      type: "file",
      meta: "how to reach me",
      body: [
        "email     chaiyawach@myvuw.ac.nz",
        "github    https://github.com/ionxg",
        "linkedin  https://www.linkedin.com/in/ionchaiyakul",
        "location  Wellington, New Zealand",
      ],
    },
  },
}
