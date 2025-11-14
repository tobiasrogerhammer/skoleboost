import { query } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getAchievements = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

