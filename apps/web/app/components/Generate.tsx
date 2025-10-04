"use client";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { SelectModel } from "./Models";
import toast from "react-hot-toast";
import { ImagePlus, Wand2 } from "lucide-react";
import { BACKEND_URL } from "../config";
import { useCredit } from "../hooks/useCredits";
import { motion } from "framer-motion";

export default function Generate({ setActiveTab }: { setActiveTab: (tab: number) => void }) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const { refreshCredits } = useCredit();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a valid prompt.");
      return;
    }

    if (!selectedModel) {
      toast.error("Please select a model first.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        `${BACKEND_URL}/ai/generate`,
        { prompt, modelId: selectedModel, num: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 402) {
        toast.error("Insufficient credits");
        return;
      }

      toast.success("Image generation in progress!");
      refreshCredits();
      setPrompt("");
      setActiveTab(0);
    } catch (error: any) {
      if (error?.response?.status === 402) {
        toast.error("Insufficient credits");
        return;
      }
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#222222] mb-2">Generate AI Image</h2>
          <p className="text-[#666666]">Create stunning images with AI-powered generation</p>
        </div>

        {/* Step 1: Model Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#222222]">Select Model</h3>
              <p className="text-[#666666] text-sm">Choose an AI model to generate your images</p>
            </div>
          </div>
          <SelectModel selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        </div>

        {/* Step 2: Prompt Input */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#222222]">Enter Prompt</h3>
              <p className="text-[#666666] text-sm">Describe the image you want to generate</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains with a lake in the foreground..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
            />

            <div className="flex justify-center">
              <motion.button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim() || !selectedModel}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 to-[#FBA87C] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImagePlus size={20} />
                )}
                {loading ? "Generating..." : "Create Image"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
