import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";
import {
  deactivateResumeFiles,
  getActiveResume,
  getPortraitUrl,
} from "../lib/media";

export const generateUploadUrl = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getMedia = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const profile = await ctx.db.query("siteProfile").first();
    const resume = await getActiveResume(ctx);
    const portraitUrl = profile?.portraitStorageId
      ? await getPortraitUrl(ctx, profile.portraitStorageId)
      : null;

    return {
      portraitUrl,
      portraitStorageId: profile?.portraitStorageId ?? null,
      resumeUrl: resume?.url ?? profile?.resumeUrl ?? null,
      resumeFileName: resume?.fileName ?? null,
      fallbackResumeUrl: profile?.resumeUrl ?? "/resume.pdf",
    };
  },
});

export const uploadPortrait = mutation({
  args: {
    sessionToken: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { sessionToken, storageId }) => {
    await assertAdminSession(ctx, sessionToken);
    const profile = await ctx.db.query("siteProfile").first();
    if (!profile) {
      throw new Error("Profile not found. Run seed first.");
    }

    if (profile.portraitStorageId && profile.portraitStorageId !== storageId) {
      await ctx.storage.delete(profile.portraitStorageId);
    }

    await ctx.db.patch(profile._id, { portraitStorageId: storageId });
    return await ctx.storage.getUrl(storageId);
  },
});

export const uploadResume = mutation({
  args: {
    sessionToken: v.string(),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, { sessionToken, storageId, fileName }) => {
    await assertAdminSession(ctx, sessionToken);
    await deactivateResumeFiles(ctx);

    await ctx.db.insert("resumeFiles", {
      storageId,
      fileName,
      uploadedAt: Date.now(),
      isActive: true,
    });

    return await ctx.storage.getUrl(storageId);
  },
});

export const removePortrait = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const profile = await ctx.db.query("siteProfile").first();
    if (!profile?.portraitStorageId) return null;

    await ctx.storage.delete(profile.portraitStorageId);
    await ctx.db.patch(profile._id, { portraitStorageId: undefined });
    return null;
  },
});

export const removeResume = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const active = await ctx.db
      .query("resumeFiles")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();

    if (active) {
      await ctx.storage.delete(active.storageId);
      await ctx.db.delete(active._id);
    }
    return null;
  },
});
