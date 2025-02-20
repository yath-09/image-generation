"use client"
import { motion } from "framer-motion";
import { ImageCarousel } from "./ImageCarousel";
import { useRouter } from "next/navigation";

const Hero = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">
            <main className="pt-10">
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
                            Generate Photos for you and your Family
                        </h1>
                        <p className="text-xl text-[#666666] max-w-2xl mx-auto">
                            Create stunning, personalized family portraits using our advanced AI
                            technology. Transform your memories into art.
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
                                Start Creating Your Family Memories
                            </h2>
                            <button className="bg-[#FBA87C] text-[#222222] px-8 py-3 rounded-full text-lg hover:cursor-pointer" onClick={()=>router.push('/dashboard')}>
                                Try Photo AI Now
                            </button>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Hero;