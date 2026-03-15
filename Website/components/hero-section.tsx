import { Github, Linkedin, Mail } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column - Introduction */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Wachirawit Chaiyakul
          </h1>
          <p className="text-xl md:text-2xl text-primary font-medium">
            Software Engineering Student
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            This is my personal website where I showcase my projects and experience.
          </p>

          {/* Navigation */}
          <nav className="pt-8 space-y-4">
            <a
              href="#about"
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all" />
              <span className="text-sm uppercase tracking-widest">About</span>
            </a>
            <a
              href="#experience"
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all" />
              <span className="text-sm uppercase tracking-widest">Experience</span>
            </a>
            <a
              href="#projects"
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all" />
              <span className="text-sm uppercase tracking-widest">Projects</span>
            </a>
            <a
              href="#skills"
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all" />
              <span className="text-sm uppercase tracking-widest">Skills</span>
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-6 pt-8">
            <a
              href="https://github.com/ionxg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ionchaiyakul"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:ionxgion@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Right Column - About Content */}
        <div id="about" className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            {"I’m Wachirawit Chaiyakul, a Software Engineering student at Victoria University of Wellington. I’m interested in software development, cybersecurity, and AI, and I enjoy building practical projects that solve real problems. I’m currently working as an academic tutor and developing my skills in web development, systems programming, and machine learning."}
          </p>
          <p>
            {"Currently, I'm focused on building scalable web applications and learning new technologies. I am also doing research about how to train AI with encrpyted data which will provide many benefits including privacy, reliability, and security. "}
          </p>
          <p>
            {"When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or improving my problem-solving skills through coding challenges."}
          </p>
        </div>
      </div>
    </section>
  )
}
