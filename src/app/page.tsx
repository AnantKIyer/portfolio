import { Hero } from "@/components/modules/hero"
import { Skills } from "@/components/modules/skills"
import { Projects } from "@/components/modules/projects"
import { CTA } from "@/components/modules/cta"
import { PageTransition } from "@/components/motion/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Skills />
      <Projects limit={4} />
      <CTA />
    </PageTransition>
  )
}
