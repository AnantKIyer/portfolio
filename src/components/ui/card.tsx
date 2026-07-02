import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: "soft" | "elevated" | "outline" | "ghost" | "solid"
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

const variantClasses = {
  soft: "bg-card border border-border/70 soft-sm",
  elevated: "bg-card border border-border/40 soft",
  outline: "bg-transparent border border-border",
  ghost: "bg-muted/50",
  solid: "bg-ink text-background",
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
}

export function Card({
  children,
  className,
  variant = "soft",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl transition-all duration-300 ease-out",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:-translate-y-1 hover:soft-lg",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("mt-4", className)}>{children}</div>
}
