import { query } from "./_generated/server";
import { getActiveResume, getPortraitUrl } from "./lib/media";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("siteProfile").first();
    if (!profile) {
      return null;
    }

    const resume = await getActiveResume(ctx);
    const portraitUrl = await getPortraitUrl(ctx, profile.portraitStorageId);

    return {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      footerBio: profile.footerBio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      resumeUrl: resume?.url ?? profile.resumeUrl ?? "/resume.pdf",
      portraitUrl: portraitUrl ?? "/portrait.jpg",
      links: {
        github: profile.github,
        linkedin: profile.linkedin,
      },
      stats: {
        experience: profile.statsExperience,
        companies: profile.statsCompanies,
        technologies: profile.statsTechnologies,
      },
      education: {
        school: profile.educationSchool,
        degree: profile.educationDegree,
        location: profile.educationLocation,
        period: profile.educationPeriod,
      },
      aboutHeadlineMuted: profile.aboutHeadlineMuted ?? "Engineer with a",
      aboutHeadlineBold: profile.aboutHeadlineBold ?? "designer's eye.",
      funFacts: profile.funFacts ?? [
        { emoji: "⚡", label: "Ships fast, breaks nothing" },
        { emoji: "🎨", label: "Design-minded engineer" },
        { emoji: "🤖", label: "Building AI-native UIs" },
        { emoji: "☕", label: "Powered by chai" },
      ],
    };
  },
});
