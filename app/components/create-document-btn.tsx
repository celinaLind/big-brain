"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { UploadDocumentForm } from "./upload-document-form";
import { useState } from "react";

  
  export default function CreateDocumentBtn() {
    const [isOpen, setIsOpen] = useState(false);
    return ( 
          <Dialog onOpenChange={setIsOpen} open={isOpen}>
            {/* asChild passes trigger styling to the child */}
            {/* click listener automatically applied to btn */}
          <DialogTrigger asChild>
            <Button>Upload Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a Document</DialogTitle>
              <DialogDescription>
                Upload a team document for you to search over in the future.

                <UploadDocumentForm onUpload={() => setIsOpen(false)} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        
    );
}