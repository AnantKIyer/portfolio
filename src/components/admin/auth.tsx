"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";

export const SESSION_KEY = "portfolio_admin_session";

export function getAdminSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setAdminSession(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function useAdminToken() {
  const [token, setToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    setToken(getAdminSession());
  }, []);
  return token ?? "";
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setToken(getAdminSession());
    setReady(true);
  }, []);

  const session = useQuery(
    api.adminAuth.validateSession,
    token ? { sessionToken: token } : "skip",
  );

  React.useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    if (session === null) {
      clearAdminSession();
      router.replace("/admin/login");
    }
  }, [ready, token, session, router]);

  if (!ready || !token || session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!session) return null;
  return <>{children}</>;
}

export function AdminLoginForm() {
  const router = useRouter();
  const login = useMutation(api.adminAuth.login);
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login({ username, password });
      setAdminSession(result.token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4">
      <Card variant="elevated" padding="lg" className="w-full max-w-md space-y-5">
        <div>
          <p className="font-display text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Abhivyakti
          </p>
          <Heading variant="h3" className="mt-2">
            Website Dashboard
          </Heading>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="admin-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="admin-input"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </Card>
    </div>
  );
}
