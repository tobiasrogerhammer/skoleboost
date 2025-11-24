import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

// Get all announcements
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_created")
      .order("desc")
      .take(50);
  },
});

// Create announcement
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
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
      throw new Error("Not authorized - only teachers can create announcements");
    }

    const announcementId = await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      createdBy: user._id,
      createdAt: Date.now(),
      imageUrl: args.imageUrl,
    });

    return announcementId;
  },
});

// Update announcement
export const update = mutation({
  args: {
    announcementId: v.id("announcements"),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
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

    const announcement = await ctx.db.get(args.announcementId);
    if (!announcement || announcement.createdBy !== user._id) {
      throw new Error("Not authorized to update this announcement");
    }

    await ctx.db.patch(args.announcementId, {
      title: args.title,
      content: args.content,
      imageUrl: args.imageUrl,
    });

    return args.announcementId;
  },
});

// Delete announcement
export const deleteAnnouncement = mutation({
  args: {
    announcementId: v.id("announcements"),
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

    const announcement = await ctx.db.get(args.announcementId);
    if (!announcement || announcement.createdBy !== user._id) {
      throw new Error("Not authorized to delete this announcement");
    }

    await ctx.db.delete(args.announcementId);
  },
});

