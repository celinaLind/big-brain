
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HeaderActions } from "./header-actions";
import Link from "next/link";


export function Header() {
    return <div className="bg-slate-900 py-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-12 item-center">
            <Link href="/" className="header-text text-2xl">BRAINIAX</Link>
            <nav className="m-auto">
                <Link href='/dashboard' className="text-white hover:text-cyan-200">Documents</Link>
            </nav>
            </div>
            <div className="flex gap-4 items-center">
                <ModeToggle />
                <HeaderActions />
            </div>
        </div>
    </div>
}