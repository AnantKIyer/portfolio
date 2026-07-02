import { Code2, Layers, Wrench } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { Text } from "@/components/ui/typography"
import { Card } from "@/components/ui/card"
import { skillCategories } from "@/data/profile"

const categoryConfig = [
  {
    icon: Code2,
    accent: "text-sky",
    chip: "bg-sky/10 text-foreground hover:bg-sky hover:text-white",
    blurb: "The fundamentals I reach for every day.",
  },
  {
    icon: Layers,
    accent: "text-violet",
    chip: "bg-violet/10 text-foreground hover:bg-violet hover:text-white",
    blurb: "Frameworks that turn ideas into products.",
  },
  {
    icon: Wrench,
    accent: "text-coral",
    chip: "bg-coral/10 text-foreground hover:bg-coral hover:text-white",
    blurb: "The workshop where everything ships.",
  },
]

export function Skills() {
  return (
    <Section spacing="lg" id="skills">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="What I work with"
          title={
            <>
              A toolkit built for{" "}
              <span className="accent-underline">shipping</span>
            </>
          }
          description="Full-stack from pixel to pipeline — chosen for reliability, not hype."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => {
            const cfg = categoryConfig[index % categoryConfig.length]
            const Icon = cfg.icon
            return (
              <Card
                key={category.title}
                variant="soft"
                padding="lg"
                hover
                className="group flex h-full flex-col"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-muted ${cfg.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")} / {skillCategories.length}
                  </span>
                </div>

                <Text variant="h4" className="mt-5">
                  {category.title}
                </Text>
                <Text variant="small" className="mt-1 text-muted-foreground">
                  {cfg.blurb}
                </Text>

                <div className="mt-6 flex flex-1 flex-wrap content-start gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${cfg.chip}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
