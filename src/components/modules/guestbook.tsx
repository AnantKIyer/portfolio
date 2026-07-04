"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Guestbook() {
  const entries = useQuery(api.guestbook.listApproved);
  const submit = useMutation(api.guestbook.submit);
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submit({ name, message, company: company || undefined });
      setSent(true);
      setName("");
      setMessage("");
      setCompany("");
      setTimeout(() => setSent(false), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section spacing="md" id="guestbook">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Text variant="h3">Guestbook</Text>
            <Text variant="small" className="mt-2 text-muted-foreground">
              Worked together? Leave a note — I review before it goes live.
            </Text>
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm"
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company (optional)"
                className="w-full rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                required
                rows={4}
                className="w-full resize-none rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm"
              />
              <Button type="submit" variant="accent" disabled={submitting}>
                {submitting ? "Sending..." : sent ? "Thanks!" : "Leave a note"}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {(entries ?? []).map((entry) => (
              <Card key={entry._id} variant="soft" padding="md">
                <Text variant="small" className="font-medium">
                  {entry.name}
                  {entry.company ? ` · ${entry.company}` : ""}
                </Text>
                <Text variant="small" className="mt-2 text-muted-foreground">
                  {entry.message}
                </Text>
              </Card>
            ))}
            {entries?.length === 0 && (
              <Text variant="small" className="text-muted-foreground">
                No public notes yet. Be the first.
              </Text>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
