"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { ArrowDownRight, Github } from "lucide-react"
import { api } from "convex/_generated/api"
import { profile as fallbackProfile, skillCategories as fallbackSkills } from "@/data/profile"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Text, Caption } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Marquee } from "@/components/ui/marquee"
import { RotatingWord } from "@/components/ui/rotating-word"
import { CopyButton } from "@/components/ui/copy-button"
import { ProfilePortrait } from "@/components/ui/profile-portrait"
import {
  LiveAvailabilityBadge,
  LiveBuildingNote,
} from "@/components/modules/live-status"
import { ResumeDownloadButton } from "@/components/modules/resume-link"

const roles = ["scalable platforms", "AI-native UIs", "design systems", "transfer engines"]

export function Hero() {
  const liveProfile = useQuery(api.siteProfile.get)
  const skills = useQuery(api.skills.list)

  const profile = liveProfile ?? fallbackProfile
  const marqueeTech = (skills ?? fallbackSkills).flatMap((c) => c.skills)

  const stats = [
    { value: profile.stats.experience, label: "Building for the web" },
    { value: profile.stats.companies, label: "Companies shipped for" },
    { value: profile.stats.technologies, label: "Tools in the belt" },
  ]

  return (
    <Section spacing="none" className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute -right-40 -top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 top-48 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky/8 blur-[130px]" />

      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <LiveAvailabilityBadge />
              <Badge tone="default" className="py-1.5 text-muted-foreground">
                {profile.location}
              </Badge>
            </div>

            <h1 className="mt-6 font-display font-semibold tracking-tight text-[clamp(2.5rem,7.5vw,6.25rem)] leading-[0.98]">
              <span className="block">Hi, I&apos;m {profile.name.split(" ")[0]}</span>
              <span className="block">
                I engineer{" "}
                <span className="accent-underline text-accent">
                  <RotatingWord words={roles} />
                </span>
              </span>
            </h1>

            <Text variant="body" className="mt-8 max-w-xl text-lg text-muted-foreground">
              {profile.tagline}
            </Text>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/projects">
                  See my work
                  <ArrowDownRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
              </Button>
              <ResumeDownloadButton
                href={profile.resumeUrl}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-card px-8 text-base font-medium soft-sm transition-colors hover:bg-muted/60"
                label="Download résumé"
              />
              <CopyButton value={profile.email} label="Copy email" className="h-14 px-6" />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="group relative h-full rounded-[2rem] border border-border/70 bg-card p-7 soft transition-all duration-300 hover:soft-lg">
              <span className="wobble absolute -right-3 -top-3 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-2xl soft-sm">
                👋
              </span>

              <div className="mb-6 flex justify-center pt-2">
                <ProfilePortrait size="lg" className="transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>

              <Caption>Currently</Caption>
              <Text variant="h4" className="mt-2">
                {profile.title}
              </Text>
              <Text variant="small" className="mt-1 text-muted-foreground">
                <LiveBuildingNote fallback="@ Brahma AI · Bangalore" />
              </Text>

              <div className="my-6 h-px w-full bg-border" />

              <div className="space-y-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-3xl font-semibold">{s.value}</span>
                    <span className="text-right text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between rounded-2xl bg-muted/70 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  View GitHub
                </span>
                <ArrowDownRight className="h-4 w-4 -rotate-90" />
              </a>
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-20 border-y border-border bg-secondary/30 py-4 md:mt-28">
        <Marquee speed="slow">
          <div className="flex items-center gap-6 pr-6">
            {marqueeTech.map((tech, i) => (
              <span key={`${tech}-${i}`} className="flex items-center gap-6">
                <span className="font-display text-base font-medium text-muted-foreground">
                  {tech}
                </span>
                <span className="text-accent/70">✦</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>
    </Section>
  )
}
