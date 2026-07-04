import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { assertAdminSession } from "../lib/adminAuth";
import { funFact } from "../validators";

export const get = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await assertAdminSession(ctx, sessionToken);
    return await ctx.db.query("siteProfile").first();
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    footerBio: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.string(),
    resumeUrl: v.optional(v.string()),
    github: v.string(),
    linkedin: v.string(),
    statsExperience: v.string(),
    statsCompanies: v.string(),
    statsTechnologies: v.string(),
    educationSchool: v.string(),
    educationDegree: v.string(),
    educationLocation: v.string(),
    educationPeriod: v.string(),
    aboutHeadlineMuted: v.optional(v.string()),
    aboutHeadlineBold: v.optional(v.string()),
    funFacts: v.optional(v.array(funFact)),
  },
  handler: async (ctx, { sessionToken, ...data }) => {
    await assertAdminSession(ctx, sessionToken);
    const profile = await ctx.db.query("siteProfile").first();
    if (!profile) {
      throw new Error("Profile not found. Run seed first.");
    }
    await ctx.db.patch(profile._id, data);
    return profile._id;
  },
});
