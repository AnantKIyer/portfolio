"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useAdminToken } from "./auth";
import { EmptyState, PageHeader, Panel, StatusBadge } from "./ui";

export function MessagesPanel() {
  const token = useAdminToken();
  const messages = useQuery(api.contact.list, token ? { sessionToken: token } : "skip");
  const updateStatus = useMutation(api.contact.updateStatus);
  const [filter, setFilter] = React.useState<"all" | "new" | "read" | "replied">("all");

  const filtered = (messages ?? []).filter((m) => filter === "all" || m.status === filter);

  return (
    <>
      <PageHeader
        title="Messages"
        description="Contact form submissions from your site."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "new", "read", "replied"] as const).map((f) => (
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
          {filtered.map((msg) => (
            <div key={msg._id} className="rounded-xl border border-border/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">
                    {msg.email}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={msg.status} />
                  <select
                    value={msg.status}
                    onChange={(e) =>
                      updateStatus({
                        sessionToken: token,
                        id: msg._id as Id<"contactMessages">,
                        status: e.target.value as "new" | "read" | "replied",
                      })
                    }
                    className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium">{msg.subject}</p>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState title="No messages" description="Inbound contact messages will show up here." />
          )}
        </div>
      </Panel>
    </>
  );
}
