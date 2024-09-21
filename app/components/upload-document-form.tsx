"use client"

// zod is a parsing library that validates the raw user input based on criteria you set
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createDocument } from "@/convex/documents"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { LoadingButton } from "@/components/loading-btn"
import { Id } from "@/convex/_generated/dataModel"

const formSchema = z.object({
  title: z.string().min(2, 
   {
     message: "Document title must be at least 2 characters long",
  },
).max(50, {
    message: "Document title must be less than 50 characters long",
}),
    file: z.instanceof(File),
})


export function UploadDocumentForm({ onUpload }: { onUpload: () => void }) {
    // 3. Define a mutation hook.
    // This will create a new document with the title provided.
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

     // 1. Define your form.
    //  z.infer through the formSchema allows us to have more type safe code
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = await generateUploadUrl();

    const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": values.file.type },
        body: values.file,
    });
    const { storageId } = await result.json();

    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    await createDocument({
        title: values.title,
        fileId: storageId as Id<'_storage'>,
    })
    // Close the dialog
    onUpload()
  }

    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription>
                        Displayed as the title of the document.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input 
                {...fieldProps}
                type="file" 
                accept=".txt,.xml,.doc"
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                        onChange(file)
                    }
                }}
                />
              </FormControl>
              <FormDescription>
                Choose a file to upload.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton 
            isLoading={form.formState.isSubmitting}
            loadingText="Uploading..."
        >Upload</LoadingButton>
      </form>
    </Form>
    )
}