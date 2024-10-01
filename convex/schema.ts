import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // return all documents correlated to specific user
    documents: defineTable({ 
        title: v.string(),
        tokenIdentifier: v.string(),
        fileId: v.id("_storage"),
        description: v.optional(v.string()),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
    chats: defineTable({ 
        documentId: v.id("documents"),
        tokenIdentifier: v.string(),
        isHuman: v.boolean(),
        text: v.string(),
    }).index("by_documentId_tokenIdentifier", ["documentId","tokenIdentifier"]),
    notes: defineTable({ 
        title: v.string(),
        tokenIdentifier: v.string(),
        text: v.string(),
        // you can name the embedding value anything but the type must be v.array(...)
        // v.optional means the value is not required and can be given later
        embedding: v.optional(v.array(v.float64())),
    }).vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"],
    }).index("by_tokenIdentifier", ["tokenIdentifier"])
})
    ;

    // Vector search allows you to find Convex documents similar to a provided vector.