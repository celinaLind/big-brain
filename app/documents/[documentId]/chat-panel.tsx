"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react"
import { cn } from "@/lib/utils";
import { QuestionForm } from "./question-form";
import "./style.css"

export default function ChatPanel({
    documentId
}: {
    documentId: Id<"documents">
}) {
    const chats = useQuery(api.chats.getChatsForDocument, { documentId });


    return (
        <div className=" p-4 bg-secondary flex-col justify-between rounded-xl">
            <div className="overflow-y-auto space-y-2 pb-2 scroller">
                <div className={cn({
                    "bg-slate-900": true},
                    "p-2 rounded text-white"
                )}>
                    AI: Ask any questions about the document here.
                </div>
                {chats?.map((chat) => (
                    <div className={cn({
                        "bg-slate-900": !chat.isHuman,
                        "bg-slate-500": chat.isHuman,
                        'text-right': chat.isHuman,
                    }, "p-3 rounded whitespace-pre-line  text-white")}>
                        {chat.text}
                    </div>
                ))}
                <div id="anchor"></div>
            </div>
            <div className="flex gap-1">
                <QuestionForm documentId={documentId} />
            </div>
        </div>
    )
}