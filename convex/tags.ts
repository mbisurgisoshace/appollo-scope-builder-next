import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const createTask = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tags", { name: args.name });
  },
});
