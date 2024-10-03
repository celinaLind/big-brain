"use client";

import { cn } from "@/lib/utils";
import { Clipboard, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
    // how to get the current pathname in url
    const pathname = usePathname();

    // TODO: Refractor code to remove duplications
    // TODO: update color stylings to co-oberate with light and dark view


    return (
            <nav className="flex">
                <ul className="flex flex-col gap-4">
                    <li className={cn("text-xl flex gap-2 items-center hover:text-cyan-300",  
                        {'text-cyan-400': pathname.endsWith("/documents") || pathname.includes("/dashboard/documents/")})}>
                        <LayoutDashboard className="w-6 h-6" />
                        <Link href="/dashboard/documents">Documents</Link>
                    </li>
                    <li className={cn("text-xl flex gap-2 items-center hover:text-cyan-300",  
                        {'text-cyan-400': pathname.endsWith("/notes") || pathname.includes("/dashboard/notes/")})}>
                        <Clipboard className="w-6 h-6" />
                        <Link href="/dashboard/notes">Notes</Link>
                    </li>
                    <li className={cn("text-xl flex gap-2 items-center hover:text-cyan-300",  
                        {'text-cyan-400': pathname.endsWith("/search") || pathname.includes("/dashboard/search/")})}>
                        <Clipboard className="w-6 h-6" />
                        <Link href="/dashboard/search">Search</Link>
                    </li>
                    <li className={cn("text-xl flex gap-2 items-center hover:text-cyan-300",  
                        {'text-cyan-400': pathname.endsWith("/settings") || pathname.includes("/dashboard/settings/")})}>
                        <Settings className="w-6 h-6" />
                        <Link href="/dashboard/settings">Settings</Link>
                    </li>
                </ul>
            </nav>
    );
}
