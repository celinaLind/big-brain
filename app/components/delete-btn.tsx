import { LoadingButton } from "@/components/loading-btn"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { btnIconStyles, btnStyles } from "@/styles/styles"
import { useMutation } from "convex/react"
import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

//type param is if the item type is document or note 

export function DeleteItemButton({ documentId, noteId, itemType }: { documentId?: Id<'documents'>, noteId?: Id<"notes">, itemType: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    if(!documentId && !noteId) {
        console.log("Error: you are missing an id")
    }

    const deleteItem = documentId ? useMutation(api.documents.deleteDocument) : useMutation(api.notes.deleteNote);
    const router = useRouter();

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger>
                <Button variant={"destructive"} className={btnStyles} 
                onClick={() => {
                    setIsOpen(true)
                }}>
                    <TrashIcon className={btnIconStyles} /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this {itemType}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {itemType}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction> */}
                        <LoadingButton
                            isLoading={isLoading}
                            clickHandler={() => { 
                                setIsLoading(true)
                                if (documentId) {
                                    deleteItem({ documentId })
                                } else if (noteId) {
                                    deleteItem({ noteId })
                                }
                                router.push(`/dashboard/${itemType}s`)
                                setIsLoading(false)
                                // .catch((error) => {
                                //     console.error("Error deleting document:", error);
                                //     // Optionally, you can show an error message to the user here
                                // })
                                // // .then(() => {
                                // //     router.push("/");
                                // // })
                                // .finally(() => {
                                // })
                            }}
                            loadingText="Deleting..."
                        >
                            Delete
                        </LoadingButton>
                    {/* </AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}