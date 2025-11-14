import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socialEvents").collect();
  },
});

export const register = mutation({
  args: {
    eventId: v.id("scheduleItems"),
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

    const event = await ctx.db.get(args.eventId);
    if (!event || event.type !== "event") {
      throw new Error("Event not found");
    }

    const existingRegistration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    if (existingRegistration) {
      await ctx.db.delete(existingRegistration._id);
      await ctx.db.patch(args.eventId, {
        registered: (event.registered || 0) - 1,
        isRegistered: false,
      });
      return { registered: false };
    }

    if ((event.registered || 0) >= (event.capacity || 0)) {
      throw new Error("Event is full");
    }

    await ctx.db.insert("eventRegistrations", {
      userId: user._id,
      eventId: args.eventId,
      registeredAt: Date.now(),
    });

    await ctx.db.patch(args.eventId, {
      registered: (event.registered || 0) + 1,
      isRegistered: true,
    });

    return { registered: true };
  },
});

