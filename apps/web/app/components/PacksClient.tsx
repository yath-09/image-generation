"use client";

import { useState, useEffect } from "react";
import { SelectModel } from "./Models";
import { PackCard, TPack } from "./PackCard";
import { motion } from "framer-motion";
import { Package2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface TModel {
    id: string;
    thumbnail: string;
    name: string;
    trainingStatus: "GENERATED" | "PENDING";
}

export function PacksClient({ packs, loading }: { packs: TPack[]; loading: boolean }) {
    const { getToken } = useAuth();
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>();
    const [models, setModels] = useState<TModel[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${BACKEND_URL}/models`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setModels(response.data.models || []);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        })();
    }, [getToken]);

    const selectedModel = models.find(model => model.id === selectedModelId);

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                            <Package2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-[#222222] mb-2">AI Image Packs</h2>
                    <p className="text-[#666666]">Choose from curated packs to generate stunning images</p>
                </div>

                {/* Step 1: Model Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            1
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#222222]">Select Model</h3>
                            <p className="text-[#666666] text-sm">Choose an AI model to generate your images</p>
                        </div>
                    </div>
                    <SelectModel selectedModel={selectedModelId} setSelectedModel={setSelectedModelId} />
                </div>

                {/* Step 2: Pack Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            2
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#222222]">Select Pack</h3>
                            <p className="text-[#666666] text-sm">Choose a pack to generate images with</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-8 h-8 border-4 border-[#FBA87C] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[#666666]">Loading packs...</p>
                            </div>
                        </div>
                    ) : packs.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {packs.map((pack, index) => (
                                <motion.div
                                    key={pack.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <PackCard
                                        selectedModelId={selectedModelId || ""}
                                        modelName={selectedModel?.name}
                                        modelThumbnail={selectedModel?.thumbnail}
                                        {...pack}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                                <Package2 className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#222222] mb-2">No packs available</h3>
                            <p className="text-[#666666]">Check back later for new image packs!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

