import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const reactions = await ctx.db.query("projectReactions").collect();
    const counts: Record<string, number> = {};
    for (const reaction of reactions) {
      counts[reaction.projectSlug] = (counts[reaction.projectSlug] ?? 0) + 1;
    }
    return counts;
  },
});

export const getUserReactions = query({
  args: { visitorId: v.string() },
  handler: async (ctx, { visitorId }) => {
    const reactions = await ctx.db.query("projectReactions").collect();
    return reactions
      .filter((r) => r.visitorId === visitorId)
      .map((r) => r.projectSlug);
  },
});

export const toggle = mutation({
  args: {
    projectSlug: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, { projectSlug, visitorId }) => {
    const existing = await ctx.db
      .query("projectReactions")
      .withIndex("by_projectSlug_visitorId", (q) =>
        q.eq("projectSlug", projectSlug).eq("visitorId", visitorId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { reacted: false };
    }

    await ctx.db.insert("projectReactions", {
      projectSlug,
      visitorId,
      createdAt: Date.now(),
    });
    return { reacted: true };
  },
});
