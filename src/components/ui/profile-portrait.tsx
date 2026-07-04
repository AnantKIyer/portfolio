"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";

interface ProfilePortraitProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showRing?: boolean;
}

const sizes = {
  sm: "h-28 w-28",
  md: "h-36 w-36 md:h-40 md:w-40",
  lg: "h-44 w-44 md:h-52 md:w-52",
};

export function ProfilePortrait({
  size = "md",
  className,
  showRing = true,
}: ProfilePortraitProps) {
  const liveProfile = useQuery(api.siteProfile.get);
  const src = liveProfile?.portraitUrl ?? "/portrait.jpg";
  const alt = liveProfile?.name ?? profile.name;
  const isExternal = src.startsWith("http");

  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center",
        sizes[size],
        className,
      )}
    >
      <div className="absolute inset-0 scale-110 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-accent/30 via-violet/20 to-secondary/40" />

      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-full",
          showRing && "ring-2 ring-border/80 ring-offset-2 ring-offset-card",
        )}
      >
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-[center_18%] scale-[1.08]"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 160px, 208px"
            className="object-cover object-[center_18%] scale-[1.08]"
          />
        )}
      </div>
    </div>
  );
}
