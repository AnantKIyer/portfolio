"use client"

import Image from "next/image"
import { ArrowUpRight, Download, GraduationCap, MapPin, Sparkles } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Heading, Text, Caption } from "@/components/ui/typography"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Experience } from "@/components/modules/experience"
import { PageTransition } from "@/components/motion/page-transition"
import { education, profile } from "@/data/profile"
import Link from "next/link"

const funFacts = [
  { emoji: "⚡", label: "Ships fast, breaks nothing" },
  { emoji: "🎨", label: "Design-minded engineer" },
  { emoji: "🤖", label: "Building AI-native UIs" },
  { emoji: "☕", label: "Powered by chai" },
]

export default function About() {
  return (
    <PageTransition>
      <Section spacing="none" className="pt-28 md:pt-36">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Badge tone="outline" className="py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                About me
              </Badge>
              <Heading variant="display" className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)]">
                Engineer with a
                <br />
                <span className="text-accent">designer&apos;s</span> eye.
              </Heading>
              <Text variant="body" className="mt-6 max-w-xl text-lg text-muted-foreground">
                {profile.tagline}
              </Text>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="accent" size="lg" asChild>
                  <Link href="/contact">
                    Work with me <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="soft" size="lg" asChild>
                  <a href={profile.resumeUrl} download>
                    <Download className="h-5 w-5" />
                    Résumé
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-accent/15 to-secondary/40 soft-sm">
                <Image
                  src="/avatar.png"
                  alt={profile.name}
                  width={640}
                  height={640}
                  priority
                  className="mx-auto h-64 w-auto object-contain object-bottom"
                />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-lime" />
                  {profile.name}
                </span>
              </div>

              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-violet" />
                  <Caption>Education</Caption>
                </div>
                <Text variant="h5" className="mt-4">
                  {education.degree}
                </Text>
                <Text variant="small" className="mt-1 text-muted-foreground">
                  {education.school}
                </Text>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {education.location}
                  </span>
                  <span>{education.period}</span>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                {funFacts.map((f) => (
                  <Card key={f.label} variant="soft" padding="md" hover>
                    <span className="text-2xl">{f.emoji}</span>
                    <Text variant="small" className="mt-2 font-medium">
                      {f.label}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Experience />
    </PageTransition>
  )
}
