import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Heading, Text, Caption } from "@/components/ui/typography"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/data/projects"

interface ProjectDetailProps {
  project: Project
}

const meta = (project: Project) => [
  { label: "Duration", value: project.duration },
  { label: "Team", value: `${project.teamSize} people` },
  { label: "Role", value: project.role },
  { label: "Year", value: String(project.year) },
]

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <>
      <Section spacing="none" className="pt-28 md:pt-36">
        <Container>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge tone="accent">{project.category}</Badge>
            <Badge tone="outline">{project.status}</Badge>
          </div>

          <Heading variant="display" className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)]">
            {project.title}
          </Heading>
          <Text
            variant="body"
            className="mt-6 max-w-3xl text-lg text-muted-foreground"
          >
            {project.longDescription}
          </Text>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button variant="accent" size="lg" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="soft" size="lg" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  Source <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {meta(project).map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/60 bg-card p-5"
              >
                <Caption>{m.label}</Caption>
                <Text variant="h6" className="mt-2">
                  {m.value}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Caption>Built with</Caption>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-lime" />
            <Heading variant="h3">Key features</Heading>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.keyFeatures.map((f, i) => (
              <Card key={f} variant="soft" padding="md" className="flex gap-3">
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Text variant="small">{f}</Text>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-coral" />
                <Heading variant="h4">Challenges</Heading>
              </div>
              <div className="mt-5 space-y-3">
                {project.challenges.map((c, i) => (
                  <Card key={c} variant="ghost" padding="md">
                    <Caption>Challenge {i + 1}</Caption>
                    <Text variant="small" className="mt-1.5">
                      {c}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-amber" />
                <Heading variant="h4">Solutions</Heading>
              </div>
              <div className="mt-5 space-y-3">
                {project.solutions.map((s, i) => (
                  <Card key={s} variant="soft" padding="md">
                    <Caption>Solution {i + 1}</Caption>
                    <Text variant="small" className="mt-1.5">
                      {s}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Card variant="elevated" padding="lg" className="text-center">
            <Heading variant="h3">Curious about the rest?</Heading>
            <Text variant="body" className="mx-auto mt-3 max-w-md text-muted-foreground">
              There&apos;s plenty more where this came from.
            </Text>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/projects">All projects</Link>
              </Button>
              <Button variant="soft" size="lg" asChild>
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  )
}
