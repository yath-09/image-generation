import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Appbar() {
    return <div className="flex justify-between p-2 border-b">
        <div className="text-xl font-bold text-amber-600">
            PhotoAI
        </div>
        <div>
            <SignedOut>
                <SignInButton/>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
}