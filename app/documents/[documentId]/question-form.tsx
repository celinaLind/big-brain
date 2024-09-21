"use client"
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input"; // Assuming you have a custom Input component
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/loading-btn";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
    text: z.string().min(2,
        {
            message: "Questioning must be at least 2 characters long",
        },
    ).max(300, {
        message: "Questioning must be less than 300 characters long",
    }),
})


export function QuestionForm({ documentId }: { documentId: Id<'documents'> }) {

    const askQuestion = useAction(api.documents.askQuestion);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // await askQuestion({ question: values.text, documentId });
            //TODO: fix form reset (it is maintaining the text in the input field)
            form.reset();
            console.log("askQuestion function called successfully");
        } catch (error) {
            console.error("Error calling askQuestion: ", error);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
            className=" flex flex-1 gap-2">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl >
                                <Input className="bg-slate-650 height-full p-3" placeholder="Ask AI any question about the document." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton
                    isLoading={form.formState.isSubmitting}
                    loadingText="Sending..."
                >Send</LoadingButton>
            </form>
        </FormProvider>
    )
}