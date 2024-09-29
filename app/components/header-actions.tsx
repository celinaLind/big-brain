'use client'
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export function HeaderActions() {
    return <>
        <Unauthenticated>
            <span className="text-white hover:text-cyan-200">
            <SignInButton /></span>
        </Unauthenticated>
        
        <Authenticated>
            <UserButton />
        </Authenticated>

        <AuthLoading>
            <span className='text-white hover:text-cyan-200'>
                Loading...
                </span>
                </AuthLoading>
    </>
}