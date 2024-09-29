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

export default function NotePage() {
    const {noteId} = useParams<{noteId: Id<"notes">}>()
    const note = useQuery(api.notes.getNote, {
        noteId: noteId
    });

    return (
        <div>
            {note?.text}
        </div>
    )
}