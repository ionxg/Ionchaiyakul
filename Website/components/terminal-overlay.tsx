"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { TerminalSquare, X } from "lucide-react"
import { TERMINAL_TREE, type TermNode } from "@/lib/terminal-fs"

type LineKind = "cmd" | "out" | "dim" | "accent" | "error"

interface Line {
  kind: LineKind
  text: string
}

const LINE_CLASS: Record<LineKind, string> = {
  cmd: "text-[#ECF7EC]",
  out: "text-[#CFE0CF]",
  dim: "text-[#728F76]",
  accent: "text-[#7CD67C]",
  error: "text-[#FF9D8D]",
}

const MOTD: Line[] = [
  { kind: "accent", text: "ion@portfolio" },
  { kind: "dim", text: "This whole site, as a filesystem. Everything is a file you can read." },
  { kind: "dim", text: "help · ls · cd <dir> · cat <file> · tree · find <term> · exit" },
  { kind: "out", text: "" },
]

const HELP: Array<[string, string]> = [
  ["ls [-l] [dir]", "list a folder"],
  ["cd <dir>", "change folder — .. and ~ work"],
  ["cat <file>", "print a file"],
  ["pwd", "print the folder I'm in"],
  ["tree", "the whole site as one map"],
  ["find <term>", "search every filename and every line"],
  ["whoami", "the short version"],
  ["neofetch", "the card"],
  ["date", "today's date"],
  ["echo <text>", "say it back"],
  ["history", "what you've typed"],
  ["clear", "wipe the screen"],
  ["exit", "close the terminal"],
]

const CARD: Array<[string, string]> = [
  ["user", "ion chaiyakul"],
  ["role", "software engineering student"],
  ["school", "Victoria University of Wellington"],
  ["location", "Wellington, New Zealand"],
  ["clubs", "President VEC · Treasurer LEC"],
  ["focus", "security tooling · web apps · encrypted ML"],
  ["email", "chaiyawach@myvuw.ac.nz"],
]

const QUICK = ["ls", "cd awards", "cat awards/supreme-club-award.md", "tree", "find security"]

const MAX_LINES = 500

function pad(value: string, width: number) {
  return value.length >= width ? `${value} ` : value.padEnd(width)
}

function childNames(node: TermNode) {
  return node.type === "dir" ? Object.keys(node.children) : []
}

function nodeAt(parts: string[]): TermNode | null {
  let node: TermNode = TERMINAL_TREE

  for (const part of parts) {
    if (node.type !== "dir" || !node.children[part]) return null
    node = node.children[part]
  }

  return node
}

/** Resolves an argument against the current directory, honouring `~`, `/`,
    `.` and `..` the way a shell does. No argument means the current
    directory, so a bare `ls` lists where you are standing rather than home. */
