import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  tags: defineTable({
    name: v.string(),
  }),
  boards: defineTable({
    name: v.string(),
  }),
});
