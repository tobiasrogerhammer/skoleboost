import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

// Create event (teacher only)
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    emoji: v.string(),
    capacity: v.number(),
    colorTheme: v.string(),
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

    if (!user || user.role !== "teacher") {
      throw new Error("Not authorized - only teachers can create events");
    }

    const eventId = await ctx.db.insert("socialEvents", {
      title: args.title,
      description: args.description,
      date: args.date,
      time: args.time,
      emoji: args.emoji,
      registered: 0,
      capacity: args.capacity,
      colorTheme: args.colorTheme,
    });

    return eventId;
  },
});

// Update event
export const updateEvent = mutation({
  args: {
    eventId: v.id("socialEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    emoji: v.optional(v.string()),
    capacity: v.optional(v.number()),
    colorTheme: v.optional(v.string()),
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

    if (!user || user.role !== "teacher") {
      throw new Error("Not authorized");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.date !== undefined) updates.date = args.date;
    if (args.time !== undefined) updates.time = args.time;
    if (args.emoji !== undefined) updates.emoji = args.emoji;
    if (args.capacity !== undefined) updates.capacity = args.capacity;
    if (args.colorTheme !== undefined) updates.colorTheme = args.colorTheme;

    await ctx.db.patch(args.eventId, updates);
  },
});

// Delete event
export const deleteEvent = mutation({
  args: {
    eventId: v.id("socialEvents"),
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

    if (!user || user.role !== "teacher") {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.eventId);
  },
});

