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

    // Get all global schedule items (where userId is null/undefined) - shared by all students
    // In Convex, we need to get all items and filter for those without userId
    const allScheduleItems = await ctx.db.query("scheduleItems").collect();
    const globalItems = allScheduleItems.filter((item) => !item.userId);

    // Also get user-specific items if any (for backward compatibility)
    const userItems = await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get today's attendance records for this user
    const today = new Date().toLocaleDateString("nb-NO");
    const todayAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("studentId", user._id))
      .filter((q) => q.eq(q.field("date"), today))
      .collect();

    const attendanceMap = new Map(
      todayAttendance.map((a) => [a.scheduleItemId, a.status === "present"])
    );

    // Combine items, prioritizing global items and removing duplicates
    // Create a map to track unique items by day + time + subject + room
    const uniqueItemsMap = new Map<string, any>();
    
    // First, add all global items
    for (const item of globalItems) {
      const key = `${item.day}|${item.time}|${item.subject}|${item.room}`;
      if (!uniqueItemsMap.has(key)) {
        uniqueItemsMap.set(key, item);
      }
    }
    
    // Then, add user-specific items only if they don't duplicate global items
    for (const item of userItems) {
      const key = `${item.day}|${item.time}|${item.subject}|${item.room}`;
      if (!uniqueItemsMap.has(key)) {
        uniqueItemsMap.set(key, item);
      }
    }
    
    // Convert map values to array and add attendance status
    const allItems = Array.from(uniqueItemsMap.values());
    return allItems.map((item) => ({
      ...item,
      attended: attendanceMap.get(item._id) || false,
    }));
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
    if (!item) {
      throw new Error("Schedule item not found");
    }

    // Check if already marked for today
    const today = new Date().toLocaleDateString("nb-NO");
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_student_schedule", (q) => 
        q.eq("studentId", user._id).eq("scheduleItemId", args.scheduleItemId).eq("date", today)
      )
      .first();

    if (existing) {
      // Already marked, don't do anything
      return existing._id;
    }

    // Create attendance record
    await ctx.db.insert("attendance", {
      studentId: user._id,
      scheduleItemId: args.scheduleItemId,
      date: today,
      status: "present",
      markedAt: Date.now(),
    });

    // Award points if it's a class
    if (item.type === "class") {
      await ctx.db.patch(user._id, {
        currentPoints: user.currentPoints + item.points,
        totalEarned: user.totalEarned + item.points,
      });
    }

    return { success: true };
  },
});

