import { ProjectDetailPage } from "@/components/modules/project-detail-page"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetailPage slug={params.id} />
}
