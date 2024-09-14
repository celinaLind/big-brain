"use client"

// zod is a parsing library that validates the raw user input based on criteria you set
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { Loader2 } from "lucide-react"
import { LoadingButton } from "@/components/loading-btn"

const formSchema = z.object({
  title: z.string().min(2, 
   {
     message: "Document title must be at least 2 characters long",
  },
).max(50, {
    message: "Document title must be less than 50 characters long",
}),
})


export function UploadDocumentForm({ onUpload }: { onUpload: () => void }) {
    // 3. Define a mutation hook.
    // This will create a new document with the title provided.
  const createDocument = useMutation(api.documents.createDocument);

     // 1. Define your form.
    //  z.infer through the formSchema allows us to have more type safe code
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //sleep 2 seconds to show loader
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    await createDocument(values)
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
                <Input placeholder="Business Document" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
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