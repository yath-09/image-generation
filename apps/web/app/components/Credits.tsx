"use client";

import { Coins, Plus } from "lucide-react";
import { useCredit } from "../hooks/useCredits";


export default function Credit() {
    const { credits, loading } = useCredit();

    return (
        <>
            {loading ? (
                <span className="text-[#444444] transition-colors hover:cursor-pointer animate-pulse">Loading...</span>
            ) : (
                <div className="flex items-center space-x-2 px-4 py-2">
                    <span className="transition-colors hover:cursor-pointer font-medium">{credits} </span>
                    <Coins />
                </div>
            )}
        </>
    );

}
