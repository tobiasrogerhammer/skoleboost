import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getByEvent = query({
  args: {
    eventId: v.union(v.id("scheduleItems"), v.id("socialEvents")),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("eventComments")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();

    // Fetch user details for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          _id: comment._id,
          message: comment.message,
          createdAt: comment.createdAt,
          author: user?.name || "Ukjent",
          userId: comment.userId,
          imageUrl: user?.imageUrl || null,
        };
      })
    );

    return commentsWithUsers;
  },
});

export const add = mutation({
  args: {
    eventId: v.union(v.id("scheduleItems"), v.id("socialEvents")),
    message: v.string(),
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

    if (!args.message.trim()) {
      throw new Error("Comment cannot be empty");
    }

    const commentId = await ctx.db.insert("eventComments", {
      eventId: args.eventId,
      userId: user._id,
      message: args.message.trim(),
      createdAt: Date.now(),
    });

    return commentId;
  },
});

export const remove = mutation({
  args: {
    commentId: v.id("eventComments"),
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

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Only allow users to delete their own comments
    if (comment.userId !== user._id) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return { success: true };
  },
});

