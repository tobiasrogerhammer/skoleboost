import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

// Create coupon (teacher only)
export const createCoupon = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    cost: v.number(),
    available: v.number(),
    category: v.string(),
    allergies: v.array(v.string()),
    emoji: v.string(),
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
      throw new Error("Not authorized - only teachers can create coupons");
    }

    const couponId = await ctx.db.insert("coupons", {
      title: args.title,
      description: args.description,
      cost: args.cost,
      available: args.available,
      category: args.category,
      allergies: args.allergies,
      emoji: args.emoji,
    });

    return couponId;
  },
});

// Update coupon
export const updateCoupon = mutation({
  args: {
    couponId: v.id("coupons"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.optional(v.number()),
    available: v.optional(v.number()),
    category: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    emoji: v.optional(v.string()),
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

    const coupon = await ctx.db.get(args.couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.cost !== undefined) updates.cost = args.cost;
    if (args.available !== undefined) updates.available = args.available;
    if (args.category !== undefined) updates.category = args.category;
    if (args.allergies !== undefined) updates.allergies = args.allergies;
    if (args.emoji !== undefined) updates.emoji = args.emoji;

    await ctx.db.patch(args.couponId, updates);
  },
});

// Delete coupon
export const deleteCoupon = mutation({
  args: {
    couponId: v.id("coupons"),
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

    await ctx.db.delete(args.couponId);
  },
});

