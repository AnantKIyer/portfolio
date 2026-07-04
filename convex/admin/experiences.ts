import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";

const experienceFields = {
  period: v.string(),
  role: v.string(),
  company: v.string(),
  location: v.string(),
  description: v.string(),
  achievements: v.array(v.string()),
  isCurrent: v.boolean(),
  order: v.number(),
  published: v.boolean(),
};

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const rows = await ctx.db.query("experiences").collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: { sessionToken: v.string(), ...experienceFields },
  handler: async (ctx, { sessionToken, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.db.insert("experiences", data);
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("experiences"),
    ...experienceFields,
  },
  handler: async (ctx, { sessionToken, id, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id("experiences") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.delete(id);
    return id;
  },
});

export const togglePublished = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("experiences"),
    published: v.boolean(),
  },
  handler: async (ctx, { sessionToken, id, published }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.patch(id, { published });
    return id;
  },
});
