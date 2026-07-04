"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Badge, Dot } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LiveAvailabilityBadge({
  className,
  fallbackAvailable = true,
}: {
  className?: string;
  fallbackAvailable?: boolean;
}) {
  const status = useQuery(api.siteStatus.get);
  const available = status?.availableForWork ?? fallbackAvailable;

  if (!available) {
    return (
      <Badge tone="outline" className={cn("py-1.5", className)}>
        Not available right now
      </Badge>
    );
  }

  return (
    <Badge tone="outline" className={cn("py-1.5", className)}>
      <Dot className="text-lime" />
      Available for new work
    </Badge>
  );
}

export function LiveBuildingNote({
  fallback = "Building enterprise media transfer systems at Brahma AI",
  className,
}: {
  fallback?: string;
  className?: string;
}) {
  const status = useQuery(api.siteStatus.get);
  const note = status?.buildingNote || fallback;

  if (!note) return null;

  return <span className={className}>{note}</span>;
}
