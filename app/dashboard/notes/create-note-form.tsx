"use client"

// zod is a parsing library that validates the raw user input based on criteria you set
import { string, z } from "zod"
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
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { LoadingButton } from "@/components/loading-btn"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(1, 
   {
     message: "Note title must be at least 1 characters long",
  },
).max(50, {
    message: "Note title must be less than 50 characters long",
}),
    text: z.string().min(1, 
      {
        message: "Notes must be at least 1 character long",
     },
   ).max(2500, {
       message: "Notes must be less than 2500 characters",
   }),
})

// TODO: update comments on this page


export function CreateNoteForm({ onCreate }: { onCreate: () => void }) {
    // Define a mutation hook.
    // This will create a new note with the title provided.
  const createNote = useMutation(api.notes.createNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    await createNote({
        title: values.title,
        text: values.text,
    })
    
    // Close the dialog
    onCreate()
  }

    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                rows={8} 
                placeholder="Your note ..." {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton 
            isLoading={form.formState.isSubmitting}
            loadingText="Creating..."
        >Create</LoadingButton>
      </form>
    </Form>
    )
}