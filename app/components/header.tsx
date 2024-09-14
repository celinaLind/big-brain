
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HeaderActions } from "./header-actions";


export function Header() {
    return <div className="bg-slate-900 py-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="header-text text-2xl">BigBrain</div>
            <div className="flex gap-4 items-center">
                <ModeToggle />
                <HeaderActions />
            </div>
        </div>
    </div>
}