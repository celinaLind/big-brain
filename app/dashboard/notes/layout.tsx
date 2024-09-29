"use client"
import { useQuery } from "convex/react";
import CreateNoteBtn from "./create-note-btn";
import { api } from "@/convex/_generated/api";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from 'next/image';

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

    const hasNotes = notes && notes.length > 0;

    return (
        <div className="w-full items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 ">

                <div className="flex justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold">My Notes</h1>
                    <CreateNoteBtn />
                </div>
                {!hasNotes && (
                    <div className="p-8 pt-12 flex flex-col justify-center gap-12 items-center">
                        {/* Where was this image found? */}
                        <Image
                            src="/documents.svg"
                            width={200}
                            height={200}
                            alt="Girl waiting for note creation"
                        />
                        <h1 className="text-2xl font-bold">You have no notes</h1>
                        <CreateNoteBtn />
                    </div>
                )}
                {hasNotes && (
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
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}