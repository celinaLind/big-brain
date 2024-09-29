"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { DeleteItemButton } from "../../../components/delete-btn";


export default function DocumentPage({
    params
}: {
    params: {
        documentId: Id<"documents">
    }
}) {
    // const [loading, setLoading] = useState(true);
    // const iframeRef = useRef(null);

    const doc = useQuery(api.documents.getDocument, {
        documentId: params.documentId
    });

    return (
        <main className="p-24 pt-8 space-y-8">
            {!doc && (
                <>
                    <div>
                        <Skeleton className="h-[40px] w-[500px]" />
                    </div>
                    <div className="flex">
                        <Skeleton className="h-[40px] w-[80px]" />
                        <Skeleton className="h-[40px] w-[80px]" />
                    </div>
                    <Skeleton className="h-[500px]" />
                </>
            )}

            {doc &&
                (
                    // a fragment <> is used here to wrap the two elements
                    <>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold">{doc.title}</h1>
                            <DeleteItemButton documentId={doc._id} itemType="document" />
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
                    </>
                )
            }
        </main>
    )
}