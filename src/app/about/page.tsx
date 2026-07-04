"use client";

import { ArrowUpRight, Download, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfilePortrait } from "@/components/ui/profile-portrait";
import { Experience } from "@/components/modules/experience";
import { Guestbook } from "@/components/modules/guestbook";
import { PageTransition } from "@/components/motion/page-transition";
import { education, profile } from "@/data/profile";
import Link from "next/link";

export default function About() {
  const liveProfile = useQuery(api.siteProfile.get);

  const name = liveProfile?.name ?? profile.name;
  const title = liveProfile?.title ?? profile.title;
  const tagline = liveProfile?.tagline ?? profile.tagline;
  const location = liveProfile?.location ?? profile.location;
  const resumeUrl = liveProfile?.resumeUrl ?? profile.resumeUrl;
  const edu = liveProfile?.education ?? education;
  const headlineMuted = liveProfile?.aboutHeadlineMuted ?? "Engineer with a";
  const headlineBold = liveProfile?.aboutHeadlineBold ?? "designer's eye.";
  const funFacts = liveProfile?.funFacts ?? [
    { emoji: "⚡", label: "Ships fast, breaks nothing" },
    { emoji: "🎨", label: "Design-minded engineer" },
    { emoji: "🤖", label: "Building AI-native UIs" },
    { emoji: "☕", label: "Powered by chai" },
  ];

  return (
    <PageTransition>
      <Section spacing="none" className="pt-28 md:pt-36">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Badge tone="outline" className="py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                About me
              </Badge>
              <Heading variant="display" className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)]">
                {headlineMuted}
                <br />
                <span className="text-accent">{headlineBold}</span>
              </Heading>
              <Text variant="body" className="mt-6 max-w-xl text-lg text-muted-foreground">
                {tagline}
              </Text>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="accent" size="lg" asChild>
                  <Link href="/contact">
                    Work with me <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="soft" size="lg" asChild>
                  <a href={resumeUrl} download>
                    <Download className="h-5 w-5" />
                    Résumé
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <Card variant="elevated" padding="lg" className="text-center">
                <ProfilePortrait size="lg" className="mb-5" />
                <Text variant="h5">{name}</Text>
                <Text variant="small" className="mt-1 text-muted-foreground">
                  {title} · {location}
                </Text>
                <Badge tone="outline" className="mt-4 py-1.5">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-lime" />
                  Open to work
                </Badge>
              </Card>

              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-violet" />
                  <Caption>Education</Caption>
                </div>
                <Text variant="h5" className="mt-4">
                  {edu.degree}
                </Text>
                <Text variant="small" className="mt-1 text-muted-foreground">
                  {edu.school}
                </Text>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {edu.location}
                  </span>
                  <span>{edu.period}</span>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                {funFacts.map((f) => (
                  <Card key={f.label} variant="soft" padding="md" hover>
                    <span className="text-2xl">{f.emoji}</span>
                    <Text variant="small" className="mt-2 font-medium">
                      {f.label}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Experience />
      <Guestbook />
    </PageTransition>
  );
}
