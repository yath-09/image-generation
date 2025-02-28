"use client";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { ImageCard, TImage } from "./ImageCard";

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
    },[]);

    // Polling for Pending Images with max 3 polls
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 3;

    useEffect(() => {
        const hasPending = images.some((img) => img.status.toLowerCase() === "pending");
        if (!hasPending) return; // Exit if no pending images
        const interval = setInterval(async () => {
            if (attempts >= maxAttempts) {
                clearInterval(interval); // Stop polling after 3 attempts
                return;
            }

            try {
                const token = await getToken();
                const response = await axios.get(`${BACKEND_URL}/image/bulk`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setImages(response.data.images);
                setAttempts(prev => prev + 1); // Increment attempt count
            } catch (error) {
                console.error("Error polling images:", error);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [images]);

    console.log(images)
    return (
        <>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-2 pt-4">
                {images.map((image) => (
                    <ImageCard key={image.id} {...image} />
                    // <ImageCardSkeleton/>
                ))}
            </div>
            {imagesLoading && (
                <div className="flex items-center w-full justify-center">
                    <SkeletonLoader />
                </div>
            )}
        </>
    );
}


export function SkeletonLoader() {
    return (
      <div className="relative overflow-hidden bg-gray-200 rounded-md h-10 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-900 animate-shimmer" />
      </div>
    );
  }
  

