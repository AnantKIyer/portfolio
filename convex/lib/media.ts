import { Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";

export async function getPortraitUrl(
  ctx: QueryCtx,
  portraitStorageId?: Id<"_storage">,
) {
  if (!portraitStorageId) return null;
  return await ctx.storage.getUrl(portraitStorageId);
}

export async function getActiveResume(ctx: QueryCtx) {
  const active = await ctx.db
    .query("resumeFiles")
    .withIndex("by_active", (q) => q.eq("isActive", true))
    .first();
  if (!active) return null;
  const url = await ctx.storage.getUrl(active.storageId);
  return { url, fileName: active.fileName, storageId: active.storageId };
}

export async function deactivateResumeFiles(ctx: MutationCtx) {
  const active = await ctx.db
    .query("resumeFiles")
    .withIndex("by_active", (q) => q.eq("isActive", true))
    .collect();
  for (const file of active) {
    await ctx.db.patch(file._id, { isActive: false });
  }
}
