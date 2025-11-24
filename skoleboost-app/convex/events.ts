import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socialEvents").collect();
  },
});

export const getUserRegistrations = query({
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

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return registrations.map((r) => r.eventId.toString());
  },
});

export const register = mutation({
  args: {
    eventId: v.union(v.id("scheduleItems"), v.id("socialEvents")),
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

    // Check if it's a scheduleItem or socialEvent
    // Try to get from both tables - Convex will throw if ID doesn't match table
    let event: any = null;
    let isScheduleItem = false;
    
    // Try socialEvents first (more common for MainPage)
    try {
      const socialEventId = args.eventId as any;
      event = await ctx.db.get(socialEventId);
      if (event) {
        // Check if it has a 'type' field - if not, it's a socialEvent
        if (!('type' in event)) {
          isScheduleItem = false;
        } else {
          // It has type, so it's a scheduleItem, but we got it from wrong table
          event = null;
        }
      }
    } catch (e) {
      // Not a socialEvent ID, will try scheduleItems
      event = null;
    }
    
    // If not found in socialEvents, try scheduleItems
    if (!event) {
      try {
        const scheduleItemId = args.eventId as any;
        event = await ctx.db.get(scheduleItemId);
        if (event && 'type' in event) {
          isScheduleItem = true;
        } else {
          throw new Error("Event not found");
        }
      } catch (e2) {
        throw new Error(`Event not found: ${args.eventId}`);
      }
    }

    if (!event) {
      throw new Error("Event not found");
    }

    // For scheduleItems, check if it's an event type
    if (isScheduleItem && event.type !== "event") {
      throw new Error("Event not found");
    }

    const existingRegistration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    if (existingRegistration) {
      await ctx.db.delete(existingRegistration._id);
      if (isScheduleItem) {
        await ctx.db.patch(args.eventId as any, {
          registered: (event.registered || 0) - 1,
          isRegistered: false,
        });
      } else {
        // For socialEvents, update registered count
        await ctx.db.patch(args.eventId as any, {
          registered: Math.max(0, (event.registered || 0) - 1),
        });
      }
      return { registered: false };
    }

    if ((event.registered || 0) >= (event.capacity || 0)) {
      throw new Error("Event is full");
    }

    await ctx.db.insert("eventRegistrations", {
      userId: user._id,
      eventId: args.eventId,
      registeredAt: Date.now(),
    });

    if (isScheduleItem) {
      await ctx.db.patch(args.eventId as any, {
        registered: (event.registered || 0) + 1,
        isRegistered: true,
      });
    } else {
      // For socialEvents, update registered count
      await ctx.db.patch(args.eventId as any, {
        registered: (event.registered || 0) + 1,
      });
    }

    return { registered: true };
  },
});

