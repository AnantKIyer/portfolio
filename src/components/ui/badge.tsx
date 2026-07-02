import * as React from "react"
import { cn } from "@/lib/utils"

const tones = {
  default: "bg-muted text-foreground",
  ink: "bg-ink text-background",
  accent: "bg-accent/12 text-accent",
  lime: "bg-lime/15 text-lime",
  sky: "bg-sky/15 text-sky",
  violet: "bg-violet/15 text-violet",
  coral: "bg-coral/15 text-coral",
  amber: "bg-amber/15 text-amber",
  outline: "border border-border bg-card/60 text-foreground",
}

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Dot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
  )
}
