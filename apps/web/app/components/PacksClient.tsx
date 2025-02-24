"use client";

import { useState } from "react";
import { SelectModel } from "./Models";
import { PackCard, TPack } from "./PackCard";

export function PacksClient({ packs, loading }: { packs: TPack[]; loading: boolean }) {
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>();

    return (
        <div className="flex justify-center">
            <div className="pt-4 max-w-2xl w-full">
                <h2 className="text-3xl font-semibold mb-2 text-black">Step-1 Select Model</h2>
                <h6 className=" mb-4 text-gray-600">Choose an AI model to generate your images</h6>
                
                <SelectModel selectedModel={selectedModelId} setSelectedModel={setSelectedModelId} />

                <h2 className="text-3xl font-semibold mb-2 text-black">Step-2 Select Pack</h2>
                <h6 className=" mb-4  text-gray-600">Chose a pack to generate images with</h6>
                {loading ? (
                    <div className="text-center text-gray-500">Loading packs...</div>
                ) : packs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                        {packs.map((pack) => (
                            <PackCard key={pack.id} selectedModelId={selectedModelId || ""} {...pack} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No packs available.</div>
                )}
            </div>
        </div>
    );
}

