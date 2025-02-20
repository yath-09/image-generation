"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
export function Appbar() {
    return <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100 backdrop-blur-md border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <span className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent px-4 py-2 rounded transition-opacity hover:opacity-80">Photo AI</span>
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
                    <button className="bg-primary hover:bg-primary-dark text-text px-6 py-2 rounded-full transition-colors">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </button>
                </motion.div>
            </div>
        </div>
    </nav>
}