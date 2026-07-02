"use client"

import { m, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <m.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </m.div>
  )
}
