'use client'

import { api } from "@/convex/_generated/api";
import { SignInButton, UserButton} from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";

export default function Home() {

  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocument);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <button onClick={() => createDocument({ title: "Hello, World!" })}
        >Click Me</button>

        {/* since we are querying through ALL the documents this will automatically update as changes occur */}
        {documents?.map((doc) => (
          <div key={doc._id}>{doc.title}</div>  
        ))}
      </Authenticated>
      </main>
    </div>
  );
}
