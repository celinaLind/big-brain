'use client'

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { DocumentCard } from "./components/document-card";
import CreateDocumentBtn from "./components/create-document-btn";



export default function Home() {

  const documents = useQuery(api.documents.getDocuments);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 ">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-4xl font-bold">My Documents</h1>
          <CreateDocumentBtn />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* since we are querying through ALL the documents this will automatically update as changes occur */}
          {documents?.map((doc) => <DocumentCard document={doc} />)}
        </div>
      </main>
    </div>
  );
}
