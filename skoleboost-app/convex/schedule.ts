import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getByUser = query({
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
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const markAttended = mutation({
  args: {
    scheduleItemId: v.id("scheduleItems"),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const item = await ctx.db.get(args.scheduleItemId);
    if (!item || item.userId !== user._id) {
      throw new Error("Schedule item not found");
    }

    await ctx.db.patch(args.scheduleItemId, {
      attended: true,
    });

    if (item.type === "class" && !item.attended) {
      await ctx.db.patch(user._id, {
        currentPoints: user.currentPoints + item.points,
        totalEarned: user.totalEarned + item.points,
      });
    }
  },
});

