"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowUpRight, CheckCircle2, Download, Mail, MapPin, Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Heading, Text } from "@/components/ui/typography"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, Dot } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.string().email("Need a valid email"),
  subject: z.string().min(5, "A little more detail"),
  message: z.string().min(10, "Say a bit more"),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  "w-full rounded-2xl bg-muted/60 border border-border px-4 py-3.5 text-sm transition-colors focus:outline-none focus:border-accent focus:bg-card placeholder:text-muted-foreground/70"

const directLinks = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  {
    icon: Phone,
    label: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  { icon: MapPin, label: profile.location, href: undefined },
]

export function Contact() {
  const [submitting, setSubmitting] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  async function onSubmit(data: FormValues) {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    console.log(data)
    setSent(true)
    setSubmitting(false)
    form.reset()
    setTimeout(() => setSent(false), 5000)
  }

  const errors = form.formState.errors

  return (
    <Section spacing="lg" className="pt-28 md:pt-36" id="contact">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — the pitch */}
          <div className="flex flex-col">
            <Badge tone="outline" className="w-fit py-1.5">
              <Dot className="text-lime" />
              Available for new work
            </Badge>
            <Heading variant="h1" className="mt-6">
              Let&apos;s make
              <br />
              something{" "}
              <span className="accent-underline text-accent">good</span>.
            </Heading>
            <Text variant="body" className="mt-6 max-w-md text-muted-foreground">
              Have a role, a project, or just a wild idea? My inbox is open and I
              reply within a day.
            </Text>

            <div className="mt-10 space-y-3">
              {directLinks.map((l) => {
                const Inner = (
                  <>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                      <l.icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{l.label}</span>
                    {l.href && (
                      <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </>
                )
                return l.href ? (
                  <a
                    key={l.label}
                    href={l.href}
                    className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-muted/60"
                  >
                    {Inner}
                  </a>
                ) : (
                  <div key={l.label} className="flex items-center gap-4 p-2">
                    {Inner}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <CopyButton value={profile.email} label="Copy email" />
              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/60"
              >
                Résumé
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <Card
                variant="elevated"
                padding="lg"
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <Heading variant="h4" className="mt-5">
                  Message sent!
                </Heading>
                <Text variant="small" className="mt-2 text-muted-foreground">
                  Thanks for reaching out — I&apos;ll be in touch shortly.
                </Text>
              </Card>
            ) : (
              <Card variant="elevated" padding="lg">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        {...form.register("name")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...form.register("email")}
                        type="email"
                        placeholder="Email"
                        className={inputClass}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      {...form.register("subject")}
                      placeholder="What's this about?"
                      className={inputClass}
                    />
                    {errors.subject && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      {...form.register("message")}
                      rows={5}
                      placeholder="Tell me more..."
                      className={cn(inputClass, "resize-none")}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Sending..." : "Send it"}
                    {!submitting && <ArrowUpRight className="h-5 w-5" />}
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
