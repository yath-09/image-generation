"use client";
import { useState, useRef } from "react";
import { Tabs, TabsRef, Button } from "flowbite-react";
import { Wand2, Brain, Package2,CameraIcon } from "lucide-react";
import Generate from "../components/Generate";
import Packs from "../components/Packs";
import Train from "../train/page";
import { Camera } from "../components/Camera";

// // Components for each tab
// const Generate = () => <div className="p-4 text-gray-800">Generate Content</div>;
// const Train = () => <div className="p-4 text-gray-800">Train Your Model</div>;
// const Packs = () => <div className="p-4 text-gray-800">Available Packs</div>;

export default function Dashboard() {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-20">
      {/* Tabs Navigation */}
      <div className="w-full max-w-4xl bg-gray-100 shadow-md rounded-lg p-6 items-center">
      <Tabs
        aria-label="Dashboard Tabs"
        variant="default"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item active title="Camera" icon={CameraIcon}>
          <Camera/>
        </Tabs.Item>

        <Tabs.Item active title="Generate" icon={Wand2}>
          <Generate />
        </Tabs.Item>
        <Tabs.Item title="Train" icon={Brain}>
          <Train />
        </Tabs.Item>
        <Tabs.Item title="Packs" icon={Package2}>
          <Packs />
        </Tabs.Item>
      </Tabs>
      </div>
    </div>
  );
}
