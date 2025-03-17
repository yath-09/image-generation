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
        <div className="max-w-5xl my-6">
        {modelLoading ? (
          <div className="flex justify-center">
            <Spinner aria-label="Loading models" size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models
              .filter((model) => model.trainingStatus === "GENERATED")
              .map((model) => (
                <div
                  key={model.id}
                  className={`relative cursor-pointer rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform ${
                    selectedModel === model.id ? "" : ""
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  {/* Image */}
                  <img src={model.thumbnail} alt={model.name} className={`w-full h-full object-cover rounded-xl ${
                    selectedModel === model.id ? "border-green-600 border-4" : "border-gray-300"
                  }`} />
      
                  {/* Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity`}>
                    <h3 className="text-lg font-bold text-white text-center">{model.name}</h3>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {/* Message for non-trained models */}
        {models.some((model) => model.trainingStatus !== "GENERATED") && (
          <p className="text-gray-500 mt-6 text-center">More models are being trained...</p>
        )}
      </div>
      
    );
}
