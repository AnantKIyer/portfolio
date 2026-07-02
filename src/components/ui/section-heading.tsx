import * as React from "react"
import { Heading, Text, Caption } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  index?: string
  eyebrow: string
  title: React.ReactNode
  description?: string
  className?: string
  align?: "left" | "center"
  action?: React.ReactNode
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  align = "left",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl space-y-4",
          align === "center" && "mx-auto text-center",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          {index && (
            <span className="font-mono text-sm font-medium text-accent">
              {index}
            </span>
          )}
          <span className="h-px w-8 bg-ink/30" />
          <Caption>{eyebrow}</Caption>
        </div>
        <Heading variant="h2">{title}</Heading>
        {description && (
          <Text variant="body" className="text-muted-foreground">
            {description}
          </Text>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
