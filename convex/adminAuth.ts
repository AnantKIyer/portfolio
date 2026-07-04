import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  assertAdminSession,
  createSessionExpiry,
  createSessionToken,
  getAdminUserForSession,
} from "./lib/adminAuth";
import { hashPassword, verifyPassword } from "./lib/password";

export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { username, password }) => {
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user || !user.active) {
      throw new Error("Invalid username or password");
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid username or password");
    }

    const token = createSessionToken();
    await ctx.db.insert("adminSessions", {
      token,
      userId: user._id,
      expiresAt: createSessionExpiry(),
    });

    return {
      token,
      username: user.username,
      displayName: user.displayName ?? user.username,
    };
  },
});

export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const validateSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const user = await getAdminUserForSession(ctx, sessionToken);
    if (!user) {
      return null;
    }
    return {
      userId: user._id,
      username: user.username,
      displayName: user.displayName ?? user.username,
      role: user.role,
    };
  },
});

export const changePassword = mutation({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { sessionToken, currentPassword, newPassword }) => {
    const user = await assertAdminSession(ctx, sessionToken);
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }
    await ctx.db.patch(user._id, {
      passwordHash: await hashPassword(newPassword),
    });
  },
});
