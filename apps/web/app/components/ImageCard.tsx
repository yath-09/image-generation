export interface TImage {
    id: string;
    status: string;
    imageUrl: string;
}


import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export function ImageCard({ id, status, imageUrl }: TImage) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const isGenerated = status.toLowerCase() === "generated" && imageUrl !== "";

    const handleDownload = async () => {
        if (isDownloading) return;

        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            const response = await axios.get(imageUrl, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloadProgress(progress);
                    }
                }
            });

            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `image-${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    return (
        <>
            <div
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => isGenerated && setIsOpen(true)}
            >
                <div className="relative w-full h-48">
                    <Image
                        src={isGenerated ? imageUrl : "/gear-spinner.svg"}
                        alt="Generated preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        unoptimized={!isGenerated}
                    />

                    {/* Status indicator */}
                    <div className="absolute top-2 right-2">
                        {isGenerated ? (
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Ready
                            </div>
                        ) : (
                            <div className="bg-[#FBA87C] text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                Processing
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isOpen && isGenerated && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-[50vw] h-[50vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Download Button */}
                        <div className="absolute top-4 left-4 z-10">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`relative flex items-center gap-2 px-3 py-2 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 overflow-hidden ${isDownloading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-400 to-[#FBA87C] hover:shadow-xl hover:scale-105'
                                    }`}
                            >
                                {/* Progress Bar Background */}
                                {isDownloading && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-[#FBA87C] opacity-30"></div>
                                )}

                                {/* Progress Bar Fill */}
                                {isDownloading && (
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-[#FBA87C] transition-all duration-300 ease-out"
                                        style={{ width: `${downloadProgress}%` }}
                                    ></div>
                                )}

                                {/* Icon */}
                                <div className="relative z-10">
                                    {isDownloading ? (
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Text */}
                                <span className="relative z-10 text-sm">
                                    {isDownloading ? `${downloadProgress}%` : 'Download'}
                                </span>

                                {/* Success Animation */}
                                {isDownloading && downloadProgress === 100 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-500 animate-pulse">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={imageUrl}
                                alt="Generated Image"
                                fill
                                className="object-contain"
                                // sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


