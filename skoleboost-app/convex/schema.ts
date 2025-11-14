import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    grade: v.string(),
    studentId: v.string(),
    joinDate: v.string(),
    currentPoints: v.number(),
    totalEarned: v.number(),
    attendanceRate: v.number(),
    rank: v.number(),
    totalStudents: v.number(),
  }),

  coupons: defineTable({
    title: v.string(),
    description: v.string(),
    cost: v.number(),
    available: v.number(),
    category: v.string(),
    allergies: v.array(v.string()),
    emoji: v.string(),
  }),

  socialEvents: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    emoji: v.string(),
    registered: v.number(),
    capacity: v.number(),
    colorTheme: v.string(),
  }),

  scheduleItems: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    teacher: v.optional(v.string()),
    time: v.string(),
    room: v.string(),
    points: v.number(),
    attended: v.boolean(),
    day: v.string(),
    type: v.union(v.literal("class"), v.literal("event"), v.literal("trip")),
    description: v.optional(v.string()),
    emoji: v.optional(v.string()),
    colorTheme: v.optional(v.string()),
    capacity: v.optional(v.number()),
    registered: v.optional(v.number()),
    isRegistered: v.optional(v.boolean()),
  }).index("by_user", ["userId"]).index("by_user_day", ["userId", "day"]),

  couponRedemptions: defineTable({
    userId: v.id("users"),
    couponId: v.id("coupons"),
    redeemedAt: v.number(),
  }).index("by_user", ["userId"]),

  eventRegistrations: defineTable({
    userId: v.id("users"),
    eventId: v.id("scheduleItems"),
    registeredAt: v.number(),
  }).index("by_user", ["userId"]).index("by_event", ["eventId"]),

  achievements: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    earned: v.boolean(),
    progress: v.optional(v.number()),
    earnedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});

