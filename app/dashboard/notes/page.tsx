/*
    Since we have created a layout file with parallel routing 
    this page has become the fallback page when a note 
    has note been selected
*/
"use client"

export default function NotesPage() {
    return (
        <div className="w-full items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)] text-xl">
            Please Select Note
        </div>
    );
}