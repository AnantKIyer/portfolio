import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "./lib/adminAuth";

const RATE_LIMIT_MS = 60 * 60 * 1000;
const RATE_LIMIT_COUNT = 3;

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const since = Date.now() - RATE_LIMIT_MS;
    const recent = await ctx.db
      .query("contactMessages")
      .withIndex("by_createdAt")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email),
          q.gte(q.field("createdAt"), since),
        ),
      )
      .collect();

    if (recent.length >= RATE_LIMIT_COUNT) {
      throw new Error("Too many messages. Please try again later.");
    }

    return await ctx.db.insert("contactMessages", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db.query("contactMessages").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateStatus = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("contactMessages"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  },
  handler: async (ctx, { sessionToken, id, status }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, { status });
    return id;
  },
});

export const unreadCount = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db
      .query("contactMessages")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return rows.length;
  },
});
