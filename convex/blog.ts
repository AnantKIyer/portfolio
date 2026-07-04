import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("blogPosts").collect();
    return posts
      .filter((p) => p.published)
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags,
        coverImageUrl: p.coverImageUrl,
        publishedAt: p.publishedAt,
      }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!post || !post.published) {
      return null;
    }
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    };
  },
});

export const listSlugs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("blogPosts").collect();
    return posts.filter((p) => p.published).map((p) => p.slug);
  },
});
