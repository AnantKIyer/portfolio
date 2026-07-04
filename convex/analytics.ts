import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "./lib/adminAuth";

export const track = mutation({
  args: {
    type: v.union(
      v.literal("resume_download"),
      v.literal("page_view"),
      v.literal("project_click"),
    ),
    path: v.optional(v.string()),
    projectSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analyticsEvents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getResumeDownloadCount = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_type", (q) => q.eq("type", "resume_download"))
      .collect();
    return events.length;
  },
});

export const getSummary = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const events = await ctx.db.query("analyticsEvents").collect();
    const resumeDownloads = events.filter((e) => e.type === "resume_download").length;
    const pageViews = events.filter((e) => e.type === "page_view").length;
    const projectClicks = events.filter((e) => e.type === "project_click").length;
    return { resumeDownloads, pageViews, projectClicks, total: events.length };
  },
});
