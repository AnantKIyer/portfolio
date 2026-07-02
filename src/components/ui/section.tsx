import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  spacing?: "none" | "sm" | "md" | "lg" | "xl"
  id?: string
}

const spacingClasses = {
  none: "",
  sm: "py-12",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
}

export function Section({
  children,
  className,
  spacing = "md",
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  )
}
