import { query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";

export const getStats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);

    const [
      messages,
      guestbookPending,
      guestbookApproved,
      projects,
      blogPosts,
      analytics,
    ] = await Promise.all([
      ctx.db.query("contactMessages").collect(),
      ctx.db
        .query("guestbookEntries")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .collect(),
      ctx.db
        .query("guestbookEntries")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("blogPosts").collect(),
      ctx.db
        .query("analyticsEvents")
        .withIndex("by_type", (q) => q.eq("type", "resume_download"))
        .collect(),
    ]);

    const unreadMessages = messages.filter((m) => m.status === "new").length;
    const publishedProjects = projects.filter((p) => p.published).length;
    const publishedPosts = blogPosts.filter((p) => p.published).length;
    const draftPosts = blogPosts.filter((p) => !p.published).length;

    return {
      unreadMessages,
      totalMessages: messages.length,
      pendingGuestbook: guestbookPending.length,
      approvedGuestbook: guestbookApproved.length,
      totalProjects: projects.length,
      publishedProjects,
      totalPosts: blogPosts.length,
      publishedPosts,
      draftPosts,
      resumeDownloads: analytics.length,
    };
  },
});
