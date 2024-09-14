import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";


export function LoadingButton({ 
    isLoading, 
    children, 
    loadingText 
}: { 
        isLoading: boolean, 
        children: ReactNode, 
        loadingText: string 
    }) {
    return (
        <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            {isLoading ? loadingText : children}</Button>
    )
}