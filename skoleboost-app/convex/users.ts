import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getCurrentUser = query({
  args: { clerkUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Try to get user ID from args first (fallback from frontend)
    let clerkUserId = args.clerkUserId;
    
    // If not provided, try to get from auth context
    if (!clerkUserId) {
      clerkUserId = await getClerkUserId(ctx);
    }
    
    if (!clerkUserId) {
      return null;
    }

    // Find user by Clerk user ID (stored in studentId)
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    return user;
  },
});

export const createUser = mutation({
      args: {
        name: v.string(),
        email: v.string(),
        grade: v.string(),
        role: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
        clerkUserId: v.optional(v.string()),
      },
      handler: async (ctx, args) => {
        // Try to get user ID from args first (fallback from frontend)
        let clerkUserId = args.clerkUserId;
        
        // If not provided, try to get from auth context
        if (!clerkUserId) {
          clerkUserId = await getClerkUserId(ctx);
        }
        
        if (!clerkUserId) {
          throw new Error("Not authenticated");
        }

        const existingUser = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("studentId"), clerkUserId))
          .first();

        const role = args.role || "student";

        if (existingUser) {
          // Update existing user
          const updates: any = {
            name: args.name,
            email: args.email,
            grade: args.grade,
          };
          // Only update role if it's not already set or if explicitly provided
          if (!existingUser.role || args.role) {
            updates.role = role;
          }
          await ctx.db.patch(existingUser._id, updates);
          return existingUser._id;
        }

        const totalStudents = await ctx.db.query("users").filter((q) => {
          const role = q.field("role");
          return q.or(
            q.eq(role, "student"),
            q.eq(role, undefined)
          );
        }).collect();
        const rank = totalStudents.length + 1;

        const userId = await ctx.db.insert("users", {
          name: args.name,
          email: args.email,
          grade: args.grade,
          studentId: clerkUserId, // Store Clerk user ID in studentId field for authentication (set automatically)
          joinDate: new Date().toLocaleDateString("nb-NO", { month: "long", year: "numeric" }),
          currentPoints: role === "student" ? 150 : 0,
          totalEarned: 0,
          attendanceRate: 0,
          rank: role === "student" ? rank : 0,
          totalStudents: rank,
          role,
        });

        return userId;
      },
    });

// Update user role
export const updateUserRole = mutation({
  args: {
    role: v.union(v.literal("student"), v.literal("teacher")),
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

    await ctx.db.patch(user._id, {
      role: args.role,
    });

    return { success: true, role: args.role };
  },
});

export const updatePoints = mutation({
  args: {
    points: v.number(),
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

    await ctx.db.patch(user._id, {
      currentPoints: user.currentPoints + args.points,
      totalEarned: user.totalEarned + args.points,
    });
  },
});

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

export const redeemCoupon = mutation({
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

    if (!user) {
      throw new Error("User not found");
    }

    const coupon = await ctx.db.get(args.couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    if (user.currentPoints < coupon.cost) {
      throw new Error("Not enough points");
    }

    if (coupon.available <= 0) {
      throw new Error("Coupon not available");
    }

    await ctx.db.patch(user._id, {
      currentPoints: user.currentPoints - coupon.cost,
    });

    await ctx.db.patch(args.couponId, {
      available: coupon.available - 1,
    });

    await ctx.db.insert("couponRedemptions", {
      userId: user._id,
      couponId: args.couponId,
      redeemedAt: Date.now(),
    });
  },
});
