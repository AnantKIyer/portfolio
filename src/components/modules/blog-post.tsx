"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, Calendar } from "lucide-react";
import { api } from "convex/_generated/api";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { BlogContent } from "./blog-content";

export function BlogPostView({ slug }: { slug: string }) {
  const post = useQuery(api.blog.getBySlug, { slug });

  if (post === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-28">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!post) {
    return (
      <Section spacing="none" className="pt-28">
        <Container className="text-center">
          <Heading variant="h3">Post not found</Heading>
          <Button variant="soft" className="mt-6" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <PageTransition>
      <Section spacing="none" className="pt-28 md:pt-36">
        <Container className="max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              All posts
            </Link>
          </Button>

          {post.coverImageUrl && (
            <div
              className="mb-8 aspect-[21/9] overflow-hidden rounded-3xl bg-muted soft"
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
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Caption>
            )}
            {post.tags.map((tag) => (
              <Badge key={tag} tone="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Heading variant="display" className="mt-6 text-[clamp(2rem,5vw,3.5rem)]">
            {post.title}
          </Heading>
          <Text variant="body" className="mt-4 text-lg text-muted-foreground">
            {post.excerpt}
          </Text>

          <div className="mt-10 border-t border-border pt-10">
            <BlogContent content={post.content} />
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
