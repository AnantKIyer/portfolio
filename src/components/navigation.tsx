"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Download, Menu, X } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "convex/_generated/api"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { profile } from "@/data/profile"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const liveProfile = useQuery(api.siteProfile.get)
  const resumeUrl = liveProfile?.resumeUrl ?? profile.resumeUrl
  const email = liveProfile?.email ?? profile.email
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-[1500px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300",
          scrolled
            ? "border-border/60 bg-background/80 backdrop-blur-xl soft-sm"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="/" className="group flex items-center gap-2.5 pl-2" aria-label="Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-background transition-transform duration-300 group-hover:rotate-12">
            {profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <span className="font-display text-sm font-bold">
            {profile.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-muted" />
                )}
                <span className="relative">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="soft" size="sm" asChild className="hidden sm:inline-flex">
            <a href={resumeUrl} download>
              <Download className="h-4 w-4" />
              Résumé
            </a>
          </Button>
          <Button variant="accent" size="sm" asChild className="hidden sm:inline-flex">
            <a href={`mailto:${email}`}>Let&apos;s talk</a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1500px] rounded-3xl border border-border/60 bg-background/95 p-3 backdrop-blur-xl soft md:hidden">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60",
                )}
              >
                {item.name}
              </Link>
            )
          })}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="soft" asChild>
              <a href={resumeUrl} download>
                <Download className="h-4 w-4" />
                Résumé
              </a>
            </Button>
            <Button variant="accent" asChild>
              <a href={`mailto:${email}`}>Let&apos;s talk</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
