import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: "slow" | "normal"
  reverse?: boolean
  pauseOnHover?: boolean
}

export function Marquee({
  children,
  className,
  speed = "normal",
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  const anim = reverse
    ? "marquee-reverse"
    : speed === "slow"
      ? "marquee-slow"
      : "marquee"

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        pauseOnHover && "pause-on-hover",
        className,
      )}
    >
      <div className={cn("flex shrink-0 items-center", anim)}>
        {children}
        {children}
      </div>
    </div>
  )
}
