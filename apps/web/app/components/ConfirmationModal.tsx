"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package2, Sparkles } from "lucide-react";
import Image from "next/image";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    packName: string;
    packImage1: string;
    packImage2: string;
    modelName: string;
    modelThumbnail: string;
    isGenerating?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    packName,
    packImage1,
    packImage2,
    modelName,
    modelThumbnail,
    isGenerating = false,
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[#222222]">Confirm Generation</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    disabled={isGenerating}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <div className="text-center">
                                    <p className="text-[#666666] mb-4">
                                        Are you sure you want to generate this pack with the selected model?
                                    </p>
                                </div>

                                {/* Pack Preview */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Package2 className="w-5 h-5 text-[#FBA87C]" />
                                        <h3 className="font-semibold text-[#222222]">Pack: {packName}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                            <Image
                                                src={packImage1}
                                                alt={`${packName} preview 1`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                            <Image
                                                src={packImage2}
                                                alt={`${packName} preview 2`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Model Preview */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                        <h3 className="font-semibold text-[#222222]">Model: {modelName}</h3>
                                    </div>
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                        <Image
                                            src={modelThumbnail}
                                            alt={modelName}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 border-t border-gray-100">
                                <button
                                    onClick={onClose}
                                    disabled={isGenerating}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-[#666666] font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isGenerating}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-[#FBA87C] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
