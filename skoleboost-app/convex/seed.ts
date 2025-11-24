import { mutation } from "./_generated/server";
import { v } from "convex/values";

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

    // Helper function to format date as "DD. MMM"
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('no-NO', { month: 'short' });
      return `${day}. ${month}`;
    };

    // Start date: 27. nov 2025, End date: 20. des 2025
    const startDate = new Date(2025, 10, 27); // Month is 0-indexed, so 10 = November
    const endDate = new Date(2025, 11, 20); // 11 = December
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Calculate dates evenly spread from 27. nov to 20. des (15 events)
    const getEventDate = (index: number) => {
      // Spread 15 events evenly from start to end date
      const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysOffset = index === 14 
        ? totalDays // Last event always on end date
        : Math.round((index * totalDays) / 14); // Spread first 14 events evenly
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + daysOffset);
      return eventDate;
    };
    // Events evenly spread from 27. nov to 20. des (15 events over 24 days)
    await ctx.db.insert("socialEvents", {
      title: "Vinter Kunstutstilling",
      description: "Vises frem og beundres fantastisk elevkunst",
      date: formatDate(getEventDate(0)), // 27. nov
      time: "15:00",
      emoji: "🎨",
      registered: 23,
      capacity: 50,
      colorTheme: "pink",
    });

    await ctx.db.insert("socialEvents", {
      title: "Musikkverksted",
      description: "Lær å spille gitar, piano eller trommer med våre musikklærere",
      date: formatDate(getEventDate(1)), // ~29. nov
      time: "14:00",
      emoji: "🎵",
      registered: 12,
      capacity: 20,
      colorTheme: "purple",
    });

    await ctx.db.insert("socialEvents", {
      title: "Gaming Turnering",
      description: "Episk gaming-konkurranse med premier og pizza!",
      date: formatDate(getEventDate(2)), // ~1. des
      time: "16:00",
      emoji: "🎮",
      registered: 14,
      capacity: 16,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Bakeklubb",
      description: "Bak deilige kaker og cookies sammen med venner",
      date: formatDate(getEventDate(3)), // ~3. des
      time: "15:30",
      emoji: "🧁",
      registered: 8,
      capacity: 15,
      colorTheme: "orange",
    });

    await ctx.db.insert("socialEvents", {
      title: "Fotballturnering",
      description: "Deltak i vår årlige fotballturnering med premier",
      date: formatDate(getEventDate(4)), // ~5. des
      time: "13:00",
      emoji: "⚽",
      registered: 18,
      capacity: 24,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Skogstur og båltenning",
      description: "Utforsk vakre stier og nyt en pikniklunsj med båltenning",
      date: formatDate(getEventDate(5)), // ~7. des
      time: "09:00",
      emoji: "🌲",
      registered: 9,
      capacity: 12,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Filmkveld",
      description: "Se en film sammen med popcorn og god stemning",
      date: formatDate(getEventDate(6)), // ~9. des
      time: "19:00",
      emoji: "🎬",
      registered: 15,
      capacity: 30,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Bokklubb Møte",
      description: "Diskuter boken vi har lest denne måneden",
      date: formatDate(getEventDate(7)), // ~11. des
      time: "16:00",
      emoji: "📚",
      registered: 6,
      capacity: 12,
      colorTheme: "pink",
    });

    await ctx.db.insert("socialEvents", {
      title: "Teknologi Workshop",
      description: "Lær om programmering, robotikk og 3D-printing",
      date: formatDate(getEventDate(8)), // ~13. des
      time: "15:00",
      emoji: "💻",
      registered: 11,
      capacity: 18,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Yoga og Meditasjon",
      description: "Slapp av med yoga og meditasjon etter skoledagen",
      date: formatDate(getEventDate(9)), // ~15. des
      time: "16:30",
      emoji: "🧘",
      registered: 7,
      capacity: 15,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Debattklubb",
      description: "Diskuter aktuelle temaer og utvikle argumentasjon",
      date: formatDate(getEventDate(10)), // ~17. des
      time: "14:30",
      emoji: "💬",
      registered: 9,
      capacity: 16,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Volleyballturnering",
      description: "Deltak i vår volleyballturnering med lagkonkurranse",
      date: formatDate(getEventDate(11)), // ~19. des
      time: "14:00",
      emoji: "🏐",
      registered: 16,
      capacity: 24,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Kunst og Håndverk",
      description: "Lag din egen kunst og håndverk med ulike teknikker",
      date: formatDate(getEventDate(12)), // ~20. des
      time: "10:00",
      emoji: "✂️",
      registered: 5,
      capacity: 12,
      colorTheme: "pink",
    });

    await ctx.db.insert("socialEvents", {
      title: "Quiz Kveld",
      description: "Test kunnskapen din i vår morsomme quiz med premier",
      date: formatDate(getEventDate(13)), // ~20. des
      time: "18:00",
      emoji: "🧠",
      registered: 20,
      capacity: 30,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Koding Klubb",
      description: "Lær å kode og bygg dine egne prosjekter",
      date: formatDate(getEventDate(14)), // ~20. des
      time: "16:00",
      emoji: "⌨️",
      registered: 13,
      capacity: 20,
      colorTheme: "purple",
    });

    // Note: Removed "Dans Workshop" to keep exactly 15 events
  },
});

