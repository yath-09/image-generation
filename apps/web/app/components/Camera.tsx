"use client";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { ImageCard, TImage } from "./ImageCard";
import { motion } from "framer-motion";

export function Camera() {
    const [images, setImages] = useState<TImage[]>([]);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreImages, setHasMoreImages] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const { getToken } = useAuth();

    const maxAttempts = 3;
    const imagesPerPage = 10;

    // Reusable API call function
    const fetchImagesFromAPI = useCallback(async (page: number) => {
        const token = await getToken();
        const response = await axios.get(`${BACKEND_URL}/image/bulk`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: imagesPerPage,
                pageNumber: page,
            },
        });
        return response.data.images || [];
    }, [getToken, imagesPerPage]);

    // Fetch images function
    const fetchImages = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            const newImages = await fetchImagesFromAPI(page);

            if (append) {
                setImages(prev => [...prev, ...newImages]);
            } else {
                setImages(newImages);
            }

            // Check if there are more images - only set to false when we get 0 images
            setHasMoreImages(newImages.length > 0);
            return newImages;
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
    }, [fetchImagesFromAPI]);

    // Load more function
    const loadMoreImages = async () => {
        if (loadingMore || !hasMoreImages) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const newImages = await fetchImages(nextPage, true);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error("Error loading more images:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        const loadImages = async () => {
            setImagesLoading(true);
            await fetchImages(1, false);
            setCurrentPage(1);
            setImagesLoading(false);
        };
        loadImages();
    }, [fetchImages]);

    // Polling for pending images
    useEffect(() => {
        const hasPending = images.some((img) => img.status.toLowerCase() === "pending");
        if (!hasPending || attempts >= maxAttempts) return;

        const interval = setInterval(async () => {
            const updatedImages = await fetchImages(1, false);
            const stillHasPending = updatedImages.some((img: TImage) => img.status.toLowerCase() === "pending");

            setAttempts(prev => prev + 1);

            if (!stillHasPending || attempts + 1 >= maxAttempts) {
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [images, attempts, fetchImages]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#222222] mb-2">Your Generated Images</h2>
                <p className="text-[#666666]">View and download your AI-generated photos</p>
            </div>

            {/* Images Grid */}
            {imagesLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-[#FBA87C] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#666666]">Loading your images...</p>
                    </div>
                </div>
            ) : images.length > 0 ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-4 grid-cols-2 gap-4"
                    >
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ImageCard {...image} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Load More Button */}
                    {images.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex justify-center mt-8"
                        >
                            {hasMoreImages ? (
                                <button
                                    onClick={loadMoreImages}
                                    disabled={loadingMore}
                                    className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${loadingMore
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-400 to-[#FBA87C] text-white hover:shadow-xl hover:scale-105 hover:-translate-y-1'
                                        }`}
                                >
                                    {loadingMore ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Loading More...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Load More Images
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-[#666666] text-sm">
                                        You've seen all your images! No more to load.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                </>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#222222] mb-2">No images yet</h3>
                    <p className="text-[#666666]">Generate your first AI image to see it here!</p>
                </div>
            )}
        </div>
    );
}


export function SkeletonLoader() {
    return (
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-10 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-900 animate-shimmer" />
        </div>
    );
}


