import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function createSessionExpiry(now = Date.now()): number {
  return now + SESSION_DURATION_MS;
}

export async function assertAdminSession(
  ctx: MutationCtx | QueryCtx,
  sessionToken: string,
): Promise<Doc<"adminUsers">> {
  const user = await getAdminUserForSession(ctx, sessionToken);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getAdminUserForSession(
  ctx: MutationCtx | QueryCtx,
  sessionToken: string,
): Promise<Doc<"adminUsers"> | null> {
  if (!sessionToken) {
    return null;
  }

  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", sessionToken))
    .unique();

  if (!session || session.expiresAt <= Date.now()) {
    return null;
  }

  const user = await ctx.db.get(session.userId);
  if (!user || !user.active) {
    return null;
  }

  return user;
}

export function createSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
