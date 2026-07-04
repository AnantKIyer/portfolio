"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { getVisitorId } from "@/lib/convex/visitor-id";
import { cn } from "@/lib/utils";

export function ProjectReactions({
  projectSlug,
  className,
}: {
  projectSlug: string;
  className?: string;
}) {
  const [visitorId, setVisitorId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  const counts = useQuery(api.reactions.getCounts);
  const userReactions = useQuery(
    api.reactions.getUserReactions,
    visitorId ? { visitorId } : "skip",
  );
  const toggle = useMutation(api.reactions.toggle);

  const count = counts?.[projectSlug] ?? 0;
  const reacted = userReactions?.includes(projectSlug) ?? false;

  async function onToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!visitorId) return;
    await toggle({ projectSlug, visitorId });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!visitorId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        reacted
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
        className,
      )}
      aria-pressed={reacted}
      aria-label={`React to project (${count})`}
    >
      <span>✦</span>
      <span>{count}</span>
    </button>
  );
}