export const setupDefaultSchedule = mutation({
  args: {},
  handler: async (ctx) => {
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

    // Check if global schedule already exists
    const allScheduleItems = await ctx.db.query("scheduleItems").collect();
    const existingGlobalItems = allScheduleItems.filter((item) => !item.userId);

    if (existingGlobalItems.length > 0) {
      // Global schedule already exists, don't recreate
      return { message: "Global timeplan finnes allerede", count: existingGlobalItems.length };
    }

    // Delete any existing user-specific items (for backward compatibility)
    const existingUserItems = await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of existingUserItems) {
      await ctx.db.delete(item._id);
    }

    // Get current day name for "I dag" and "I morgen"
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const today = days[new Date().getDay()];
    const tomorrow = days[(new Date().getDay() + 1) % 7];

    let count = 0;

    // Helper function to insert schedule items (global - no userId)
    const insertItem = async (item: any) => {
      await ctx.db.insert("scheduleItems", {
        userId: undefined, // Global schedule for all students
        ...item,
      });
      count++;
    };

    // MANDAG - Komplett timeplan
    await insertItem({
      subject: "Norsk",
      teacher: "Kari",
      time: "08:00 - 09:00",
      room: "Rom 201",
      points: 10,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    await insertItem({
      subject: "Matte",
      teacher: "Agnete",
      time: "09:15 - 10:15",
      room: "Rom 101",
      points: 10,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    await insertItem({
      subject: "Engelsk",
      teacher: "Brynjar",
      time: "10:30 - 11:30",
      room: "Rom 205",
      points: 10,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    await insertItem({
      subject: "Lunsj",
      time: "11:30 - 12:00",
      room: "Kantine",
      points: 0,
      attended: false,
      day: "Mandag",
      type: "event",
      description: "🍽️ Lunsjpause",
      emoji: "🍽️",
      colorTheme: "orange",
    });

    await insertItem({
      subject: "Kroppsøving",
      teacher: "Erik",
      time: "12:00 - 13:00",
      room: "Gymsal",
      points: 10,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    await insertItem({
      subject: "Naturfag",
      teacher: "Rolf",
      time: "13:15 - 14:15",
      room: "Lab 2",
      points: 12,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    await insertItem({
      subject: "Historie",
      teacher: "Lars",
      time: "14:30 - 15:30",
      room: "Rom 102",
      points: 10,
      attended: today === "Mandag" ? false : false,
      day: "Mandag",
      type: "class",
    });

    // TIRSDAG
    await insertItem({
      subject: "Matte",
      teacher: "Agnete",
      time: "08:00 - 09:00",
      room: "Rom 101",
      points: 10,
      attended: today === "Tirsdag" ? false : false,
      day: "Tirsdag",
      type: "class",
    });

    await insertItem({
      subject: "Spansk",
      teacher: "Maria",
      time: "09:15 - 10:15",
      room: "Rom 304",
      points: 10,
      attended: today === "Tirsdag" ? false : false,
      day: "Tirsdag",
      type: "class",
    });

    await insertItem({
      subject: "Samfunnsfag",
      teacher: "Lars",
      time: "10:30 - 11:30",
      room: "Rom 102",
      points: 10,
      attended: today === "Tirsdag" ? false : false,
      day: "Tirsdag",
      type: "class",
    });

    await insertItem({
      subject: "Lunsj",
      time: "11:30 - 12:00",
      room: "Kantine",
      points: 0,
      attended: false,
      day: "Tirsdag",
      type: "event",
      description: "🍽️ Lunsjpause",
      emoji: "🍽️",
      colorTheme: "orange",
    });

    await insertItem({
      subject: "Kunst og håndverk",
      teacher: "Ingrid",
      time: "12:00 - 13:30",
      room: "Kunststudio",
      points: 12,
      attended: today === "Tirsdag" ? false : false,
      day: "Tirsdag",
      type: "class",
    });

    await insertItem({
      subject: "Norsk",
      teacher: "Kari",
      time: "13:45 - 14:45",
      room: "Rom 201",
      points: 10,
      attended: today === "Tirsdag" ? false : false,
      day: "Tirsdag",
      type: "class",
    });

    // ONSDAG
    await insertItem({
      subject: "Engelsk",
      teacher: "Brynjar",
      time: "08:00 - 09:00",
      room: "Rom 205",
      points: 10,
      attended: today === "Onsdag" ? false : false,
      day: "Onsdag",
      type: "class",
    });

    await insertItem({
      subject: "Fysikk",
      teacher: "Rolf",
      time: "09:15 - 10:15",
      room: "Lab 3",
      points: 12,
      attended: today === "Onsdag" ? false : false,
      day: "Onsdag",
      type: "class",
    });

    await insertItem({
      subject: "Matte",
      teacher: "Agnete",
      time: "10:30 - 11:30",
      room: "Rom 101",
      points: 10,
      attended: today === "Onsdag" ? false : false,
      day: "Onsdag",
      type: "class",
    });

    await insertItem({
      subject: "Lunsj",
      time: "11:30 - 12:00",
      room: "Kantine",
      points: 0,
      attended: false,
      day: "Onsdag",
      type: "event",
      description: "🍽️ Lunsjpause",
      emoji: "🍽️",
      colorTheme: "orange",
    });

    await insertItem({
      subject: "Musikk",
      teacher: "Hanne",
      time: "12:00 - 13:00",
      room: "Musikkrom",
      points: 10,
      attended: today === "Onsdag" ? false : false,
      day: "Onsdag",
      type: "class",
    });

    await insertItem({
      subject: "Fotografiklubb Møte",
      teacher: "Ragnhild",
      time: "13:15 - 14:15",
      room: "Mediesenter",
      points: 0,
      attended: false,
      day: "Onsdag",
      type: "event",
      description: "📸 Lær portrettfotografiteknikk og rediger dine beste bilder!",
      emoji: "📸",
      colorTheme: "purple",
      capacity: 15,
      registered: 8,
      isRegistered: false,
    });

    await insertItem({
      subject: "Kjemi",
      teacher: "Anne",
      time: "14:30 - 15:30",
      room: "Lab 1",
      points: 12,
      attended: today === "Onsdag" ? false : false,
      day: "Onsdag",
      type: "class",
    });

    // TORSDAG
    await insertItem({
      subject: "Kjemi",
      teacher: "Anne",
      time: "08:00 - 09:00",
      room: "Lab 1",
      points: 12,
      attended: today === "Torsdag" ? false : false,
      day: "Torsdag",
      type: "class",
    });

    await insertItem({
      subject: "Norsk",
      teacher: "Kari",
      time: "09:15 - 10:15",
      room: "Rom 201",
      points: 10,
      attended: today === "Torsdag" ? false : false,
      day: "Torsdag",
      type: "class",
    });

    await insertItem({
      subject: "Spansk",
      teacher: "Maria",
      time: "10:30 - 11:30",
      room: "Rom 304",
      points: 10,
      attended: today === "Torsdag" ? false : false,
      day: "Torsdag",
      type: "class",
    });

    await insertItem({
      subject: "Lunsj",
      time: "11:30 - 12:00",
      room: "Kantine",
      points: 0,
      attended: false,
      day: "Torsdag",
      type: "event",
      description: "🍽️ Lunsjpause",
      emoji: "🍽️",
      colorTheme: "orange",
    });

    await insertItem({
      subject: "Kroppsøving",
      teacher: "Erik",
      time: "12:00 - 13:00",
      room: "Gymsal",
      points: 10,
      attended: today === "Torsdag" ? false : false,
      day: "Torsdag",
      type: "class",
    });

    await insertItem({
      subject: "Samfunnsfag",
      teacher: "Lars",
      time: "13:15 - 14:15",
      room: "Rom 102",
      points: 10,
      attended: today === "Torsdag" ? false : false,
      day: "Torsdag",
      type: "class",
    });

    // FREDAG
    await insertItem({
      subject: "Matte",
      teacher: "Agnete",
      time: "08:00 - 09:00",
      room: "Rom 101",
      points: 10,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Engelsk",
      teacher: "Brynjar",
      time: "09:15 - 10:15",
      room: "Rom 205",
      points: 10,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Naturfag",
      teacher: "Rolf",
      time: "10:30 - 11:30",
      room: "Lab 2",
      points: 12,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Lunsj",
      time: "11:30 - 12:00",
      room: "Kantine",
      points: 0,
      attended: false,
      day: "Fredag",
      type: "event",
      description: "🍽️ Lunsjpause",
      emoji: "🍽️",
      colorTheme: "orange",
    });

    await insertItem({
      subject: "Kunst og håndverk",
      teacher: "Ingrid",
      time: "12:00 - 13:00",
      room: "Kunststudio",
      points: 10,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Engelsk",
      teacher: "Brynjar",
      time: "13:15 - 14:15",
      room: "Rom 205",
      points: 10,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Kroppsøving",
      teacher: "Erik",
      time: "14:30 - 15:30",
      room: "Gymsal",
      points: 10,
      attended: today === "Fredag" ? false : false,
      day: "Fredag",
      type: "class",
    });

    await insertItem({
      subject: "Gaming Turnering",
      time: "16:00 - 18:00",
      room: "Dataverksted",
      points: 0,
      attended: false,
      day: "Fredag",
      type: "event",
      description: "🎮 Episk gaming-konkurranse! Premier til vinnerne og pizza til alle",
      emoji: "🎮",
      colorTheme: "blue",
      capacity: 16,
      registered: 14,
      isRegistered: false,
    });

    // LØRDAG - Arrangement
    await insertItem({
      subject: "Natur Turgåing",
      time: "09:00 - 15:00",
      room: "Furutrær Sti",
      points: 0,
      attended: false,
      day: "Lørdag",
      type: "trip",
      description: "🌲 Utforsk vakre stier, ta fantastiske bilder og nyt en pikniklunsj!",
      emoji: "🌲",
      colorTheme: "emerald",
      capacity: 12,
      registered: 9,
      isRegistered: false,
    });

    return { message: "Timeplan opprettet", count };
  },
});

