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


export function DeleteDocumentButton({ documentId }: { documentId: Id<'documents'> }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteDocument = useMutation(api.documents.deleteDocument)
    const router = useRouter();

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger>
                <Button variant={"destructive"} className={btnStyles} 
                onClick={() => {
                    setIsOpen(true)
                }}>
                    <TrashIcon className={btnIconStyles} />
                    Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction> */}
                        <LoadingButton
                            isLoading={isLoading}
                            clickHandler={() => { 
                                setIsLoading(true)
                                deleteDocument({ documentId })
                                router.push("/")
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