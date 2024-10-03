"use client"
import { useState } from "react";
import { SearchForm } from "./search-form";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export default function SearchPage() {
    const [results, setResults] = 
    useState<typeof api.search.searchAction._returnType>(null);
    
    return (
        <div className="w-full items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 ">
                <div className="flex justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold">Search</h1>
                </div>
                <SearchForm setResults={setResults} />
                <ul className="space-y-4">
                {results?.map((result) => {
                     return  <li className="text-white bg-slate-800 rounded p-4">
                        { result.type==='notes' && (
                        <div className="rounded bg-cyan-500">
                            Note
                        </div>
                    )}
                    {result.type === "documents" && (
                        <div className="rounded bg-purple-500">
                            Document
                        </div>
                    )

                    }
                        <h4>{
                            result.title
                        }</h4>
                        {result.text.substring(0, 500) + "..."}
                    </li>  
                    
                })}</ul>
            </main>
        </div>
    );
}