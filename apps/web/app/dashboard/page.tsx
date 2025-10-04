"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Brain, Package2, CameraIcon } from "lucide-react";
import Generate from "../components/Generate";
import Packs from "../components/Packs";
import Train from "../train/page";
import { Camera } from "../components/Camera";

const tabs = [
  { title: "Camera", icon: CameraIcon, component: "Camera" },
  { title: "Generate", icon: Wand2, component: "Generate" },
  { title: "Train", icon: Brain, component: "Train" },
  { title: "Packs", icon: Package2, component: "Packs" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-white pt-4">
      <div className="flex flex-col items-center p-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#222222] mb-4">
              AI Photo <span className="bg-gradient-to-r from-blue-400 to-[#FBA87C] bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Transform your photos with AI-powered tools. Choose from camera capture, generation, training, or explore our packs.
            </p>
          </div>

          {/* Main Dashboard Container */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`flex-1 text-center py-4 px-6 font-semibold transition-all duration-300 relative ${activeTab === index
                        ? "text-[#222222] bg-white shadow-sm"
                        : "text-[#666666] hover:text-[#222222] hover:bg-white/50"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className={`w-6 h-6 transition-colors duration-300 ${activeTab === index ? "text-[#FBA87C]" : "text-[#666666]"
                          }`} />
                        <span className="text-sm font-medium">{tab.title}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Active Tab Indicator */}
              <motion.div
                className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-t-full"
                initial={false}
                animate={{
                  width: `${100 / tabs.length}%`,
                  x: `${activeTab * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Tab Content */}
            <motion.div
              className="p-8 bg-white"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 0 && <Camera />}
              {activeTab === 1 && <Generate setActiveTab={setActiveTab} />}
              {activeTab === 2 && <Train />}
              {activeTab === 3 && <Packs />}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
