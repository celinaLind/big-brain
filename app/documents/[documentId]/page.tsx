"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function DocumentPage({
    params
}: {
    params: {
        documentId: Id<"documents">
    }
}) {
    const [loading, setLoading] = useState(true);
    // const iframeRef = useRef(null);

    const doc = useQuery(api.documents.getDocument, {
        documentId: params.documentId
    });

    useEffect(() => {
        // const iframe = iframeRef.current;
        // if (iframe && iframe.contentWindow) {
        //     iframe.onload = () => {
        //      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //     if (iframeDocument) {
        //         const style = iframeDocument.createElement('style');
        //         style.innerHTML = `
        //             body {
        //              color: white;
        //              }`;
        //         iframeDocument.head.appendChild(style);
        //     }   
        //     }

        // }

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
        <main className="p-24 pt-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">{doc.title}</h1>
            </div>
            <Tabs defaultValue="document" className="w-full">
                <TabsList>
                    <TabsTrigger value="document">Document</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                <TabsContent value="document">
                    <div className="bg-secondary p-4 rounded-xl flex-1 h-[500px] text-white">
                        {doc.documentURL &&
                            <iframe src={doc.documentURL} className="w-full h-full text-white"></iframe>
                        }
                    </div>
                </TabsContent>
                <TabsContent value="chat">
                    <ChatPanel documentId={doc._id} />
                </TabsContent>
            </Tabs>
        </main>
    )
}