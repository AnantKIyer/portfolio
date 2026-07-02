import { notFound } from "next/navigation"
import { getProjectById } from "@/data/projects"
import { ProjectDetail } from "@/components/modules/project-detail"
import { PageTransition } from "@/components/motion/page-transition"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const { projects } = await import("@/data/projects")
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <PageTransition>
      <ProjectDetail project={project} />
    </PageTransition>
  )
}
