// functions to interact with the documents collection
import { action, internalAction, internalMutation, internalQuery, mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Define the Document interface
interface Document {
    documentURL: string | null;
    _id: Id<'documents'>;
    _creationTime: number;
    title: string;
    tokenIdentifier: string;
    fileId: Id<'_storage'>;
  }

// create a mutation that can be called from the frontend 
// and generate a signed url for uploading a file using context storage (ctx.storage)
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToDocument(ctx: MutationCtx | QueryCtx, args: { documentId: Id<'documents'> }) {
    // verify if user has access to the document
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return false;
    }

    const document = await ctx.db.get(args.documentId);

    if (!document) {
        return null;
    }
    
    if (document.tokenIdentifier !== userId) {
        return null;
    }

    return {document, userId};
}

export const hasAccessToDocumentQuery = internalQuery({
    args: {
        documentId: v.id('documents'),
    },
    async handler(ctx, args) {
        return await hasAccessToDocument(ctx, {documentId: args.documentId});
    }
})

export const getDocuments = query({

    // query is what the user can request from the frontend
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return [];
        }

        // return all documents from the documents table for specific user
        return await ctx.db.query('documents')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId)).collect();
    }
})


export const getDocument = query({
    args: {
        documentId: v.id('documents'),
    },

    // query is what the user can request from the frontend
    async handler(ctx, args) {
        const accessObj = await hasAccessToDocument(ctx, {documentId: args.documentId});

        if (!accessObj) {
            throw new ConvexError('Document not found');
        }

        // return the document with the provided id
        return {
            ...accessObj.document,
            documentURL: await ctx.storage.getUrl(accessObj.document.fileId)
        };
    }
})

export const createDocument = mutation({
    //mutation is what can user send from frontend to backend
    // define arguments
    args: {
        title: v.string(),
        fileId: v.id('_storage'),
    },
    // a handler is where you write the logic for the mutation
    async handler(ctx, args) {
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
        const documentId = await ctx.db.insert('documents', { title: args.title, tokenIdentifier: userId, fileId: args.fileId, description: "" });
    
        // queue a task to fill in the description for the document
        await ctx.scheduler.runAfter(0, internal.documents.fillInDescription, {
            fileId: args.fileId,
            documentId
        })
    }

})

// mutations have to be retriable

//actions can't directly communicate with the database, 
// you will need to evoke other mutations or queries and wait for them to complete

export const fillInDescription = internalAction({
    args: {
        fileId: v.id('_storage'),
        documentId: v.id('documents'),
    },
    async handler(ctx, args) {
        const file = await ctx.storage.get(args.fileId);

        if (!file) {
            throw new ConvexError('File not found');
        }

        const text = await file.text();
        // console.log("text file: ", text);

        //use contents of file to ask OpenAI a question
        const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `
                Here is a text file: ${text}
                `},
            { role: "user", content: `Please generate a 1 sentence description for this document` }
            ],
            model: "gpt-3.5-turbo",
        })


        const response = chatCompletion.choices[0].message.content ?? "Could not generate description for this document";

        // store AI response as a chat record
        await ctx.runMutation(internal.documents.updateDocumentDescription, {
            documentId: args.documentId,
            description: response
        })

        return response;
    }
})


export const updateDocumentDescription = internalMutation({
    args: {
        documentId: v.id('documents'),
        description: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.patch(args.documentId, {
            description: args.description
        })
    }
})
// define an action to ask a question

export const askQuestion = action({
    args: {
        question: v.string(),
        documentId: v.id('documents'),
    },
    async handler(ctx, args) {
        const accessObj = await ctx.runQuery(internal.documents.hasAccessToDocumentQuery, {
            documentId: args.documentId as Id<'documents'>,
        });
        
        if (!accessObj) {
            throw new ConvexError('You do not have access to this document');
        }

        const file = await ctx.storage.get(accessObj.document.fileId);

        if (!file) {
            throw new ConvexError('File not found');
        }

        const text = await file.text();
        // console.log("text file: ", text);

        //use contents of file to ask OpenAI a question
        const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `
                Here is a text file: ${text}
                `},
            { role: "user", content: `Please answer the following question: ${args.question}` }
            ],
            model: "gpt-3.5-turbo",
        })

        // store user prompt as a chat record 
        await ctx.runMutation(internal.chats.createChatRecord, {
            documentId: args.documentId,
            text: args.question,
            isHuman: true,
            tokenIdentifier: accessObj.userId
        })

        const response = chatCompletion.choices[0].message.content ?? "Could not generate a response";

        // store AI response as a chat record
        await ctx.runMutation(internal.chats.createChatRecord, {
            documentId: args.documentId,
            text: response,
            isHuman: false,
            tokenIdentifier: accessObj.userId
        })

        return response;
    }
})

export const deleteDocument = mutation({
    args: {
        documentId: v.id('documents'),
    },
    async handler(ctx, args) {
        const accessObj = await hasAccessToDocument(ctx, {documentId: args.documentId});

        if (!accessObj) {
            throw new ConvexError('Document not found');
        }

        // delete the file from storage
        await ctx.storage.delete(accessObj.document.fileId);
        // TODO find out why using file id above and document id below
        // delete the document from the documents table
        await ctx.db.delete(args.documentId);
    }
    }
)