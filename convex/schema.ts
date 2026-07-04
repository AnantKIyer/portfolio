import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { funFact, projectCategory, projectStatus } from "./validators";

export default defineSchema({
  siteProfile: defineTable({
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    footerBio: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.string(),
    resumeUrl: v.optional(v.string()),
    portraitStorageId: v.optional(v.id("_storage")),
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
  }),

  experiences: defineTable({
    period: v.string(),
    role: v.string(),
    company: v.string(),
    location: v.string(),
    description: v.string(),
    achievements: v.array(v.string()),
    isCurrent: v.boolean(),
    order: v.number(),
    published: v.boolean(),
  }).index("by_order", ["order"]),

  skillCategories: defineTable({
    title: v.string(),
    skills: v.array(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    longDescription: v.string(),
    technologies: v.array(v.string()),
    status: projectStatus,
    category: projectCategory,
    year: v.number(),
    duration: v.string(),
    teamSize: v.number(),
    role: v.string(),
    challenges: v.array(v.string()),
    solutions: v.array(v.string()),
    keyFeatures: v.array(v.string()),
    results: v.array(v.string()),
    lessonsLearned: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  siteStatus: defineTable({
    key: v.literal("global"),
    availableForWork: v.boolean(),
    buildingNote: v.string(),
    featuredProjectSlug: v.optional(v.string()),
    featuredNote: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  projectReactions: defineTable({
    projectSlug: v.string(),
    visitorId: v.string(),
    createdAt: v.number(),
  })
    .index("by_projectSlug", ["projectSlug"])
    .index("by_projectSlug_visitorId", ["projectSlug", "visitorId"]),

  guestbookEntries: defineTable({
    name: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  analyticsEvents: defineTable({
    type: v.union(
      v.literal("resume_download"),
      v.literal("page_view"),
      v.literal("project_click"),
    ),
    path: v.optional(v.string()),
    projectSlug: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_createdAt", ["createdAt"]),

  adminUsers: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    displayName: v.optional(v.string()),
    role: v.literal("admin"),
    active: v.boolean(),
  }).index("by_username", ["username"]),

  adminSessions: defineTable({
    token: v.string(),
    userId: v.id("adminUsers"),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  resumeFiles: defineTable({
    storageId: v.id("_storage"),
    fileName: v.string(),
    uploadedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_active", ["isActive"]),

  blogPosts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "publishedAt"]),
});
