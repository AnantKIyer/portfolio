"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import { EmptyState, PageHeader, Panel, SaveToast, StatusBadge } from "./ui";

export function ReviewsPanel() {
  const token = useAdminToken();
  const entries = useQuery(api.guestbook.listAll, token ? { sessionToken: token } : "skip");
  const moderate = useMutation(api.guestbook.moderate);
  const remove = useMutation(api.guestbook.remove);
  const [toast, setToast] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = (entries ?? []).filter((e) => filter === "all" || e.status === filter);

  async function setStatus(id: Id<"guestbookEntries">, status: "approved" | "rejected") {
    if (!token) return;
    await moderate({ sessionToken: token, id, status });
    setToast(status === "approved" ? "Review approved" : "Review rejected");
    setTimeout(() => setToast(null), 2000);
  }

  async function onDelete(id: Id<"guestbookEntries">) {
    if (!token || !confirm("Delete this review permanently?")) return;
    await remove({ sessionToken: token, id });
    setToast("Review deleted");
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Moderate guestbook entries shown on your About page."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Panel>
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div key={entry._id} className="rounded-xl border border-border/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {entry.name}
                    {entry.company ? ` · ${entry.company}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={entry.status} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{entry.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.status !== "approved" && (
                  <Button size="sm" variant="accent" onClick={() => setStatus(entry._id, "approved")}>
                    Approve
                  </Button>
                )}
                {entry.status !== "rejected" && (
                  <Button size="sm" variant="soft" onClick={() => setStatus(entry._id, "rejected")}>
                    Reject
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onDelete(entry._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState title="No reviews" description="Guestbook submissions will appear here." />
          )}
        </div>
      </Panel>
      <SaveToast message={toast} />
    </>
  );
}
