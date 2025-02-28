"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Spinner} from "flowbite-react";

interface TModel {
    id: string;
    thumbnail: string;
    name: string;
    trainingStatus: "GENERATED" | "PENDING";
}

export function SelectModel({
    setSelectedModel,
    selectedModel,
}: {
    setSelectedModel: (model: string) => void;
    selectedModel?: string;
}) {
    const { getToken } = useAuth();
    const [modelLoading, setModelLoading] = useState(true);
    const [models, setModels] = useState<TModel[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${BACKEND_URL}/models`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // console.log(response)
                setModels(response.data.models);
                setSelectedModel(response.data.models[0]?.id);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            } finally {
                setModelLoading(false);
            }
        })();
    }, []);

    return (
        <div className="max-w-4xl my-6">
            {modelLoading ? (
                <div className="flex justify-center">
                    <Spinner aria-label="Large spinner example" size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {models
                        .filter((model) => model.trainingStatus === "GENERATED")
                        .map((model) => (
                            <div
                                key={model.id}
                                className={`cursor-pointer border p-1 rounded-lg shadow-md transition-transform hover:scale-105 ${selectedModel === model.id ? "border-yellow-400 bg-gradient-to-r from-[#FBA87C] to-yellow-400" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedModel(model.id)}
                            >
                                <img src={model.thumbnail} alt={model.name} className="rounded-md w-full h-[80%]" />
                                <h3 className={`text-center font-medium h-[10%] ${selectedModel === model.id ? "text-white":"text-gray-800"}`}>{model.name}</h3>
                            </div>

                        ))}
                </div>
            )}
            {/* for not trained models */}
            {models.some((model) => model.trainingStatus !== "GENERATED") && (
                <p className="text-gray-500 mt-4 text-center">More models are being trained...</p>
            )}
        </div>
    );
}
