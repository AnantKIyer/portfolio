"use client"

import * as React from "react"
import { AnimatePresence, m } from "framer-motion"
import { cn } from "@/lib/utils"

export function RotatingWord({
  words,
  className,
  interval = 2200,
}: {
  words: string[]
  className?: string
  interval?: number
}) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={cn("relative inline-grid", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={words[index]}
          initial={{ y: "0.7em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.7em", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
