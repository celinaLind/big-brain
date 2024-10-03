"use client"
import { Doc, Id } from "@/convex/_generated/dataModel";
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
    search: z.string().min(2,
        {
            message: "Questioning must be at least 2 characters long",
        },
    ).max(300, {
        message: "Questioning must be less than 300 characters long",
    }),
})


export function SearchForm({setResults}: {
    setResults: (type: typeof api.search.searchAction._returnType) => void;
}) {
    // figure out why search api function isn't showing
    const searchRequest = useAction(api.search.searchAction);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // An action doesn't automatically run if query updated
            // store information in the state
            await searchRequest({ search: values.search, }).then(setResults);
            form.reset();
            console.log("search function called successfully");
        } catch (error) {
            console.error("Error calling search: ", error);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
            className=" flex flex-1 gap-2">
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl >
                                <Input className="bg-slate-650 height-full p-3" placeholder="Ask a question based on notes and documents." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton
                    isLoading={form.formState.isSubmitting}
                    loadingText="Searching..."
                >Search</LoadingButton>
            </form>
        </FormProvider>
    )
}