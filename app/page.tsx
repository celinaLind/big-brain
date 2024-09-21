'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./components/document-card";
import CreateDocumentBtn from "./components/create-document-btn";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card";
import Image from 'next/image';




export default function Home() {

  const documents = useQuery(api.documents.getDocuments);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 ">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-4xl font-bold">My Documents</h1>
          <CreateDocumentBtn />
        </div>
        {!documents && (
          <div className="grid grid-cols-4 gap-4">
         {new Array(8).fill(0).map((_, i) => (
          <Card className="p-6 flex flex-col justify-between gap-2" >
          <Skeleton className="h-[40px]" />
          <Skeleton className="h-[40px]" />
          <Skeleton className=" w-[80px] h-[40px]" />
          </Card>
          ))}
          
          </div>
         )} 
         {documents && documents.length === 0 && (
        <div className="m-auto flex flex-col justify-center gap-6 items-center">
          {/* since we are querying through ALL the documents this will automatically update as changes occur */}
          <Image
            src="/documents.svg"
            width={200}
            height={200}
            alt="Girl waiting for document upload"
          />
          <h1 className="text-2xl font-bold">You have no documents</h1>
          <CreateDocumentBtn />
        </div>
         )}
        {documents && documents.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {/* since we are querying through ALL the documents this will automatically update as changes occur */}
          {documents?.map((doc) => <DocumentCard document={doc} />)}
        </div>
         )}
      </main>
    </div>
  );
}
