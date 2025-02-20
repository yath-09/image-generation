"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    caption: "Family Moments",
  },
  {
    url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    caption: "Precious Memories",
  },
  {
    url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    caption: "Special Times",
  },
];

export const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] overflow-hidden rounded-2xl bg-gray-900">
      {/* Image Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[index]?.url}
            alt={images[index]?.caption}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-white text-2xl font-light">{images[index]?.caption}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
