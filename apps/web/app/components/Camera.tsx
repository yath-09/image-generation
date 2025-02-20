"use client";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { ImageCard, ImageCardSkeleton, TImage } from "./ImageCard";

export function Camera() {
    const [images, setImages] = useState<TImage[]>([]);
    const [imagesLoading, setImagesLoading] = useState(true);
    const { getToken } = useAuth();

    // Initial Fetch
    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${BACKEND_URL}/image/bulk`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setImages(response.data.images);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setImagesLoading(false);
            }
        })();
    }, []);

    // Polling for Pending Images
    // useEffect(() => {
    //     const hasPending = images.some((img) => img.status.toLowerCase() !== "generated");
    //     if (!hasPending) return; // Exit if no pending images

    //     const interval = setInterval(async () => {
    //         try {
    //             const token = await getToken();
    //             const response = await axios.get(`${BACKEND_URL}/image/bulk`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    //             setImages(response.data.images);
    //         } catch (error) {
    //             console.error("Error polling images:", error);
    //         }
    //     }, 5000); // Poll every 5 seconds

    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, [images]); // Only rerun if `images` changes

    return (
        <>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-2 pt-4">
            {images.map((image) => (
                <ImageCard key={image.id} {...image} />
            ))}
        </div>
        {imagesLoading && (
            <div className="flex items-center w-full justify-center">
                <SkeletonLoader/>
            </div>
        )}
        </>
    );
}


export function SkeletonLoader() {
    return <div className="animate-pulse bg-gray-300 rounded-md h-10 w-full" />;
}
  
