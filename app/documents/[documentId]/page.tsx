"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react"
import { useEffect, useState } from "react";

export default function DocumentPage({
    params
}: {
    params: {
        documentId: Id<"documents">
    }
}) {
    const [loading, setLoading] = useState(true);

    const doc = useQuery(api.documents.getDocument, {
        documentId: params.documentId
    });

    useEffect(() => {

        setTimeout(() => {
            setLoading(false);
        }, 500);

    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            Loading...
        </div>
    }

    if (!doc) {
        return <div className="flex justify-center items-center h-screen">
            You don't have access to view this document
        </div>
    }

    return (
        <main className="p-24 space-y-8">
            {/* <div className="flex flex-col gap-4"> */}
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">{doc.title}</h1>
                </div>
                <div className="flex gap-12">
                    <div className="bg-secondary p-4 rounded flex-1 h-[600px]">
                    {doc.documentURL &&
                        <iframe src={doc.documentURL} className="w-full h-full"></iframe>
                    }
                    </div>
                    <div className="w-[300px] bg-secondary"></div>
                </div>

            {/* </div> */}
        </main>
    )
}