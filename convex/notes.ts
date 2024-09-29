import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNote = query({
    args:{
        noteId: v.id("notes")
    },
    async handler(ctx, args) {
        // verify user is authenticated/logged in
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if(!userId) {
            return null
        }

        // verify note exists
        const note = await ctx.db.get(args.noteId);

        if (!note) {
            return null
        }

        // verify user has access to the note
        if ( note.tokenIdentifier != userId ) {
            return null
        }

        return note;
    }
})

export const getNotes = query({
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return null;
        }
        
        const notes = await ctx.db
        .query("notes")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .order("desc")
        .collect();

        return notes;
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

export const deleteNote = mutation({
    args: {
        noteId: v.id("notes"),
    },
    async handler(ctx, args) {
        // does this user id change (is it the acutal user id or just the id of the item)
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            throw new ConvexError("You must be logged in to delete a note")
        }

        const note = await ctx.db.get(args.noteId);

        if(!note) {
            throw new ConvexError("Note not found");
        }

        if (note.tokenIdentifier !== userId) {
            throw new ConvexError("You do note have permission to delete this note")
        }

        await ctx.db.delete(args.noteId);
    }
})