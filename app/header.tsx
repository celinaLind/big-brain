'use client'
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";


export function Header() {
    return <div className="bg-slate-900 py-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl">BigBrain</div>
            <div>
                <Unauthenticated>
                    <SignInButton />
                </Unauthenticated>
                <Authenticated>
                    <div className="flex gap-4">
                        <ModeToggle />
                        <UserButton />
                    </div>
                </Authenticated>
            </div>
        </div>
    </div>
}