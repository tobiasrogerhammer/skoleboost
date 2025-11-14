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

    return await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
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
    if (!item || item.userId !== user._id) {
      throw new Error("Schedule item not found");
    }

    await ctx.db.patch(args.scheduleItemId, {
      attended: true,
    });

    if (item.type === "class" && !item.attended) {
      await ctx.db.patch(user._id, {
        currentPoints: user.currentPoints + item.points,
        totalEarned: user.totalEarned + item.points,
      });
    }
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

    // Delete existing schedule items first (to allow re-setup)
    const existingItems = await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    // Get current day name for "I dag" and "I morgen"
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const today = days[new Date().getDay()];
    const tomorrow = days[(new Date().getDay() + 1) % 7];

    let count = 0;

    // Helper function to insert schedule items
    const insertItem = async (item: any) => {
      await ctx.db.insert("scheduleItems", {
        userId: user._id,
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
      subject: "Gaming Turnering",
      time: "15:00 - 17:00",
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

