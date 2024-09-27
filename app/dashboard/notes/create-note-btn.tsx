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
import { CreateNoteForm } from "./create-note-form";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useToast } from "@/hooks/use-toast";


export default function CreateDocumentBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast()

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {/* asChild passes trigger styling to the child */}
      {/* click listener automatically applied to btn */}
      <DialogTrigger asChild>
        <Button className={btnStyles}>
          <PlusIcon className={btnIconStyles} />
          Create Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            <p className="mb-2">Add a note for you to search over in the future</p>
            <CreateNoteForm onCreate={() => {
              setIsOpen(false)

              // add toast to bottom of page telling user the note has been created
              toast({
                title: "Note Created",
                description: "Your note has been created successfully",
              })
            }} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  );
}