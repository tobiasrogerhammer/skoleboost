import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const seedCoupons = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("coupons").first();
    if (existing) {
      return; // Already seeded
    }

    await ctx.db.insert("coupons", {
      title: "Valgfritt Pizzastykke",
      description: "Få en gratis pizzabit fra kafeteriaen, vi har pepperoni, margherita og vegetar",
      cost: 50,
      available: 15,
      category: "Mat",
      allergies: ["Gluten", "Melk"],
      emoji: "🍕",
    });

    await ctx.db.insert("coupons", {
      title: "Burger Meny",
      description: "Burger med pommes frites og drikke",
      cost: 100,
      available: 8,
      category: "Mat",
      allergies: ["Gluten", "Melk"],
      emoji: "🍔",
    });

    await ctx.db.insert("coupons", {
      title: "Smoothie",
      description: "Fersk fruktsmoothie etter ditt valg. Vi har banan-blåbær, eple-mango og protein-smoothie",
      cost: 30,
      available: 20,
      category: "Drikke",
      allergies: ["Melk"],
      emoji: "🥤",
    });

    await ctx.db.insert("coupons", {
      title: "Salatbar",
      description: "Sunn salatbar med pasta, grønnsaker, kylling, egg og dressing",
      cost: 40,
      available: 12,
      category: "Mat",
      allergies: [],
      emoji: "🥗",
    });

    await ctx.db.insert("coupons", {
      title: "Cookies",
      description: "Pakke med 4 aunt mables cookies",
      cost: 25,
      available: 25,
      category: "Snacks",
      allergies: ["Gluten", "Egg", "Melk"],
      emoji: "🍪",
    });

    await ctx.db.insert("coupons", {
      title: "Energidrikk",
      description: "Redbull, Monster, eller Burn",
      cost: 35,
      available: 10,
      category: "Drikke",
      allergies: [],
      emoji: "⚡",
    });
  },
});

export const seedEvents = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("socialEvents").first();
    if (existing) {
      return; // Already seeded
    }

    await ctx.db.insert("socialEvents", {
      title: "Gaming Turnering",
      description: "Episk gaming-konkurranse med premier og pizza!",
      date: "Fredag",
      time: "16:00",
      emoji: "🎮",
      registered: 14,
      capacity: 16,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Skogstur og båltenning",
      description: "Utforsk vakre stier og nyt en pikniklunsj med båltenning",
      date: "Lørdag",
      time: "09:00",
      emoji: "🌲",
      registered: 9,
      capacity: 12,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Vinter Kunstutstilling",
      description: "Vises frem og beundres fantastisk elevkunst",
      date: "I dag",
      time: "15:00",
      emoji: "🎨",
      registered: 23,
      capacity: 50,
      colorTheme: "pink",
    });
  },
});

export const seedScheduleItems = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!user) {
      throw new Error(`Bruker med e-post ${args.userEmail} ikke funnet. Opprett bruker først.`);
    }

    const existing = await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      return; // Already seeded
    }

    // I dag - klasser
    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Matte",
      teacher: "Agnete",
      time: "08:00 - 09:30",
      room: "Rom 101",
      points: 10,
      attended: true,
      day: "I dag",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Engelsk",
      teacher: "Brynjar",
      time: "09:45 - 11:15",
      room: "Rom 205",
      points: 10,
      attended: true,
      day: "I dag",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Fotografiklubb Møte",
      teacher: "Ragnhild",
      time: "11:30 - 12:30",
      room: "Mediesenter",
      points: 0,
      attended: false,
      day: "I dag",
      type: "event",
      description: "📸 Lær portrettfotografiteknikk og rediger dine beste bilder!",
      emoji: "📸",
      colorTheme: "purple",
      capacity: 15,
      registered: 8,
      isRegistered: false,
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Fysikk",
      teacher: "Rolf",
      time: "13:00 - 14:30",
      room: "Lab 3",
      points: 15,
      attended: false,
      day: "I dag",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Vinter Kunstutstilling",
      time: "15:00 - 17:00",
      room: "Skolegalleriet",
      points: 0,
      attended: false,
      day: "I dag",
      type: "event",
      description: "🎨 Vis frem din kreativitet! Vis frem ditt kunstverk og se fantastiske elevkreasjoner",
      emoji: "🎨",
      colorTheme: "pink",
      capacity: 50,
      registered: 23,
      isRegistered: true,
    });

    // I morgen - klasser
    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Norsk",
      teacher: "Kari",
      time: "08:00 - 09:30",
      room: "Rom 102",
      points: 10,
      attended: false,
      day: "I morgen",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Historie",
      teacher: "Lars",
      time: "09:45 - 11:15",
      room: "Rom 301",
      points: 10,
      attended: false,
      day: "I morgen",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Kjemi",
      teacher: "Ingrid",
      time: "11:30 - 13:00",
      room: "Lab 2",
      points: 15,
      attended: false,
      day: "I morgen",
      type: "class",
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Kroppsøving",
      teacher: "Tom",
      time: "13:15 - 14:45",
      room: "Gymsal",
      points: 10,
      attended: false,
      day: "I morgen",
      type: "class",
    });

    // Kommende arrangementer
    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Gaming Turnering",
      time: "16:00 - 19:00",
      room: "Mediesenter",
      points: 0,
      attended: false,
      day: "Fredag",
      type: "event",
      description: "Episk gaming-konkurranse med premier og pizza!",
      emoji: "🎮",
      colorTheme: "blue",
      capacity: 16,
      registered: 14,
      isRegistered: false,
    });

    await ctx.db.insert("scheduleItems", {
      userId: user._id,
      subject: "Skogstur og båltenning",
      time: "09:00 - 15:00",
      room: "Skogen",
      points: 0,
      attended: false,
      day: "Lørdag",
      type: "trip",
      description: "Utforsk vakre stier og nyt en pikniklunsj med båltenning",
      emoji: "🌲",
      colorTheme: "green",
      capacity: 12,
      registered: 9,
      isRegistered: false,
    });
  },
});

