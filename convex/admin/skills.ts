import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db.query("skillCategories").collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    title: v.string(),
    skills: v.array(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { sessionToken, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.db.insert("skillCategories", data);
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("skillCategories"),
    title: v.string(),
    skills: v.array(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { sessionToken, id, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id("skillCategories") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.delete(id);
    return id;
  },
});
