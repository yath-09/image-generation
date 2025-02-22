"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "../data";

export function Testimonials() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mt-20 mb-20"
    >
      <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#FBA87C] to-blue-400 bg-clip-text text-transparent">
        Loved by Creators
      </h2>
      <p className="text-gray-500 text-center mb-12 text-lg">
        Join thousands of satisfied users who have transformed their portraits
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="p-6 rounded-xl bg-white border border-[#FBA87C] shadow-lg transition-all duration-500 hover:bg-gradient-to-r hover:from-[#FBA89C] hover:to-[#FF7E9F] hover:scale-105 flex flex-col h-full relative"
          >
            {/* Avatar Image */}
            <div className="absolute -top-6 left-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FBA87C]">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Star Icon */}
            <Star className="absolute top-4 right-4 text-yellow-500 w-6 h-6" />

            {/* Testimonial Text */}
            <p className="text-[#222222] mb-4 mt-6 transition-all duration-500 group-hover:text-white">
              {testimonial.text}
            </p>

            {/* Author Details */}
            <div>
              <p className="font-semibold bg-gradient-to-r from-[#FBA87C] to-blue-400 bg-clip-text text-transparent">
                {testimonial.author}
              </p>
              <p className="text-sm text-gray-500 transition-all duration-500 group-hover:text-white">
                {testimonial.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