function resolvePath(cwd: string[], arg: string): string[] {
  if (!arg || arg === ".") return [...cwd]
  if (arg === "~" || arg === "/") return []

  const raw =
    arg.startsWith("/") || arg.startsWith("~/")
      ? arg.replace(/^~\//, "").replace(/^\//, "").split("/")
      : [...cwd, ...arg.split("/")]

  const out: string[] = []
  for (const part of raw) {
    if (part === "" || part === ".") continue
    if (part === "..") out.pop()
    else out.push(part)
  }

  return out
}

function pathLabel(parts: string[]) {
  return parts.length ? `~/${parts.join("/")}` : "~"
}

/** Every node in the tree, depth-first, as `path` → node pairs. */
function walk(node: TermNode, prefix = ""): Array<{ path: string; node: TermNode }> {
  if (node.type !== "dir") return []

  return Object.entries(node.children).flatMap(([name, child]) => {
    const path = child.type === "dir" ? `${prefix}${name}/` : `${prefix}${name}`
    return [{ path, node: child }, ...walk(child, `${prefix}${name}/`)]
  })
}

export function TerminalOverlay() {
  const [open, setOpen] = useState(false)
  const [cwd, setCwd] = useState<string[]>([])
  const [lines, setLines] = useState<Line[]>(MOTD)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const history = useRef<string[]>([])
  const historyIndex = useRef(0)

  // Ctrl+` is the usual "give me a terminal" reflex, so it opens this one too.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "`") {
        event.preventDefault()
        setOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // While the window is up it owns the screen: the page behind it shouldn't
  // scroll, and the prompt should already have focus.
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    inputRef.current?.focus()

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, open])

  const print = useCallback((incoming: Line[], nextCwd?: string[]) => {
    setLines((current) => {
      const next = [...current, ...incoming]
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
    })
    if (nextCwd) setCwd(nextCwd)
  }, [])

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim()
      const out: Line[] = [{ kind: "cmd", text: `${pathLabel(cwd)} $ ${input}` }]

      if (!input) {
        print(out)
        return
      }

      history.current.push(input)
      historyIndex.current = history.current.length

      const bits = input.split(/\s+/)
      const cmd = bits[0].toLowerCase()
      const flags = bits.slice(1).filter((bit) => bit.startsWith("-")).join("")
      const arg = bits.slice(1).filter((bit) => !bit.startsWith("-")).join(" ")

      switch (cmd) {
        case "help":
        case "man": {
          out.push({ kind: "out", text: "" })
          for (const [name, what] of HELP) {
            out.push({ kind: "out", text: `  ${pad(name, 17)}${what}` })
          }
          out.push({ kind: "out", text: "" })
          break
        }

        case "exit":
        case "quit":
        case "close":
        case "logout":
          setOpen(false)
          return

        case "clear":
          setLines(MOTD)
          return

        case "pwd":
          out.push({ kind: "out", text: pathLabel(cwd) })
          break

        case "date":
          out.push({ kind: "out", text: new Date().toString() })
          break

        case "echo":
          out.push({ kind: "out", text: bits.slice(1).join(" ") })
          break

        case "history":
          history.current.forEach((entry, index) => {
            out.push({ kind: "dim", text: `  ${pad(String(index + 1), 4)}${entry}` })
          })
          break

        case "whoami":
          out.push({ kind: "accent", text: "ion chaiyakul" })
          out.push({ kind: "out", text: "software engineering student · VUW · Wellington, NZ" })
          out.push({ kind: "dim", text: "cat about/bio.txt for the long version" })
          break

        case "neofetch": {
          out.push({ kind: "out", text: "" })
          for (const [key, value] of CARD) {
            out.push({ kind: "out", text: `  ${pad(key, 11)}${value}` })
          }
          out.push({ kind: "out", text: "" })
          break
        }

        case "ls":
        case "dir": {
          const node = nodeAt(resolvePath(cwd, arg))

          if (!node) {
            out.push({ kind: "error", text: `ls: no such folder: ${arg}` })
            break
          }
          if (node.type === "file") {
            out.push({ kind: "out", text: `  ${arg}` })
            break
          }

          for (const name of childNames(node)) {
            const child = node.children[name]
            const isDir = child.type === "dir"
            const label = isDir ? `${name}/` : name

            let row = `  ${label}`
            if (flags.includes("l")) {
              const detail = isDir
                ? `${childNames(child).length} items`
                : child.meta ?? "file"
              row = `  ${pad(isDir ? "dir" : "file", 6)}${pad(label, 30)}${detail}`
            } else if (!isDir && child.meta) {
              row = `  ${pad(label, 30)}${child.meta}`
            }

            out.push({ kind: isDir ? "accent" : "out", text: row })
          }
          break
        }

        case "cd": {
          // Bare `cd` goes home, the one case where no argument is not ".".
          const parts = arg ? resolvePath(cwd, arg) : []
          const node = nodeAt(parts)

          if (!node) {
            out.push({ kind: "error", text: `cd: no such folder: ${arg}` })
            break
          }
          if (node.type !== "dir") {
            out.push({ kind: "error", text: `cd: not a folder: ${arg}` })
            break
          }

          print(out, parts)
          return
        }

        case "cat":
        case "less":
        case "read":
        case "open": {
          if (!arg) {
            out.push({ kind: "error", text: `${cmd}: name a file` })
            break
          }

          const node = nodeAt(resolvePath(cwd, arg))

          if (!node) {
            out.push({ kind: "error", text: `${cmd}: no such file: ${arg}` })
            break
          }
          if (node.type === "dir") {
            out.push({ kind: "error", text: `${cmd}: ${arg} is a folder — try ls ${arg}` })
            break
          }

          out.push({ kind: "out", text: "" })
          for (const line of node.body) {
            out.push({ kind: line.startsWith("#") ? "accent" : "out", text: line })
          }
          out.push({ kind: "out", text: "" })
          break
        }

        case "tree": {
          out.push({ kind: "accent", text: "~" })
          for (const entry of walk(TERMINAL_TREE)) {
            const clean = entry.path.replace(/\/$/, "")
            const depth = clean.split("/").length - 1
            const name = clean.split("/").pop() ?? ""
            const isDir = entry.node.type === "dir"
            out.push({
              kind: isDir ? "accent" : "dim",
              text: `${"   ".repeat(depth)}└─ ${name}${isDir ? "/" : ""}`,
            })
          }
          break
        }

        case "find":
        case "grep":
        case "search": {
          if (!arg) {
            out.push({ kind: "error", text: `${cmd}: give me something to look for` })
            break
          }

          const needle = arg.toLowerCase()
          let hits = 0

          for (const entry of walk(TERMINAL_TREE)) {
            if (entry.path.toLowerCase().includes(needle)) {
              out.push({ kind: "accent", text: `  ~/${entry.path}` })
              hits += 1
            }
            if (entry.node.type === "file") {
              for (const line of entry.node.body) {
                if (line.toLowerCase().includes(needle)) {
                  out.push({ kind: "dim", text: `  ~/${entry.path} : ${line.trim()}` })
                  hits += 1
                }
              }
            }
          }

          out.push(
            hits
              ? { kind: "dim", text: `  — ${hits} match${hits === 1 ? "" : "es"}` }
              : { kind: "error", text: `  no matches for "${arg}"` },
          )
          break
        }

        case "sudo":
          out.push({ kind: "dim", text: "nice try." })
          break

        default:
          out.push({ kind: "error", text: `${cmd}: command not found — try help` })
      }

      print(out)
    },
    [cwd, print],
  )

  /** Tab completion against whatever folder the half-typed path points at. */
  const complete = useCallback(
    (el: HTMLInputElement) => {
      const bits = el.value.split(/\s+/)
      const fragment = bits[bits.length - 1] ?? ""
      const slash = fragment.lastIndexOf("/")
      const dir = slash === -1 ? "" : fragment.slice(0, slash)
      const stub = slash === -1 ? fragment : fragment.slice(slash + 1)

      const node = nodeAt(resolvePath(cwd, dir))
      if (!node || node.type !== "dir") return

      const matches = childNames(node).filter((name) => name.startsWith(stub))
      if (matches.length !== 1) return

      const picked = node.children[matches[0]].type === "dir" ? `${matches[0]}/` : matches[0]
      bits[bits.length - 1] = dir ? `${dir}/${picked}` : picked
      el.value = bits.join(" ")
    },
    [cwd],
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget

    if (event.key === "Tab") {
      event.preventDefault()
      complete(el)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!history.current.length) return
      historyIndex.current = Math.max(0, historyIndex.current - 1)
      el.value = history.current[historyIndex.current]
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!history.current.length) return
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1)
      el.value =
        historyIndex.current >= history.current.length
          ? ""
          : history.current[historyIndex.current]
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        title="Open terminal (Ctrl+`)"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <TerminalSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Terminal</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0A0E14]/60 p-4 backdrop-blur-sm sm:p-10"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            className="w-full max-w-3xl overflow-hidden rounded-xl border border-[#232E25] bg-[#0C100D] shadow-2xl"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Window chrome — the red light closes it, like the real thing. */}
            <div className="flex items-center gap-3 border-b border-[#232E25] bg-[#171D18] px-3.5 py-2.5">
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="h-3 w-3 rounded-full bg-[#FF5F57]"
                />
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <p className="flex-1 text-center font-mono text-xs text-[#728F76]">
                ion@portfolio — {pathLabel(cwd)} — zsh
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="shrink-0 text-[#728F76] transition-colors hover:text-[#ECF7EC] sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
              <span aria-hidden="true" className="hidden w-12 sm:block" />
            </div>

            <div className="flex gap-0.5 border-b border-[#232E25] bg-[#171D18] px-2.5">
              <span className="border-t-2 border-[#7CD67C] bg-[#0C100D] px-4 py-2 font-mono text-xs text-[#ECF7EC]">
                ion@portfolio
              </span>
            </div>

            <div ref={scrollRef} className="h-[60vh] overflow-y-auto px-4 pt-4 sm:h-[26rem]">
              {lines.map((line, index) => (
                <p
                  key={index}
                  className={`m-0 whitespace-pre-wrap break-words font-mono text-[13.5px] leading-relaxed ${LINE_CLASS[line.kind]}`}
                >
                  {/* A space keeps blank lines tall, so the spacing a file was
                      written with survives into the output. */}
                  {line.text || " "}
                </p>
              ))}

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  const el = inputRef.current
                  if (!el) return
                  const value = el.value
                  el.value = ""
                  run(value)
                }}
                className="flex items-baseline gap-2 pb-5 pt-0.5"
              >
                <label htmlFor="terminal-input" className="sr-only">
                  Type a command
                </label>
                <span className="shrink-0 font-mono text-[13.5px] leading-relaxed text-[#7CD67C]">
                  {pathLabel(cwd)} $
                </span>
                <input
                  id="terminal-input"
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onKeyDown={onKeyDown}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[13.5px] leading-relaxed text-[#ECF7EC] caret-[#7CD67C] outline-none"
                />
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[#232E25] bg-[#171D18] px-3.5 py-2.5">
              {QUICK.map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => run(command)}
                  className="rounded-md border border-[#232E25] px-3 py-2 font-mono text-[11px] text-[#728F76] transition-colors hover:border-[#7CD67C] hover:text-[#7CD67C]"
                >
                  {command}
                </button>
              ))}
              <span className="ml-auto hidden font-mono text-[11px] text-[#728F76] sm:inline">
                tab completes · ↑↓ history · esc closes
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
