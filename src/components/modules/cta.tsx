import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge, Dot } from "@/components/ui/badge"

export function CTA() {
  return (
    <Section spacing="md">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-10 soft md:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
          <div className="relative">
            <Badge tone="outline" className="py-1.5">
              <Dot className="text-lime" />
              Open to opportunities
            </Badge>
            <Heading variant="h1" className="mt-6 max-w-3xl">
              Got something you want built{" "}
              <span className="text-accent">properly</span>?
            </Heading>
            <Text variant="body" className="mt-5 max-w-xl text-lg text-muted-foreground">
              Whether it&apos;s a product, a platform, or a tricky UI problem — I&apos;d
              love to hear about it.
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/contact">
                  Start a conversation <ArrowUpRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="soft" size="lg" asChild>
                <Link href="/about">More about me</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
