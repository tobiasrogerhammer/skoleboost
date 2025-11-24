import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

// Internal query to check if user exists
export const checkUserExists = internalQuery({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();
  },
});

// Internal mutation to create user
export const createUserInternal = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    grade: v.string(),
    studentId: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const totalStudents = await ctx.db.query("users").collect();
    const rank = totalStudents.length + 1;

    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      grade: args.grade,
      studentId: args.studentId,
      joinDate: new Date().toLocaleDateString("nb-NO", { month: "long", year: "numeric" }),
      currentPoints: 150,
      totalEarned: 0,
      attendanceRate: 0,
      rank,
      totalStudents: rank,
      imageUrl: args.imageUrl,
    });
  },
});

// Internal mutation to update user image
export const updateUserImage = internalMutation({
  args: {
    userId: v.id("users"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      imageUrl: args.imageUrl,
    });
  },
});

export const clerkWebhook = httpAction(async (ctx, request) => {
  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };

  const wh = new Webhook(webhookSecret);
  const evt = wh.verify(payload, headers) as any;

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) return new Response("No email", { status: 400 });

    // Check if user exists using internal query
    const existingUser = await ctx.runQuery(api.auth.checkUserExists, {
      studentId: id,
    });

    if (!existingUser) {
      // Create user using internal mutation
      await ctx.runMutation(api.auth.createUserInternal, {
        name: `${first_name || ""} ${last_name || ""}`.trim() || email.split("@")[0],
        email,
        grade: "",
        studentId: id,
        imageUrl: image_url || undefined,
      });
    } else {
      // Update existing user's imageUrl if it changed
      if (image_url && existingUser.imageUrl !== image_url) {
        await ctx.runMutation(api.auth.updateUserImage, {
          userId: existingUser._id,
          imageUrl: image_url,
        });
      }
    }
  }

  return new Response("OK", { status: 200 });
});

