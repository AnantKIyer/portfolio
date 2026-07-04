import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    const posts = await ctx.db.query("blogPosts").collect();
    return posts.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: { sessionToken: v.string(), id: v.id("blogPosts") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    title: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, { sessionToken, slug: rawSlug, published, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    const slug = rawSlug?.trim() || slugify(data.title);
    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new Error("A post with this slug already exists");
    }
    const now = Date.now();
    return await ctx.db.insert("blogPosts", {
      ...data,
      slug,
      published,
      publishedAt: published ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("blogPosts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, { sessionToken, id, slug, published, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    const post = await ctx.db.get(id);
    if (!post) {
      throw new Error("Post not found");
    }
    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing && existing._id !== id) {
      throw new Error("A post with this slug already exists");
    }
    const now = Date.now();
    await ctx.db.patch(id, {
      ...data,
      slug,
      published,
      publishedAt:
        published && !post.publishedAt ? now : published ? post.publishedAt : undefined,
      updatedAt: now,
    });
    return id;
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id("blogPosts") },
  handler: async (ctx, { sessionToken, id }) => {
    await assertAdminSession(ctx, sessionToken);
    await ctx.db.delete(id);
    return id;
  },
});

export const togglePublished = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("blogPosts"),
    published: v.boolean(),
  },
  handler: async (ctx, { sessionToken, id, published }) => {
    await assertAdminSession(ctx, sessionToken);
    const post = await ctx.db.get(id);
    if (!post) {
      throw new Error("Post not found");
    }
    const now = Date.now();
    await ctx.db.patch(id, {
      published,
      publishedAt:
        published && !post.publishedAt ? now : published ? post.publishedAt : undefined,
      updatedAt: now,
    });
    return id;
  },
});
