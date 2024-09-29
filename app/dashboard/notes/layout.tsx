"use client"
import { useQuery } from "convex/react";
import CreateNoteBtn from "./create-note-btn";
import { api } from "@/convex/_generated/api";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotesPage({
    children,
}: {
    children: ReactNode,
}) {
    // useQuery to call single query and useQueries to call multiple
    // below is a commented out example of how to use
    // const [notes] = 
    // useQueries([{ 
    //   queryKey: ['notes'], queryFn: () => api.notes.getNotes() }])
    const notes = useQuery(api.notes.getNotes)
    const { noteId } = useParams<{ noteId: Id<"notes"> }>()

    return (
        <div className="w-full items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 ">
                <div className="flex justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold">My Notes</h1>
                    <CreateNoteBtn />
                </div>
                <div className="flex flex-row gap-10">
                    <ul className="space-y-2 w-[200px]">
                        {notes?.map((note) => (
                            <li key={note._id}>
                                {notes?.indexOf(note) === 0 && (
                                    <hr />
                                )}
                                <Link className={cn("p-2 text-lg hover:text-cyan-200", {
                                    "text-cyan-300": note._id === noteId,
                                })} href={`/dashboard/notes/${note._id}`}>
                                    {note.title.substring(0, 30) + " ..."}
                                </Link>
                                <hr />
                            </li>
                        ))}
                    </ul>
                    <div className="bg-secondary rounded p-4 w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}