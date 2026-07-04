import { v } from "convex/values";

export const projectCategory = v.union(
  v.literal("Full Stack"),
  v.literal("Frontend"),
  v.literal("Backend"),
  v.literal("Mobile"),
);

export const projectStatus = v.union(
  v.literal("Completed"),
  v.literal("In Progress"),
  v.literal("On Hold"),
);

export const projectFields = {
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
};

export const funFact = v.object({
  emoji: v.string(),
  label: v.string(),
});
