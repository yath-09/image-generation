
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

// Define Pack Type
export interface TPack {
    id: string;
    name: string;
    imageUrl1: string;
    imageUrl2: string;
    description: string;
}

export function PackCard({ id, name, imageUrl1, imageUrl2, description, selectedModelId }: TPack & { selectedModelId: string }) {
    const { getToken } = useAuth();

    const handlePackGeneration = async () => {
        if (!selectedModelId) {
            toast.error("Please select a model first!");
            return;
        }

        try {
            toast.success("Pack generation started successfully");
            const token = await getToken();
            await axios.post(
                `${BACKEND_URL}/pack/generate`,
                { packId: id, modelId: selectedModelId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            toast.error("Failed to generate the pack");
            console.error("Pack Generation Error:", error);
        }
    };

    return (
        <div className="border-2 rounded-xl p-2 hover:border-yellow-400 transition-colors">
            <div className="flex p-2 gap-2">
                <img src={imageUrl1} alt="Pack 1" className="rounded w-1/2" />
                <img src={imageUrl2} alt="Pack 2" className="rounded w-1/2" />
            </div>
            <div className="text-xl font-bold pb-2">{name}</div>
            <div className="text-sm text-gray-700 line-clamp-5 overflow-hidden">{description}</div>
            <div className="flex justify-center mt-4">
                <button onClick={handlePackGeneration} className="w-[50%] px-1 py-2 rounded-4xl my-2 hover:cursor-pointer md:w-full shadow-md transition-transform disabled:opacity-50 
             bg-gradient-to-r from-blue-500 to-yellow-600 text-white">
                    Generate Pack
                </button>
            </div>
        </div>
    );
}
