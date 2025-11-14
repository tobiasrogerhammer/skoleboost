import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

// Get current teacher
export const getCurrentTeacher = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!user || user.role !== "teacher") {
      return null;
    }

    return user;
  },
});

// Get all classes for a teacher
export const getTeacherClasses = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return [];
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      return [];
    }

    return await ctx.db
      .query("classes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id))
      .collect();
  },
});

// Get students in a class
export const getClassStudents = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return [];
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      return [];
    }

    const classObj = await ctx.db.get(args.classId);
    if (!classObj || classObj.teacherId !== teacher._id) {
      return [];
    }

    const studentIds = await ctx.db
      .query("studentsInClasses")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();

    const students = await Promise.all(
      studentIds.map(async (sc) => {
        const student = await ctx.db.get(sc.studentId);
        return student;
      })
    );

    return students.filter((s) => s !== null && (!s.role || s.role === "student"));
  },
});

// Get today's attendance stats
export const getTodayAttendance = query({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return { present: 0, late: 0, absent: 0, total: 0 };
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      return { present: 0, late: 0, absent: 0, total: 0 };
    }

    const today = new Date().toLocaleDateString("nb-NO");

    let attendanceRecords;
    if (args.classId) {
      attendanceRecords = await ctx.db
        .query("attendance")
        .withIndex("by_class", (q) => q.eq("classId", args.classId))
        .filter((q) => q.eq(q.field("date"), today))
        .collect();
    } else {
      // Get all classes for teacher
      const classes = await ctx.db
        .query("classes")
        .withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id))
        .collect();

      const allRecords = await Promise.all(
        classes.map(async (cls) => {
          return await ctx.db
            .query("attendance")
            .withIndex("by_class", (q) => q.eq("classId", cls._id))
            .filter((q) => q.eq(q.field("date"), today))
            .collect();
        })
      );

      attendanceRecords = allRecords.flat();
    }

    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const late = attendanceRecords.filter((r) => r.status === "late").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;

    // Get total students
    let totalStudents = 0;
    if (args.classId) {
      const students = await ctx.db
        .query("studentsInClasses")
        .withIndex("by_class", (q) => q.eq("classId", args.classId))
        .collect();
      totalStudents = students.length;
    } else {
      const classes = await ctx.db
        .query("classes")
        .withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id))
        .collect();
      const allStudents = await Promise.all(
        classes.map(async (cls) => {
          return await ctx.db
            .query("studentsInClasses")
            .withIndex("by_class", (q) => q.eq("classId", cls._id))
            .collect();
        })
      );
      totalStudents = new Set(allStudents.flat().map((s) => s.studentId)).size;
    }

    return { present, late, absent, total: totalStudents };
  },
});

// Get today's schedule for teacher
export const getTodaySchedule = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return [];
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      return [];
    }

    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const today = days[new Date().getDay()];

    // Get all schedule items for today that match teacher's classes
    // Note: This is a simplified version - in a real app, you'd want to link scheduleItems to classes
    const allScheduleItems = await ctx.db.query("scheduleItems").collect();
    
    // Filter by teacher name (simplified - in real app use classId)
    const todayItems = allScheduleItems.filter((item) => {
      return item.day === today && item.teacher === teacher.name;
    });

    return todayItems.sort((a, b) => {
      const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00';
      const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00';
      return timeA.localeCompare(timeB);
    });
  },
});

// Get all schedule for teacher (all days)
export const getTeacherSchedule = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      return [];
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      return [];
    }

    // Get all schedule items that match teacher's name
    const allScheduleItems = await ctx.db.query("scheduleItems").collect();
    
    const teacherItems = allScheduleItems.filter((item) => {
      return item.teacher === teacher.name;
    });

    return teacherItems.sort((a, b) => {
      const dayOrder = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
      const dayA = dayOrder.indexOf(a.day) !== -1 ? dayOrder.indexOf(a.day) : 999;
      const dayB = dayOrder.indexOf(b.day) !== -1 ? dayOrder.indexOf(b.day) : 999;
      if (dayA !== dayB) return dayA - dayB;
      
      const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00';
      const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00';
      return timeA.localeCompare(timeB);
    });
  },
});

// Mark attendance
export const markAttendance = mutation({
  args: {
    studentId: v.id("users"),
    classId: v.id("classes"),
    scheduleItemId: v.optional(v.id("scheduleItems")),
    status: v.union(v.literal("present"), v.literal("late"), v.literal("absent")),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Not authorized");
    }

    const classObj = await ctx.db.get(args.classId);
    if (!classObj || classObj.teacherId !== teacher._id) {
      throw new Error("Not authorized for this class");
    }

    const today = new Date().toLocaleDateString("nb-NO");

    // Check if attendance already marked for today
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("date"), today))
      .filter((q) => q.eq(q.field("classId"), args.classId))
      .first();

    if (existing) {
      // Update existing attendance
      await ctx.db.patch(existing._id, {
        status: args.status,
        markedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new attendance record
    const attendanceId = await ctx.db.insert("attendance", {
      studentId: args.studentId,
      classId: args.classId,
      scheduleItemId: args.scheduleItemId,
      date: today,
      status: args.status,
      markedBy: teacher._id,
      markedAt: Date.now(),
    });

    return attendanceId;
  },
});

// Create class
export const createClass = mutation({
  args: {
    name: v.string(),
    grade: v.string(),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Not authorized");
    }

    const classId = await ctx.db.insert("classes", {
      name: args.name,
      grade: args.grade,
      teacherId: teacher._id,
      subject: args.subject,
    });

    return classId;
  },
});

// Add student to class
export const addStudentToClass = mutation({
  args: {
    studentId: v.id("users"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getClerkUserId(ctx);
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), clerkUserId))
      .first();

    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Not authorized");
    }

    const classObj = await ctx.db.get(args.classId);
    if (!classObj || classObj.teacherId !== teacher._id) {
      throw new Error("Not authorized for this class");
    }

    // Check if already in class
    const existing = await ctx.db
      .query("studentsInClasses")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("classId"), args.classId))
      .first();

    if (existing) {
      return existing._id;
    }

    const id = await ctx.db.insert("studentsInClasses", {
      studentId: args.studentId,
      classId: args.classId,
    });

    return id;
  },
});
