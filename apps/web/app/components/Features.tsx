"use client";

import { motion } from "framer-motion";
import { Camera, Wand2, Users, Clock } from "lucide-react";

const features = [
    {
        icon: <Camera className="w-6 h-6 text-white" />,
        title: "Professional Quality",
        description: "Studio-grade portraits generated in seconds",
        gradient: "from-blue-400 to-[#FBA87C]",
    },
    {
        icon: <Wand2 className="w-6 h-6 text-white" />,
        title: "Magic Editing",
        description: "Advanced AI tools to perfect every detail",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: <Users className="w-6 h-6 text-white" />,
        title: "Family Collections",
        description: "Create stunning portraits for the whole family",
        gradient: "from-pink-500 to-red-500",
    },
    {
        icon: <Clock className="w-6 h-6 text-white" />,
        title: "Instant Delivery",
        description: "Get your photos in minutes, not days",
        gradient: "from-red-500 to-orange-500",
    },
];

export function Features() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
        >
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-xl bg-white border border-[#FBA87C] shadow-lg transition-all duration-500 hover:bg-gradient-to-r hover:from-[#FBA87C] hover:to-[#FF7E5F] hover:scale-105 flex flex-col h-full"
                >
                    <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center transition-all duration-500 group-hover:from-[#222222] group-hover:to-[#4F46E5]`}
                    >
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-[#222222] mt-4 transition-all duration-500 hover:text-white">
                        {feature.title}
                    </h3>
                    <p className="text-[#666666] mt-2 transition-all duration-500 hover:text-white">
                        {feature.description}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}
