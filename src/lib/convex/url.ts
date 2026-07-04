export function normalizeConvexUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function getConvexUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!raw?.trim()) {
    return undefined;
  }
  return normalizeConvexUrl(raw);
}

export function requireConvexUrl(): string {
  const url = getConvexUrl();
  if (!url) {
    throw new Error("Environment variable NEXT_PUBLIC_CONVEX_URL is not set.");
  }
  return url;
}

export function isConvexConfigured(): boolean {
  return Boolean(getConvexUrl());
}
