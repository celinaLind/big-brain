import CreateNoteBtn from "./create-note-btn";

export default function NotesPage() {
    return (
        <div className="w-full items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 ">
                <div className="flex justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold">My Notes</h1>
                    <CreateNoteBtn />
                </div>
            </main>
        </div>
    );
}