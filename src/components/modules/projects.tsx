"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { ArrowUpRight } from "lucide-react"
import { api } from "convex/_generated/api"
import { projects as fallbackProjects } from "@/data/projects"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { Text } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectReactions } from "@/components/modules/project-reactions"

interface ProjectsProps {
  limit?: number
  showHeader?: boolean
}

const categoryTone: Record<string, "violet" | "sky" | "amber" | "coral"> = {
  "Full Stack": "violet",
  Frontend: "sky",
  Backend: "amber",
  Mobile: "coral",
}

export function Projects({ limit, showHeader = true }: ProjectsProps) {
  const liveProjects = useQuery(api.projects.list)
  const allItems = liveProjects ?? fallbackProjects
  const items = limit ? allItems.slice(0, limit) : allItems

  return (
    <Section spacing="lg" id="work">
      <Container>
        {showHeader && (
          <SectionHeading
            index="02"
            eyebrow="Selected work"
            title={
              <>
                Things I&apos;ve <span className="accent-underline">shipped</span>
              </>
            }
            description="A mix of production platforms and side experiments — click any to dig in."
            action={
              limit ? (
                <Button variant="soft" asChild>
                  <Link href="/projects">
                    View all work
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : undefined
            }
          />
        )}

        <div className="mt-12 border-t border-border">
          {items.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative flex flex-col gap-4 rounded-2xl border-b border-border px-4 py-8 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:gap-8"
            >
              <span className="font-mono text-sm text-muted-foreground md:w-12">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                    {project.title}
                  </h3>
                  <Badge tone={categoryTone[project.category] ?? "default"}>
                    {project.category}
                  </Badge>
                  {project.status === "In Progress" && (
                    <Badge tone="outline">In progress</Badge>
                  )}
                  <ProjectReactions projectSlug={project.id} />
                </div>
                <Text variant="small" className="mt-2 max-w-2xl text-muted-foreground">
                  {project.description}
                </Text>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="font-mono text-[11px] text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 md:w-auto">
                <span className="font-mono text-sm text-muted-foreground">
                  &apos;{String(project.year).slice(2)}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-transparent group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
