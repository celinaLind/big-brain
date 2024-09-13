// functions to interact with the documents collection
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocuments = query({
    // query is what the user can request from the frontend
    async handler( ctx ) {
        // return all documents from the documents table
        return await ctx.db.query( 'documents').collect();
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
        // insert a new document into the documents table
        // with the title provided by the user
        // schema is defined in convex/schema.ts
        await ctx.db.insert( 'documents', { title: args.title } );
    }
})