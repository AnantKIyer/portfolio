import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "./lib/adminAuth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const status = await ctx.db
      .query("siteStatus")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (!status) {
      return {
        availableForWork: true,
        buildingNote: "",
        featuredProjectSlug: null as string | null,
        featuredNote: null as string | null,
        updatedAt: Date.now(),
      };
    }

    return {
      availableForWork: status.availableForWork,
      buildingNote: status.buildingNote,
      featuredProjectSlug: status.featuredProjectSlug ?? null,
      featuredNote: status.featuredNote ?? null,
      updatedAt: status.updatedAt,
    };
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    availableForWork: v.boolean(),
    buildingNote: v.string(),
    featuredProjectSlug: v.optional(v.string()),
    featuredNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminSession(ctx, args.sessionToken);

    const existing = await ctx.db
      .query("siteStatus")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    const patch = {
      availableForWork: args.availableForWork,
      buildingNote: args.buildingNote,
      featuredProjectSlug: args.featuredProjectSlug,
      featuredNote: args.featuredNote,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("siteStatus", {
      key: "global",
      ...patch,
    });
  },
});
