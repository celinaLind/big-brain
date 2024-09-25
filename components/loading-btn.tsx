import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";


export function LoadingButton({ 
    isLoading, 
    children, 
    loadingText,
    clickHandler 
}: { 
        isLoading: boolean, 
        children: ReactNode, 
        loadingText: string ,
        clickHandler?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    }) {
    return (
        <Button disabled={isLoading} type="submit" 
        onClick={(e) => {
            clickHandler?.(e);
        }}>
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            {isLoading ? loadingText : children}</Button>
    )
}