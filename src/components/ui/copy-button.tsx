"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/60",
        className,
      )}
      aria-label={`Copy ${label ?? value}`}
    >
      <span>{copied ? "Copied!" : (label ?? value)}</span>
      {copied ? (
        <Check className="h-4 w-4 text-lime" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      )}
    </button>
  )
}
