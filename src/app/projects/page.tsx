import { Projects } from "@/components/modules/projects"
import { PageTransition } from "@/components/motion/page-transition"

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div className="pt-24 md:pt-28">
        <Projects />
      </div>
    </PageTransition>
  )
}
