
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { useCredit } from "../hooks/useCredits";
import { motion } from "framer-motion";
import { Package2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { ConfirmationModal } from "./ConfirmationModal";

// Define Pack Type
export interface TPack {
    id: string;
    name: string;
    imageUrl1: string;
    imageUrl2: string;
    description: string;
}

export function PackCard({
    id,
    name,
    imageUrl1,
    imageUrl2,
    description,
    selectedModelId,
    modelName,
    modelThumbnail
}: TPack & {
    selectedModelId: string;
    modelName?: string;
    modelThumbnail?: string;
}) {
    const { getToken } = useAuth();
    const { refreshCredits } = useCredit();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handlePackGeneration = async () => {
        if (!selectedModelId) {
            toast.error("Please select a model first!");
            return;
        }

        setShowConfirmation(true);
    };

    const handleConfirmGeneration = async () => {
        setIsGenerating(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${BACKEND_URL}/pack/generate`,
                { packId: id, modelId: selectedModelId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 402) {
                toast.error("Insufficient credits");
                return;
            }
            toast.success("Pack generation started successfully");
            refreshCredits();
            setShowConfirmation(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 402) {
                toast.error("Insufficient credits");
                return;
            }
            toast.error("Failed to generate the pack");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
            {/* Image Preview Section */}
            <div className="relative">
                <div className="flex h-48">
                    <div className="relative w-1/2">
                        <Image
                            src={imageUrl1}
                            alt={`${name} preview 1`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>
                    <div className="relative w-1/2">
                        <Image
                            src={imageUrl2}
                            alt={`${name} preview 2`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>
                </div>

                {/* Pack Icon Overlay */}
                <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Package2 className="w-4 h-4 text-[#FBA87C]" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#222222] mb-2 line-clamp-1">
                        {name}
                    </h3>
                    <div className="relative">
                        <p
                            className={`text-sm text-[#666666] leading-relaxed cursor-pointer hover:text-[#333333] transition-colors ${isDescriptionExpanded ? '' : 'line-clamp-3'
                                }`}
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        >
                            {description}
                        </p>
                        <div
                            className="absolute bottom-0 right-0 bg-white pl-2 cursor-pointer"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        >
                            {isDescriptionExpanded ? (
                                <ChevronUp className="w-4 h-4 text-[#666666] hover:text-[#333333] transition-colors" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-[#666666] hover:text-[#333333] transition-colors" />
                            )}
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <motion.button
                    onClick={handlePackGeneration}
                    disabled={!selectedModelId?.trim() || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-[#FBA87C] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl group-hover:scale-105 hover:cursor-pointer"
                    whileHover={{ scale: !selectedModelId?.trim() || isGenerating ? 1 : 1.02 }}
                    whileTap={{ scale: !selectedModelId?.trim() || isGenerating ? 1 : 0.98 }}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate Pack</span>
                        </>
                    )}
                </motion.button>

                {/* Status Message */}
                {!selectedModelId?.trim() && (
                    <p className="text-xs text-[#666666] text-center mt-2">
                        Select a model first to generate this pack
                    </p>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirmGeneration}
                packName={name}
                packImage1={imageUrl1}
                packImage2={imageUrl2}
                modelName={modelName || "Unknown Model"}
                modelThumbnail={modelThumbnail || ""}
                isGenerating={isGenerating}
            />
        </motion.div>
    );
}
