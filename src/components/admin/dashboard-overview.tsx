"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight, PenLine, Plus } from "lucide-react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import { PageHeader, Panel, StatCard } from "./ui";

export function DashboardOverview() {
  const token = useAdminToken();
  const stats = useQuery(api.admin.dashboard.getStats, token ? { sessionToken: token } : "skip");
  const status = useQuery(api.siteStatus.get);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Quick snapshot of your portfolio content and inbound activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unread messages" value={stats?.unreadMessages ?? "—"} tone="accent" />
        <StatCard label="Pending reviews" value={stats?.pendingGuestbook ?? "—"} tone="coral" />
        <StatCard label="Published projects" value={stats?.publishedProjects ?? "—"} tone="lime" />
        <StatCard label="Blog posts live" value={stats?.publishedPosts ?? "—"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Site status" className="lg:col-span-1">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium">
                {status?.availableForWork ? "Open to work" : "Not available"}
              </span>
            </div>
            <div className="rounded-xl bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">Building note</p>
              <p className="mt-1">{status?.buildingNote || "—"}</p>
            </div>
            <Button variant="soft" size="sm" asChild className="w-full">
              <Link href="/admin/settings">
                Edit settings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Panel>

        <Panel title="Content summary" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Projects", value: stats?.totalProjects },
              { label: "Draft posts", value: stats?.draftPosts },
              { label: "Reviews", value: stats?.approvedGuestbook },
              { label: "Résumé DLs", value: stats?.resumeDownloads },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-display text-xl font-semibold">{item.value ?? "—"}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Quick actions" className="mt-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" asChild>
            <Link href="/admin/blog">
              <PenLine className="h-4 w-4" />
              Write a blog post
            </Link>
          </Button>
          <Button variant="soft" asChild>
            <Link href="/admin/projects">
              <Plus className="h-4 w-4" />
              Add project
            </Link>
          </Button>
          <Button variant="soft" asChild>
            <Link href="/admin/messages">View messages</Link>
          </Button>
          <Button variant="soft" asChild>
            <Link href="/admin/reviews">Moderate reviews</Link>
          </Button>
        </div>
      </Panel>
    </>
  );
}
