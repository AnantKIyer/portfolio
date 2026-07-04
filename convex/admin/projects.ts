import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";
import { projectFields } from "../validators";

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const projects = await ctx.db.query("projects").collect();
    return projects.sort((a, b) => a.order - b.order);
  },
});

export const getById = query({
  args: { sessionToken: v.string(), id: v.id("projects") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    ...projectFields,
  },
  handler: async (ctx, { sessionToken, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .unique();
    if (existing) {
      throw new Error("A project with this slug already exists");
    }
    return await ctx.db.insert("projects", data);
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("projects"),
    ...projectFields,
  },
  handler: async (ctx, { sessionToken, id, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .unique();
    if (existing && existing._id !== id) {
      throw new Error("A project with this slug already exists");
    }
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id("projects") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.delete(id);
    return id;
  },
});

export const togglePublished = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("projects"),
    published: v.boolean(),
  },
  handler: async (ctx, { sessionToken, id, published }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, { published });
    return id;
  },
});
