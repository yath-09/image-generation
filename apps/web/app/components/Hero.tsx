"use client"
import { motion } from "framer-motion";
import { ImageCarousel } from "./ImageCarousel";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";
import { Testimonials } from "./Testinomials";

const Hero = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">
            <main className="pt-8">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block bg-primary/30 text-[#444444] px-4 py-1 rounded-full text-sm mb-4">
                            AI-Powered Photo Generation
                        </span>
                        <h1 className="text-5xl font-bold text-[#222222] mb-6">
                            Transform your photos into <span className="bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">AI-enhanced portraits</span>
                        </h1>
                        <p className="text-xl text-[#666666] max-w-2xl mx-auto">
                        Photo AI helps you create stunning, AI-enhanced portraits effortlessly. Turn any photo into a masterpiece with our advanced AI technology.
                        </p>
                    </motion.div>
                    {/* <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <ImageCarousel />
                    </motion.div> */}
                    <ImageCarousel />
                </section>

                <section className="bg-primary/10 mb-6 mt-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-3xl font-semibold text-[#222222] mb-8">
                                 Transform Your Photos with AI Magic
                            </h2>
                            <button className="bg-gradient-to-r from-blue-400 to-[#FBA87C] text-[#222222] px-8 py-3 rounded-full text-lg hover:cursor-pointer" onClick={() => router.push('/dashboard')}>
                                Try Photo AI Now
                            </button>
                        </motion.div>
                    </div>
                </section>

                <HowItWorks />

                <Features />
                <Testimonials/>

            </main>
        </div>
    );
};

export default Hero;