/*
    @notes folder allows for parallel routes
    a parallel route allows you to render one or more pages 
    within the same layout
    ex. will be able to show the notes navigation side panel along 
    with the single selected note page found here
*/

"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteItemButton } from "@/app/components/delete-btn";

export default function NotePage() {
    const {noteId} = useParams<{noteId: Id<"notes">}>()
    const note = useQuery(api.notes.getNote, {
        noteId: noteId
    });

    return (
        <div className="bg-secondary rounded p-4 w-full flex flex-col gap-1">
            <div className="w-full flex justify-between">
                <div className="text-xl pl-3">{note?.title}</div>
                <DeleteItemButton noteId={note?._id} itemType="note" />
            </div>
            <div className='p-3'>{note?.text}</div>
        </div>
    )
}