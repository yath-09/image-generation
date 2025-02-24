"use client";
import { useState } from "react";
import { Wand2, Brain, Package2, CameraIcon } from "lucide-react";
import Generate from "../components/Generate";
import Packs from "../components/Packs";
import Train from "../train/page";
import { Camera } from "../components/Camera";

const tabs = [
  { title: "Camera", icon: CameraIcon, component: <Camera /> },
  { title: "Generate", icon: Wand2, component: <Generate /> },
  { title: "Train", icon: Brain, component: <Train /> },
  { title: "Packs", icon: Package2, component: <Packs /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-20">
      <div className="w-full max-w-4xl bg-gray-100 shadow-md rounded-lg p-3">
        <div className="flex border-b border-gray-300 relative">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 text-center py-3 text-gray-700 font-semibold transition-colors ${
                  activeTab === index ? "text-gray-500" : "hover:text-black"
                }`}
              >
                <div className="flex flex-col items-center">
                  <Icon className="w-5 h-5 mb-1" />
                  {tab.title}
                </div>
              </button>
            );
          })}
         
          <div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-500 to-yellow-600 transition-all duration-300 rounded-3xl"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${activeTab * 100}%)`,
            }}
          />
        </div>
      
        <div className="mt-6">{tabs[activeTab]?.component}</div>
      </div>
    </div>
  );
}
