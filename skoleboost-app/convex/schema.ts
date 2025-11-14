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
    role: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
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

  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    imageUrl: v.optional(v.string()),
  }).index("by_created", ["createdAt"]),

  classes: defineTable({
    name: v.string(),
    grade: v.string(),
    teacherId: v.id("users"),
    subject: v.optional(v.string()),
  }).index("by_teacher", ["teacherId"]),

  studentsInClasses: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
  }).index("by_student", ["studentId"]).index("by_class", ["classId"]),

  attendance: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    scheduleItemId: v.optional(v.id("scheduleItems")),
    date: v.string(),
    status: v.union(v.literal("present"), v.literal("late"), v.literal("absent")),
    markedBy: v.id("users"),
    markedAt: v.number(),
  }).index("by_student", ["studentId"]).index("by_class", ["classId"]).index("by_date", ["date"]),
});

