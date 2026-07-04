"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "accent" | "lime" | "coral";
}) {
  const tones = {
    default: "from-card to-muted/40",
    accent: "from-accent/8 to-accent/2",
    lime: "from-lime/10 to-lime/5",
    coral: "from-coral/10 to-coral/5",
  };
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-gradient-to-br p-5 soft",
        tones[tone],
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 soft md:p-6",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && <h2 className="font-display text-lg font-semibold">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: "published" | "draft" | "pending" | "approved" | "rejected" | "new" | "read" | "replied";
  className?: string;
}) {
  const styles: Record<string, string> = {
    published: "bg-lime/15 text-lime",
    draft: "bg-muted text-muted-foreground",
    pending: "bg-amber/15 text-amber",
    approved: "bg-lime/15 text-lime",
    rejected: "bg-destructive/10 text-destructive",
    new: "bg-sky/15 text-sky",
    read: "bg-muted text-muted-foreground",
    replied: "bg-lime/15 text-lime",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function SaveToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-sm soft-lg">
      {message}
    </div>
  );
}

export function linesToArray(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(arr: string[]) {
  return arr.join("\n");
}

export function csvToArray(text: string) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToCsv(arr: string[]) {
  return arr.join(", ");
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function AdminListCard({
  title,
  subtitle,
  published,
  active,
  toggling,
  onSelect,
  onTogglePublished,
}: {
  title: string;
  subtitle?: string;
  published: boolean;
  active?: boolean;
  toggling?: boolean;
  onSelect: () => void;
  onTogglePublished: (published: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/60 p-3",
        active && "border-accent/40 bg-accent/5",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate font-medium">{title}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </button>

      <div className="flex shrink-0 items-center gap-2.5">
        <StatusBadge
          status={published ? "published" : "draft"}
          className="w-[4.75rem] justify-center"
        />
        <PublishSwitch
          published={published}
          disabled={toggling}
          onChange={onTogglePublished}
        />
      </div>
    </div>
  );
}

function PublishSwitch({
  published,
  disabled,
  onChange,
}: {
  published: boolean;
  disabled?: boolean;
  onChange: (published: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      aria-label={published ? "Unpublish" : "Publish"}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!published);
      }}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        published ? "bg-lime" : "bg-muted-foreground/25",
        disabled && "cursor-wait opacity-60",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          published && "translate-x-4",
        )}
      />
    </button>
  );
}
