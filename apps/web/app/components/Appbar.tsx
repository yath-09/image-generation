"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export function Appbar() {
    const router=useRouter();
    return <nav className="fixed top-0 md:left-30 md:right-30 z-50 bg-gray-100 backdrop-blur-xl border-b border-gray-100 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <span className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent px-4 py-2 rounded transition-opacity hover:opacity-80 hover:cursor-pointer" onClick={()=>router.push('/')}>Photo AI</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-8"
                >
                    <button className="text-[#444444] transition-colors hover:cursor-pointer">
                        About
                    </button>
                    <button className="text-[#444444] transition-colors hover:cursor-pointer">
                        Features
                    </button>
                    <SignedOut>
                        <div className="bg-amber-200 px-4 md:py-2 rounded-xl text-md bg-gradient-to-r from-blue-400 to-[#FBA87C] text-[#222222] hover:scale-105 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"><SignInButton /></div>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </motion.div>
            </div>
        </div>
    </nav>
}