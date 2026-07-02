"use client"

import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <Section spacing="lg" className="flex min-h-[80vh] items-center pt-28">
      <Container className="text-center">
        <span className="wobble inline-block text-7xl md:text-9xl">🧭</span>
        <Heading variant="display" className="mt-6 text-[clamp(3rem,12vw,9rem)]">
          404
        </Heading>
        <Text variant="body" className="mx-auto mt-4 max-w-sm text-muted-foreground">
          This page wandered off. Let&apos;s get you back on track.
        </Text>
        <Button variant="accent" size="lg" asChild className="mt-8">
          <Link href="/">Take me home</Link>
        </Button>
      </Container>
    </Section>
  )
}
