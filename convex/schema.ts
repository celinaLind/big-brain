import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // return all documents correlated to specific user
    documents: defineTable({ 
        title: v.string(),
        tokenIdentifier: v.string(),
        fileId: v.id("_storage"),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});