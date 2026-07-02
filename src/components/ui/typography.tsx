import * as React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

const variants = {
  display:
    "font-display font-bold tracking-tight leading-[0.92] text-[clamp(3rem,10vw,9rem)]",
  h1: "font-display font-bold tracking-tight leading-[1.02] text-[clamp(2.25rem,5vw,4rem)]",
  h2: "font-display font-bold tracking-tight leading-[1.05] text-[clamp(1.75rem,3.5vw,2.75rem)]",
  h3: "font-display font-semibold tracking-tight text-[clamp(1.375rem,2.2vw,1.875rem)]",
  h4: "font-display font-semibold tracking-tight text-xl md:text-2xl",
  h5: "font-display font-semibold text-lg md:text-xl",
  h6: "font-semibold text-base md:text-lg",
  body: "text-[15px] md:text-base leading-relaxed",
  small: "text-xs md:text-sm leading-relaxed",
  caption:
    "font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
  label: "text-xs font-medium text-muted-foreground",
}

export function Heading({
  children,
  className,
  as: Component = "h1",
  variant = "h1",
}: TypographyProps & { variant?: keyof typeof variants }) {
  return (
    <Component className={cn(variants[variant], className)}>{children}</Component>
  )
}

export function Text({
  children,
  className,
  as: Component = "p",
  variant = "body",
}: TypographyProps & { variant?: keyof typeof variants }) {
  return (
    <Component className={cn(variants[variant], className)}>{children}</Component>
  )
}

export function Caption({
  children,
  className,
}: Omit<TypographyProps, "as">) {
  return <span className={cn(variants.caption, className)}>{children}</span>
}
