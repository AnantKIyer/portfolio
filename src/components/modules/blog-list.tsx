"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowUpRight, Calendar } from "lucide-react";
import { api } from "convex/_generated/api";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/page-transition";

export function BlogList() {
  const posts = useQuery(api.blog.list);

  return (
    <PageTransition>
      <Section spacing="none" className="pt-28 md:pt-36">
        <Container>
          <Badge tone="outline" className="py-1.5">
            Writing
          </Badge>
          <Heading variant="display" className="mt-6 text-[clamp(2.5rem,7vw,4.5rem)]">
            Notes & <span className="text-accent">thoughts</span>
          </Heading>
          <Text variant="body" className="mt-4 max-w-xl text-lg text-muted-foreground">
            Essays on engineering, design, and building products.
          </Text>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {(posts ?? []).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card variant="elevated" padding="lg" hover className="h-full">
                  {post.coverImageUrl && (
                    <div
                      className="mb-5 aspect-[16/9] overflow-hidden rounded-2xl bg-muted"
                      style={{
                        backgroundImage: `url(${post.coverImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {post.publishedAt && (
                      <Caption className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Caption>
                    )}
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} tone="outline" className="text-[11px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Heading variant="h4" className="mt-4">
                    {post.title}
                  </Heading>
                  <Text variant="small" className="mt-2 text-muted-foreground">
                    {post.excerpt}
                  </Text>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Read article <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          {posts?.length === 0 && (
            <Card variant="soft" padding="lg" className="mt-8 text-center">
              <Text variant="body" className="text-muted-foreground">
                No posts published yet. Check back soon.
              </Text>
            </Card>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
