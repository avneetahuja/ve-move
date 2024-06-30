import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("transactions").collect();
  },
});

export const createTransaction = mutation({
  args: {
    walletAddress: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    riding: v.boolean(),
    rideType: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", {
      walletAddress: args.walletAddress,
      riding: args.riding,
      latitude: args.latitude,
      longitude: args.longitude,
      time: args.time,
      rideType: args.rideType,
    });
  },
});

export const getRidingFromWalletAddress = query({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("walletAddress"), args.walletAddress))
      .collect();
    if (transactions.length > 0) {
      return transactions[0].riding;
    }
  },
});

// make a mutation that changes existing transaction if the walletAddress else makes a new entry
export const updateTransaction = mutation({
  args: {
    walletAddress: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    riding: v.boolean(),
    rideType: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("walletAddress"), args.walletAddress))
      .collect();
    if (transaction.length > 0) {
      return await ctx.db.patch(transaction[0]._id, {
        walletAddress: args.walletAddress,
        riding: args.riding,
        latitude: args.latitude,
        longitude: args.longitude,
        time: args.time,
        rideType: args.rideType,
      });
    } else {
      return await ctx.db.insert("transactions", {
        walletAddress: args.walletAddress,
        riding: args.riding,
        latitude: args.latitude,
        longitude: args.longitude,
        time: args.time,
        rideType: args.rideType,
      });
    }
  },
});

export const getCoordinatesFromWalletAddress = query({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("walletAddress"), args.walletAddress))
      .collect();
    if (transactions.length > 0) {
      return [transactions[0].latitude, transactions[0].longitude];
    }
  },
});
