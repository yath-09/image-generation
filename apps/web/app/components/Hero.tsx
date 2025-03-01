"use client"
import { motion } from "framer-motion";
import { ImageCarousel } from "./ImageCarousel";
import { useRouter } from "next/navigation";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";
import { Testimonials } from "./Testinomials";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const Hero = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">
            <main className="pt-8">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5 }}
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
                    <ImageCarousel />
                </section>

                <section className="bg-primary/10 mb-6 mt-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5 }}
                        >
                            <h2 className="text-3xl font-semibold text-[#222222] mb-8">
                                Transform Your Photos with AI Magic
                            </h2>
                            <SignedOut>

                                <SignInButton mode="modal">
                                    <div
                                        className="flex items-center justify-center"
                                    >
                                        <span className="group relative px-8 py-4 text-lg bg-gradient-to-r from-blue-400 to-[#FBA87C] text-[#222222] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:cursor-pointer hover:text-white flex items-center sm:w-[40%] md:w-[30%] lg:w-[20%] justify-center">
                                            Try Photo AI Now
                                        </span>
                                    </div>
                                </SignInButton>

                            </SignedOut>
                            <SignedIn>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="group relative px-8 py-4 text-lg bg-gradient-to-r from-blue-400 to-[#FBA87C] text-[#222222] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:cursor-pointer hover:text-white"
                                >
                                    Go to Dashboard
                                </button>
                            </SignedIn>

                        </motion.div>
                    </div>
                </section>

                <HowItWorks />

                <Features />
                <Testimonials />

            </main>
        </div>
    );
};

export default Hero;