"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "convex/_generated/api";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FeaturedProject() {
  const status = useQuery(api.siteStatus.get);
  const project = useQuery(
    api.projects.getBySlug,
    status?.featuredProjectSlug
      ? { slug: status.featuredProjectSlug }
      : "skip",
  );

  if (!status?.featuredProjectSlug || !project) {
    return null;
  }

  return (
    <Section spacing="sm">
      <Container>
        <Card
          variant="soft"
          padding="lg"
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <Text variant="caption" className="text-accent">
              Currently featured
            </Text>
            <Text variant="h4" className="mt-2">
              {project.title}
            </Text>
            {status.featuredNote && (
              <Text variant="small" className="mt-2 text-muted-foreground">
                {status.featuredNote}
              </Text>
            )}
          </div>
          <Button variant="soft" asChild>
            <Link href={`/projects/${project.slug}`}>
              View project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
