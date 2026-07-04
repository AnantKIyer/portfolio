"use client"

import { useQuery } from "convex/react"
import { notFound } from "next/navigation"
import { api } from "convex/_generated/api"
import { getProjectById } from "@/data/projects"
import { ProjectDetail } from "@/components/modules/project-detail"
import { PageTransition } from "@/components/motion/page-transition"

export function ProjectDetailPage({ slug }: { slug: string }) {
  const liveProject = useQuery(api.projects.getBySlug, { slug })
  const fallbackProject = getProjectById(slug)
  const project = liveProject ?? fallbackProject

  if (liveProject === undefined && !fallbackProject) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-28">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (liveProject === null && !fallbackProject) {
    notFound()
  }

  if (!project) {
    notFound()
  }

  return (
    <PageTransition>
      <ProjectDetail project={project} />
    </PageTransition>
  )
}
