"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react"
import { Input } from "@/components/ui/input"; // Assuming you have a custom Input component
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ChatPanel({
    documentId
}: {
    documentId: Id<"documents">
}) {
    const askQuestion = useAction(api.documents.askQuestion);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const text = formData.get("text") as string;

        // Debugging logs
        console.log("Form submitted");
        console.log("text: ", text);
        console.log("documentId: ", documentId);

        if (!text) {
            console.error("Text is empty");
            return;
        }

        if (!documentId) {
            console.error("Document ID is missing");
            return;
        }

        try {
            await askQuestion({ question: text, documentId });
            console.log("askQuestion function called successfully");
        } catch (error) {
            console.error("Error calling askQuestion: ", error);
        }
    };

    return (
        <div className=" p-2 bg-secondary flex-col justify-between rounded">
            <div className="overflow-y-auto h-[350px] space-y-2">
                <div className={cn({
                    "bg-slate-950": true},
                    "p-2 rounded"
                )}>
                    AI: Ask any questions about the document here.
                </div>
                <div className={cn({
                    "bg-slate-800": true},
                    "p-2 rounded text-right"
                )}>
                    AI: Ask any questions about the document here.
                </div>
                {/* Chat messages go here */}
            </div>
            <div className="flex gap-1">
                <form onSubmit={handleSubmit} className="flex-1">
                    <div className="flex gap-2">
                        <Input required name="text" type="text" placeholder="Type a message..." />
                        <Button>Send</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}