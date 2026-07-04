import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "./lib/adminAuth";

export const submit = mutation({
  args: {
    name: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("guestbookEntries", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("guestbookEntries")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listPending = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db
      .query("guestbookEntries")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db.query("guestbookEntries").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id("guestbookEntries") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.delete(id);
    return id;
  },
});

export const moderate = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("guestbookEntries"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, { sessionToken, id, status }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, { status });
    return id;
  },
});
