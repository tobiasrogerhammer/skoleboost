import { mutation } from "./_generated/server";

// Migration to add role field to existing users
export const addRoleToExistingUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    let updated = 0;
    for (const user of users) {
      if (!user.role) {
        await ctx.db.patch(user._id, {
          role: "student" as const,
        });
        updated++;
      }
    }
    
    return { updated, total: users.length };
  },
});