export const seedAchievements = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!user) {
      throw new Error(`Bruker med e-post ${args.userEmail} ikke funnet. Opprett bruker først.`);
    }

    const existing = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      return; // Already seeded
    }

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Perfekt Uke",
      description: "Deltatt på alle timer i en hel uke",
      icon: "🏆",
      earned: true,
      earnedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 dager siden
    });

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Morgenfugl",
      description: "Ankom tidlig til 10 timer på rad",
      icon: "🌅",
      earned: true,
      earnedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 dager siden
    });

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Poengmester",
      description: "Tjent 500 totale poeng",
      icon: "💎",
      earned: false,
      progress: 78, // 78% mot målet
    });

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Sosial Sommerfugl",
      description: "Deltatt på 5 skolearrangementer",
      icon: "🦋",
      earned: false,
      progress: 60, // 60% mot målet (3 av 5)
    });

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Konsistent Lærer",
      description: "Opprettholdt 90% oppmøte i en måned",
      icon: "📚",
      earned: true,
      earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dager siden
    });

    await ctx.db.insert("achievements", {
      userId: user._id,
      title: "Hjelpende Hånd",
      description: "Hjalp klassekamerater 20 ganger",
      icon: "🤝",
      earned: false,
      progress: 45, // 45% mot målet (9 av 20)
    });
  },
});

export const seedAllForUser = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!user) {
      throw new Error(`Bruker med e-post ${args.userEmail} ikke funnet. Opprett bruker først.`);
    }

    // Seed schedule items
    const existingSchedule = await ctx.db
      .query("scheduleItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!existingSchedule) {
      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Matte",
        teacher: "Agnete",
        time: "08:00 - 09:30",
        room: "Rom 101",
        points: 10,
        attended: true,
        day: "I dag",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Engelsk",
        teacher: "Brynjar",
        time: "09:45 - 11:15",
        room: "Rom 205",
        points: 10,
        attended: true,
        day: "I dag",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Fotografiklubb Møte",
        teacher: "Ragnhild",
        time: "11:30 - 12:30",
        room: "Mediesenter",
        points: 0,
        attended: false,
        day: "I dag",
        type: "event",
        description: "📸 Lær portrettfotografiteknikk og rediger dine beste bilder!",
        emoji: "📸",
        colorTheme: "purple",
        capacity: 15,
        registered: 8,
        isRegistered: false,
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Fysikk",
        teacher: "Rolf",
        time: "13:00 - 14:30",
        room: "Lab 3",
        points: 15,
        attended: false,
        day: "I dag",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Vinter Kunstutstilling",
        time: "15:00 - 17:00",
        room: "Skolegalleriet",
        points: 0,
        attended: false,
        day: "I dag",
        type: "event",
        description: "🎨 Vis frem din kreativitet! Vis frem ditt kunstverk og se fantastiske elevkreasjoner",
        emoji: "🎨",
        colorTheme: "pink",
        capacity: 50,
        registered: 23,
        isRegistered: true,
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Norsk",
        teacher: "Kari",
        time: "08:00 - 09:30",
        room: "Rom 102",
        points: 10,
        attended: false,
        day: "I morgen",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Historie",
        teacher: "Lars",
        time: "09:45 - 11:15",
        room: "Rom 301",
        points: 10,
        attended: false,
        day: "I morgen",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Kjemi",
        teacher: "Ingrid",
        time: "11:30 - 13:00",
        room: "Lab 2",
        points: 15,
        attended: false,
        day: "I morgen",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Kroppsøving",
        teacher: "Tom",
        time: "13:15 - 14:45",
        room: "Gymsal",
        points: 10,
        attended: false,
        day: "I morgen",
        type: "class",
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Gaming Turnering",
        time: "16:00 - 19:00",
        room: "Mediesenter",
        points: 0,
        attended: false,
        day: "Fredag",
        type: "event",
        description: "Episk gaming-konkurranse med premier og pizza!",
        emoji: "🎮",
        colorTheme: "blue",
        capacity: 16,
        registered: 14,
        isRegistered: false,
      });

      await ctx.db.insert("scheduleItems", {
        userId: user._id,
        subject: "Skogstur og båltenning",
        time: "09:00 - 15:00",
        room: "Skogen",
        points: 0,
        attended: false,
        day: "Lørdag",
        type: "trip",
        description: "Utforsk vakre stier og nyt en pikniklunsj med båltenning",
        emoji: "🌲",
        colorTheme: "green",
        capacity: 12,
        registered: 9,
        isRegistered: false,
      });
    }

    // Seed achievements
    const existingAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!existingAchievements) {
      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Perfekt Uke",
        description: "Deltatt på alle timer i en hel uke",
        icon: "🏆",
        earned: true,
        earnedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Morgenfugl",
        description: "Ankom tidlig til 10 timer på rad",
        icon: "🌅",
        earned: true,
        earnedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Poengmester",
        description: "Tjent 500 totale poeng",
        icon: "💎",
        earned: false,
        progress: 78,
      });

      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Sosial Sommerfugl",
        description: "Deltatt på 5 skolearrangementer",
        icon: "🦋",
        earned: false,
        progress: 60,
      });

      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Konsistent Lærer",
        description: "Opprettholdt 90% oppmøte i en måned",
        icon: "📚",
        earned: true,
        earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("achievements", {
        userId: user._id,
        title: "Hjelpende Hånd",
        description: "Hjalp klassekamerater 20 ganger",
        icon: "🤝",
        earned: false,
        progress: 45,
      });
    }
  },
});

