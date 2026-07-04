"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "convex/_generated/api"
import { Container } from "@/components/ui/container"
import { Marquee } from "@/components/ui/marquee"
import { Text, Caption } from "@/components/ui/typography"
import { CopyButton } from "@/components/ui/copy-button"
import { profile } from "@/data/profile"

const links = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const socials = (github: string, linkedin: string, email: string) => [
  { name: "GitHub", href: github, icon: Github },
  { name: "LinkedIn", href: linkedin, icon: Linkedin },
  { name: "Email", href: `mailto:${email}`, icon: Mail },
]

export function Footer() {
  const pathname = usePathname()
  const liveProfile = useQuery(api.siteProfile.get)
  const resumeUrl = liveProfile?.resumeUrl ?? profile.resumeUrl
  const email = liveProfile?.email ?? profile.email
  const footerBio = liveProfile?.footerBio ?? profile.footerBio
  const github = liveProfile?.links.github ?? profile.links.github
  const linkedin = liveProfile?.links.linkedin ?? profile.links.linkedin
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border bg-secondary/40">
      <div className="border-b border-border/70 py-5">
        <Marquee className="[--gap:2rem]">
          <div className="flex items-center gap-8 pr-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-display text-2xl font-semibold text-muted-foreground/70 md:text-4xl"
              >
                Let&apos;s build something
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-5">
            <Link
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 font-display text-2xl font-semibold hover:text-accent md:text-3xl"
            >
              {email}
              <ArrowUpRight className="h-6 w-6" />
            </Link>
            <Text variant="small" className="max-w-sm text-muted-foreground">
              {footerBio}
            </Text>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={email} label="Copy email" />
              <a
                href={resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/60"
              >
                Résumé
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <Caption>Sitemap</Caption>
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Caption>Elsewhere</Caption>
            <div className="flex flex-col gap-2">
              {socials(github, linkedin, email).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <s.icon className="h-4 w-4" />
                  {s.name}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
          <Text variant="small" className="text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js &amp; Tailwind.
          </Text>
          <Text variant="small" className="text-muted-foreground">
            {profile.location}
          </Text>
        </div>
      </Container>
    </footer>
  )
}
