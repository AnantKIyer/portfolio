"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Menu,
  PenLine,
  Settings,
  Sparkles,
  Star,
  User,
  Wrench,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { cn } from "@/lib/utils";
import { clearAdminSession, getAdminSession } from "./auth";

const SIDEBAR_KEY = "abhivyakti_admin_sidebar_collapsed";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: PenLine },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Sparkles },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useMutation(api.adminAuth.logout);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "true");
    setReady(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }

  async function handleLogout() {
    const token = getAdminSession();
    if (token) {
      await logout({ sessionToken: token });
    }
    clearAdminSession();
    window.location.href = "/admin/login";
  }

  const sidebarCollapsed = ready && collapsed;

  return (
    <div className="fixed inset-0 z-[100] flex bg-[hsl(40_30%_96%)] dark:bg-[hsl(26_9%_8%)]">
      <aside
        className={cn(
          "relative flex shrink-0 flex-col border-r border-border/80 bg-card/95 backdrop-blur-xl transition-[width,transform] duration-200 ease-out lg:translate-x-0",
          sidebarCollapsed ? "w-[4.25rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "fixed inset-y-0 left-0 z-20 lg:relative",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/60",
            sidebarCollapsed ? "justify-center px-2" : "gap-3 px-5",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
            A
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold">Abhivyakti</p>
              <p className="truncate text-[11px] text-muted-foreground">Website Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition-colors",
                  sidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border/60 p-3">
          <Link
            href="/"
            target="_blank"
            title={sidebarCollapsed ? "View site" : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground",
              sidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
            )}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && "View site"}
          </Link>
          <button
            type="button"
            title={sidebarCollapsed ? "Log out" : undefined}
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center rounded-xl text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              sidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && "Log out"}
          </button>
        </div>

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[4.25rem] z-30 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:flex"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-10 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/70 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Manage your portfolio content in one place
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <FileText className="h-3.5 w-3.5" />
            Live sync
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
