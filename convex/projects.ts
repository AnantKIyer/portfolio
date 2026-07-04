import { query } from "./_generated/server";
import { v } from "convex/values";

function mapProject(project: {
  _id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  status: "Completed" | "In Progress" | "On Hold";
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile";
  year: number;
  duration: string;
  teamSize: number;
  role: string;
  challenges: string[];
  solutions: string[];
  keyFeatures: string[];
  results: string[];
  lessonsLearned: string[];
  githubUrl?: string;
  liveUrl?: string;
  order: number;
  published: boolean;
}) {
  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    technologies: project.technologies,
    status: project.status,
    category: project.category,
    year: project.year,
    duration: project.duration,
    teamSize: project.teamSize,
    role: project.role,
    challenges: project.challenges,
    solutions: project.solutions,
    keyFeatures: project.keyFeatures,
    results: project.results,
    lessonsLearned: project.lessonsLearned,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    order: project.order,
    published: project.published,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects
      .filter((p) => p.published)
      .sort((a, b) => a.order - b.order)
      .map(mapProject);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!project || !project.published) {
      return null;
    }
    return mapProject(project);
  },
});

export const listSlugs = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.filter((p) => p.published).map((p) => p.slug);
  },
});
