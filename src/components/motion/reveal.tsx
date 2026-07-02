"use client"

import { m, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.55,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const offsets = {
    up: { y: 28, x: 0 },
    down: { y: -28, x: 0 },
    left: { x: 28, y: 0 },
    right: { x: -28, y: 0 },
    none: { x: 0, y: 0 },
  }

  const offset = offsets[direction]

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
