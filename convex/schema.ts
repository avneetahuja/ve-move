import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transactions: defineTable({
    walletAddress: v.string(),
    riding: v.boolean(),
    latitude: v.string(),
    longitude: v.string(),
    time: v.string(),
    rideType: v.string()
  }),
});