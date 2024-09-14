// functions to interact with the documents collection
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getDocuments = query({

    // query is what the user can request from the frontend
    async handler( ctx ) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return [];
    }

        // return all documents from the documents table for specific user
        return await ctx.db.query( 'documents')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId) ).collect();
    }
})


export const createDocument = mutation({
    //mutation is what can user send from frontend to backend
    // define arguments
    args: {
        title: v.string(),
    },
    // a handler is where you write the logic for the mutation
    async handler( ctx, args ) {
        // verify that the user is authenticated
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        // logs are also printed in the convex console
        console.log(userId);

        if (!userId) {
            throw new ConvexError('Not authenticated');
        }

        // insert a new document into the documents table
        // with the title provided by the user
        // schema is defined in convex/schema.ts
        await ctx.db.insert( 'documents', { title: args.title, tokenIdentifier: userId } );
    }
})