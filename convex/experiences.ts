import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("experiences").collect();
    return rows
      .filter((row) => row.published)
      .sort((a, b) => a.order - b.order)
      .map((row) => ({
        period: row.period,
        role: row.role,
        company: row.company,
        location: row.location,
        description: row.description,
        achievements: row.achievements,
        isCurrent: row.isCurrent,
      }));
  },
});
