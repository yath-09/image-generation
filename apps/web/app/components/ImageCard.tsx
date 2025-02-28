export interface TImage {
    id: string;
    status: string;
    imageUrl: string;
}

const DEFAULT_BLUR_IMAGE =
    "https://static.vecteezy.com/system/resources/thumbnails/016/894/217/small/white-background-white-polished-metal-abstract-white-gradient-background-blurred-white-backdrop-illustration-vector.jpg";

import { useState } from "react";

export function ImageCard({ id, status, imageUrl }: TImage) {
    const [isOpen, setIsOpen] = useState(false);
    const isGenerated = status.toLowerCase() === "generated" && imageUrl !== "";

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
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
        }
    };

    return (
        <>
            <div
                className="rounded-xl border-2 max-w-[400px] cursor-pointer flex p-1 hover:shadow-lg transition-shadow"
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={isGenerated ? imageUrl : DEFAULT_BLUR_IMAGE}
                    className="rounded w-full"
                    alt="Generated preview"
                />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-0 right-0 text-gray-700 hover:text-black hover:cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        >
                             ✖
                        </button>
                        <img
                            src={imageUrl}
                            className="rounded-lg w-full max-h-[70vh] object-contain"
                            alt="Expanded preview"
                        />
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-yellow-600 text-white rounded-lg hover:cursor-pointer shadow-md transition-transform hover:scale-105"
                            >
                                Download Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


