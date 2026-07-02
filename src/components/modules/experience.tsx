import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { Text, Caption } from "@/components/ui/typography"
import { Badge, Dot } from "@/components/ui/badge"
import { experiences } from "@/data/profile"

export function Experience() {
  return (
    <Section spacing="lg" id="experience">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="The road so far"
          title={
            <>
              Where I&apos;ve <span className="accent-underline">built</span>
            </>
          }
          description="Enterprise platforms across media delivery, banking, and HR tech."
        />

        <div className="mt-12 space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className="group relative rounded-3xl border border-border/70 bg-card p-6 soft-sm transition-all duration-300 hover:-translate-y-0.5 hover:soft md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <div className="md:w-64 md:shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl font-bold">
                      {exp.company}
                    </span>
                    {index === 0 && (
                      <Badge tone="lime" className="gap-1.5">
                        <Dot />
                        Now
                      </Badge>
                    )}
                  </div>
                  <Caption className="mt-2 block">{exp.period}</Caption>
                  <Text variant="small" className="mt-1 text-muted-foreground">
                    {exp.location}
                  </Text>
                </div>

                <div className="flex-1">
                  <Text variant="h5" className="text-accent">
                    {exp.role}
                  </Text>
                  <Text
                    variant="small"
                    className="mt-2 text-muted-foreground"
                  >
                    {exp.description}
                  </Text>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {exp.achievements.map((a) => (
                      <li
                        key={a}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
