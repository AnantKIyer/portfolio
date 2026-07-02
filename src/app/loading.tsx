import { Container } from "@/components/ui/container"

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Container>
        <div className="flex flex-col items-center gap-4">
          <span className="spin-slow flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-ink text-lg">
            ✦
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Loading
          </span>
        </div>
      </Container>
    </div>
  )
}