// Update all existing events to be between 27. nov and 20. des 2025
export const updateEventDates = mutation({
  args: {},
  handler: async (ctx) => {
    // Helper function to format date as "DD. MMM"
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('no-NO', { month: 'short' });
      return `${day}. ${month}`;
    };

    // Start date: 27. nov 2025, End date: 20. des 2025
    const startDate = new Date(2025, 10, 27); // Month is 0-indexed, so 10 = November
    const endDate = new Date(2025, 11, 20); // 11 = December
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Calculate dates evenly spread from 27. nov to 20. des (15 events)
    const getEventDate = (index: number) => {
      // Spread 15 events evenly from start to end date
      const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysOffset = index === 14 
        ? totalDays // Last event always on end date
        : Math.round((index * totalDays) / 14); // Spread first 14 events evenly
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + daysOffset);
      return eventDate;
    };

    // Get all existing events
    const allEvents = await ctx.db.query("socialEvents").collect();
    
    // Event titles in order (matching seedEvents) with their index
    const eventTitles = [
      "Vinter Kunstutstilling",
      "Musikkverksted",
      "Gaming Turnering",
      "Bakeklubb",
      "Fotballturnering",
      "Skogstur og båltenning",
      "Filmkveld",
      "Bokklubb Møte",
      "Teknologi Workshop",
      "Yoga og Meditasjon",
      "Debattklubb",
      "Volleyballturnering",
      "Kunst og Håndverk",
      "Quiz Kveld",
      "Koding Klubb"
    ];

    // Update each event with new date based on title match
    for (const event of allEvents) {
      const titleIndex = eventTitles.indexOf(event.title);
      if (titleIndex !== -1) {
        await ctx.db.patch(event._id, {
          date: formatDate(getEventDate(titleIndex))
        });
      }
    }
  },
});

// Add more events without checking if they already exist
export const addMoreEvents = mutation({
  args: {},
  handler: async (ctx) => {
    // Helper function to format date as "DD. MMM"
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('no-NO', { month: 'short' });
      return `${day}. ${month}`;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Spread events over 6-8 weeks (42-56 days)
    await ctx.db.insert("socialEvents", {
      title: "Teknologi Workshop",
      description: "Lær om programmering, robotikk og 3D-printing",
      date: formatDate(new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000)), // 45 days
      time: "15:00",
      emoji: "💻",
      registered: 11,
      capacity: 18,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Yoga og Meditasjon",
      description: "Slapp av med yoga og meditasjon etter skoledagen",
      date: formatDate(new Date(today.getTime() + 48 * 24 * 60 * 60 * 1000)), // 48 days
      time: "16:30",
      emoji: "🧘",
      registered: 7,
      capacity: 15,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Debattklubb",
      description: "Diskuter aktuelle temaer og utvikle argumentasjon",
      date: formatDate(new Date(today.getTime() + 50 * 24 * 60 * 60 * 1000)), // 50 days
      time: "14:30",
      emoji: "💬",
      registered: 9,
      capacity: 16,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Volleyballturnering",
      description: "Deltak i vår volleyballturnering med lagkonkurranse",
      date: formatDate(new Date(today.getTime() + 52 * 24 * 60 * 60 * 1000)), // 52 days
      time: "14:00",
      emoji: "🏐",
      registered: 16,
      capacity: 24,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Kunst og Håndverk",
      description: "Lag din egen kunst og håndverk med ulike teknikker",
      date: formatDate(new Date(today.getTime() + 54 * 24 * 60 * 60 * 1000)), // 54 days
      time: "10:00",
      emoji: "✂️",
      registered: 5,
      capacity: 12,
      colorTheme: "pink",
    });

    await ctx.db.insert("socialEvents", {
      title: "Quiz Kveld",
      description: "Test kunnskapen din i vår morsomme quiz med premier",
      date: formatDate(new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000)), // 56 days
      time: "18:00",
      emoji: "🧠",
      registered: 20,
      capacity: 30,
      colorTheme: "blue",
    });

    await ctx.db.insert("socialEvents", {
      title: "Naturfotografi Tur",
      description: "Utforsk naturen og ta fantastiske bilder",
      date: formatDate(new Date(today.getTime() + 49 * 24 * 60 * 60 * 1000)), // 49 days
      time: "11:00",
      emoji: "📷",
      registered: 8,
      capacity: 14,
      colorTheme: "green",
    });

    await ctx.db.insert("socialEvents", {
      title: "Koding Klubb",
      description: "Lær å kode og bygg dine egne prosjekter",
      date: formatDate(new Date(today.getTime() + 46 * 24 * 60 * 60 * 1000)), // 46 days
      time: "16:00",
      emoji: "⌨️",
      registered: 13,
      capacity: 20,
      colorTheme: "purple",
    });

    await ctx.db.insert("socialEvents", {
      title: "Dans Workshop",
      description: "Lær ulike dansestiler og ha det gøy",
      date: formatDate(new Date(today.getTime() + 47 * 24 * 60 * 60 * 1000)), // 47 days
      time: "15:30",
      emoji: "💃",
      registered: 10,
      capacity: 18,
      colorTheme: "orange",
    });

    return "Added 9 more events";
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

