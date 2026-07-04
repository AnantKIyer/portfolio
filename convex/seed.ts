import { mutation } from "./_generated/server";
import seedPayload from "./seedPayload.json";
import { hashPassword } from "./lib/password";

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProjects = await ctx.db.query("projects").first();
    if (existingProjects) {
      return { seeded: false, message: "Database already seeded" };
    }

    const { profile, education, experiences, skillCategories, projects } =
      seedPayload;

    await ctx.db.insert("siteProfile", {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      footerBio: profile.footerBio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      resumeUrl: profile.resumeUrl ?? "/resume.pdf",
      github: profile.links.github,
      linkedin: profile.links.linkedin,
      statsExperience: profile.stats.experience,
      statsCompanies: profile.stats.companies,
      statsTechnologies: profile.stats.technologies,
      educationSchool: education.school,
      educationDegree: education.degree,
      educationLocation: education.location,
      educationPeriod: education.period,
      aboutHeadlineMuted: "Engineer with a",
      aboutHeadlineBold: "designer's eye.",
      funFacts: [
        { emoji: "⚡", label: "Ships fast, breaks nothing" },
        { emoji: "🎨", label: "Design-minded engineer" },
        { emoji: "🤖", label: "Building AI-native UIs" },
        { emoji: "☕", label: "Powered by chai" },
      ],
    });

    for (let index = 0; index < experiences.length; index++) {
      const exp = experiences[index];
      await ctx.db.insert("experiences", {
        period: exp.period,
        role: exp.role,
        company: exp.company,
        location: exp.location,
        description: exp.description,
        achievements: [...exp.achievements],
        isCurrent: index === 0,
        order: index,
        published: true,
      });
    }

    for (let index = 0; index < skillCategories.length; index++) {
      const category = skillCategories[index];
      await ctx.db.insert("skillCategories", {
        title: category.title,
        skills: [...category.skills],
        order: index,
      });
    }

    for (let index = 0; index < projects.length; index++) {
      const project = projects[index];
      await ctx.db.insert("projects", {
        slug: project.id,
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        technologies: project.technologies,
        status: project.status as "Completed" | "In Progress" | "On Hold",
        category: project.category as
          | "Full Stack"
          | "Frontend"
          | "Backend"
          | "Mobile",
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
        order: index,
        published: true,
      });
    }

    await ctx.db.insert("siteStatus", {
      key: "global",
      availableForWork: true,
      buildingNote:
        "Building enterprise media transfer systems at Brahma AI",
      featuredProjectSlug: "ecommerce-platform",
      featuredNote: "",
      updatedAt: Date.now(),
    });

    const existingAdmin = await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .unique();

    if (!existingAdmin) {
      const bootstrapPassword =
        process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "portfolio-admin";
      await ctx.db.insert("adminUsers", {
        username: "admin",
        passwordHash: await hashPassword(bootstrapPassword),
        displayName: "Anant",
        role: "admin",
        active: true,
      });
    }

    return {
      seeded: true,
      projects: projects.length,
      experiences: experiences.length,
      skills: skillCategories.length,
    };
  },
});
