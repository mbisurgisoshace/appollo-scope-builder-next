import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("boards").collect();
  },
});

export const getById = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBoard = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("boards", { name: args.name });
  },
});

export const updateBoard = mutation({
  args: { id: v.id("boards"), name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { name: args.name });
  },
});
