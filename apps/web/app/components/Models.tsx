"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

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
        setModels(response.data.models || []);
        if (response.data.models?.[0]?.id) {
          setSelectedModel(response.data.models[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setModelLoading(false);
      }
    })();
  }, [getToken, setSelectedModel]);

  const availableModels = models.filter((model) => model.trainingStatus === "GENERATED");
  const pendingModels = models.filter((model) => model.trainingStatus === "PENDING");

  return (
    <div className="space-y-6">
      {modelLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#FBA87C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#666666]">Loading models...</p>
          </div>
        </div>
      ) : availableModels?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {availableModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white border-2 ${selectedModel === model.id
                ? "border-[#FBA87C] border-2 shadow-3xl scale-100"
                : "border-gray-100 shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              onClick={() => setSelectedModel(model.id)}
            >
              {/* Image Container */}
              <div className="relative w-full h-48">
                <Image
                  src={model.thumbnail}
                  alt={model.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Selection indicator */}
                {selectedModel === model.id && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-[#FBA87C] rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}


              </div>

            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#222222] mb-2">No models available</h3>
          <p className="text-[#666666]">Train a model first to start generating images</p>
        </div>
      )}

      {/* Pending models notification */}
      {pendingModels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-400 to-[#FBA87C] px-6 py-3 rounded-xl shadow-lg">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-semibold">
              {pendingModels.length} model{pendingModels.length > 1 ? 's' : ''} training in progress...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
