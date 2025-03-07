"use client";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { SelectModel } from "./Models";
import toast from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { ImagePlus } from "lucide-react";
import { BACKEND_URL } from "../config";

export default function Generate({setActiveTab}: {setActiveTab: (tab: number) => void}) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleGenerate = async () => {
    //not promt enter
    if (!prompt.trim()) {
      //console.log("hell")
      toast.error("Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response=await axios.post(
        `${BACKEND_URL}/ai/generate`,
        { prompt, modelId: selectedModel, num: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //console.log(response)
      if(response.status==411){
         alert("Not sufficent credits")
         return;
      }
      toast.success("Image generation in progress!");
      setPrompt("");
      setActiveTab(0)
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-6 text-[#444444]">Generate AI Image</h2>
        <h2 className="text-3xl font-semibold mb-2 text-black">Step-1 Select Model</h2>
        <h6 className=" mb-4 text-gray-600">Choose an AI model to generate your images</h6>
        
        <SelectModel selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
         
        <div className="mt-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full text-md border border-gray-300 rounded-md p-3 focus:outline-none 
               focus:ring-2 focus:ring-blue-400 focus:border-yellow-400 transition-shadow text-green-600"
            rows={4}
          />
        </div> 

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleGenerate()}
            //disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105 disabled:opacity-50 
             bg-gradient-to-r from-blue-500 to-yellow-600 text-white font-medium hover:cursor-pointer"
          >
            {loading ? <Spinner size="sm" /> : <ImagePlus size={20} />}
            {loading ? "Generating..." : "Create Image"}
          </button>

        </div>
      </div>
    </div>
  );
}
