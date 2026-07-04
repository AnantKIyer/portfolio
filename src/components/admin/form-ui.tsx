"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EditorShell({
  title,
  subtitle,
  published,
  onPublishedChange,
  showPublish = true,
  onSave,
  onDelete,
  saving,
  isEditing,
  createLabel = "Create",
  updateLabel = "Update",
  children,
}: {
  title: string;
  subtitle?: string;
  published?: boolean;
  onPublishedChange?: (v: boolean) => void;
  showPublish?: boolean;
  onSave: () => void;
  onDelete?: () => void;
  saving?: boolean;
  isEditing: boolean;
  createLabel?: string;
  updateLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card soft">
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur-md md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold tracking-tight">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {showPublish && onPublishedChange && (
              <label className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium">
                <EditorSwitch checked={!!published} onChange={onPublishedChange} />
                <span className={published ? "text-lime" : "text-muted-foreground"}>
                  {published ? "Published" : "Draft"}
                </span>
              </label>
            )}
            <Button variant="accent" size="sm" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : isEditing ? updateLabel : createLabel}
            </Button>
            {isEditing && onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function EditorSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        checked ? "bg-lime" : "bg-muted-foreground/25",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

export function FormTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active === tab.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 md:p-5">
        {children}
      </div>
    </section>
  );
}

export function FormGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FormField({
  label,
  hint,
  children,
  className,
  span = 1,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3;
}) {
  return (
    <label
      className={cn(
        "block space-y-2",
        span === 2 && "md:col-span-2",
        span === 3 && "md:col-span-3",
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] leading-relaxed text-muted-foreground/80">{hint}</span>}
    </label>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("admin-input", props.className)} />;
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("admin-textarea", props.className)} />;
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("admin-input admin-select", props.className)} />;
}

export function DocumentTitleInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      placeholder={props.placeholder ?? "Untitled"}
      className={cn(
        "w-full border-0 bg-transparent px-0 font-display text-2xl font-semibold tracking-tight",
        "placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 md:text-3xl",
        props.className,
      )}
    />
  );
}

export function DocumentBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-background/80 p-4 md:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ListField({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const count = value.split("\n").filter((l) => l.trim()).length;
  return (
    <div className="relative">
      <FormTextarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[6rem] resize-y font-mono text-[13px] leading-relaxed"
      />
      <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/60">
        {count} item{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

export function TagPreview({ tags }: { tags: string }) {
  const items = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {items.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function CoverPreview({ url }: { url: string }) {
  if (!url.trim()) {
    return (
      <div className="flex aspect-[2/1] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 text-xs text-muted-foreground">
        Cover preview
      </div>
    );
  }
  return (
    <div
      className="aspect-[2/1] overflow-hidden rounded-xl border border-border/60 bg-muted soft-sm"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export function EmptyEditor({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function AdminSelectCard({
  title,
  subtitle,
  active,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  active?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border border-border/60 p-3 text-left transition-colors",
        active ? "border-accent/40 bg-accent/5" : "hover:bg-muted/30",
      )}
    >
      <p className="truncate font-medium">{title}</p>
      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
      )}
    </button>
  );
}

export function FunFactsEditor({
  facts,
  onChange,
  onAdd,
  onRemove,
}: {
  facts: { emoji: string; label: string }[];
  onChange: (index: number, key: "emoji" | "label", value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {facts.map((fact, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/60 p-2"
        >
          <FormInput
            className="w-14 shrink-0 text-center text-lg"
            value={fact.emoji}
            onChange={(e) => onChange(index, "emoji", e.target.value)}
            placeholder="✨"
          />
          <FormInput
            className="flex-1"
            value={fact.label}
            onChange={(e) => onChange(index, "label", e.target.value)}
            placeholder="Fun fact label"
          />
          <Button variant="ghost" size="sm" type="button" onClick={() => onRemove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="soft" size="sm" type="button" onClick={onAdd}>
        Add fact
      </Button>
    </div>
  );
}

export function FormToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border/50 bg-background/60 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <EditorSwitch checked={checked} onChange={onChange} />
    </label>
  );
}
