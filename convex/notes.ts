import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return null;
        }
        // TODO: add getnotes query so you can display notes on the frontend

        return "notes"
    }
})

export const createNote = mutation({
    args: {
    text: v.string(),
    title: v.string(),
},
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
         
        if(!userId) {
            throw new ConvexError("You must be logged in to create a note")
            return null;
        }

        const note = await ctx.db.insert("notes", {
            title: args.title,
            text: args.text,
            tokenIdentifier: userId,
        });

        return note;
    }
})