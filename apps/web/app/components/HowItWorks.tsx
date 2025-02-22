"use client";

import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";
import { Card } from "flowbite-react";

const steps = [
  {
    icon: <Upload className="w-6 h-6 text-[#222222]" />, // Dark Gray Icon
    title: "Upload Your Photo",
    description: "Start by uploading any portrait photo you'd like to enhance",
  },
  {
    icon: <Wand2 className="w-6 h-6 text-[#222222]" />, // Dark Gray Icon
    title: "AI Magic",
    description:
      "Our advanced AI transforms your photo into stunning portraits",
  },
  {
    icon: <Download className="w-6 h-6 text-[#222222]" />, // Dark Gray Icon
    title: "Download & Share",
    description: "Get your enhanced portraits in multiple styles instantly",
  },
];

export function HowItWorks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 mt-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#222222]">
          How It {" "}
          <span className="bg-gradient-to-r from-blue-400 to-[#FBA87C] bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="text-[#666666] max-w-2xl mx-auto">
          Transform your photos into stunning AI-powered portraits in three
          simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <Card className="relative text-center p-6 rounded-xl bg-white border border-[#FBA87C] shadow-lg hover:cursor-pointer hover:scale-105">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-[#FBA87C] flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#222222] mt-4">
                {step.title}
              </h3>
              <p className="text-[#666666] mt-2">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
