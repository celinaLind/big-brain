import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const getNote = query({
    args: {
        noteId: v.id("notes")
    },
    async handler(ctx, args) {
        // verify user is authenticated/logged in
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return null
        }

        // verify note exists
        const note = await ctx.db.get(args.noteId);

        if (!note) {
            return null
        }

        // verify user has access to the note
        if (note.tokenIdentifier != userId) {
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

export async function embed(text: string) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    })

    return embedding.data[0].embedding;
}

/*
    a "mutation" is a function that modifies data in your database, 
    while an "internal mutation" is a mutation that can only be called 
    by other functions within your Convex application, 
    not directly by client application
*/
// openai functions cannot be run within a mutation but instead must be run in an action
export const createNote = mutation({
    args: {
        text: v.string(),
        title: v.string(),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            throw new ConvexError("You must be logged in to create a note")
            return null;
        }

        const noteId = await ctx.db.insert("notes", {
            title: args.title,
            text: args.text,
            tokenIdentifier: userId
        });

        await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
            noteId: noteId,
            text: args.text,
            title: args.title
        })
    }
})

export const setNoteEmbedding = internalMutation({
    args: {
        noteId: v.id('notes'),
        embedding: v.array(v.number())
    },
    async handler (ctx, args) {
        await ctx.db.patch(args.noteId, {
            embedding: args.embedding
        })
    }
})

export const createNoteEmbedding = internalAction({
    args: {
        noteId: v.id('notes'),
        text: v.string(),
        title: v.string(),
    },
    async handler(ctx, args) {

        // returns an array of numbers or floats to compare to questions later
        const embedding = await embed(args.text);
        console.log("CreateNoteEmbedding: ", embedding)
        await ctx.runMutation(internal.notes.setNoteEmbedding, {
            noteId: args.noteId,
            embedding
        })
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

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (note.tokenIdentifier !== userId) {
            throw new ConvexError("You do note have permission to delete this note")
        }

        await ctx.db.delete(args.noteId);
    }
})