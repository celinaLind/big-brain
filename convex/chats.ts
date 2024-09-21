import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createChatRecord = internalMutation({
    args: {
        documentId: v.id('documents'),
        text: v.string(),
        isHuman: v.boolean(),
        tokenIdentifier: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert('chats', {
            documentId: args.documentId,
            text: args.text,
            tokenIdentifier: args.tokenIdentifier,
            isHuman: args.isHuman
        })
    }
    })