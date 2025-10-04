'use client';
import React, { useState } from 'react';
import { ModelTypeEnum, EthenecityEnum, EyeColorEnum } from '@prisma/client';
import axios from 'axios';
import JSZip from "jszip";
import { BACKEND_URL } from '../config';
import { motion } from 'framer-motion';
interface TrainingData {
    name: string;
    type: ModelTypeEnum;
    age: number;
    ethinicity: EthenecityEnum;
    eyeColor: EyeColorEnum;
    bald: boolean;
    images: File[];
}
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
export default function Train() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TrainingData>({
        name: '',
        type: ModelTypeEnum.Man,
        age: 0,
        ethinicity: EthenecityEnum.White,
        eyeColor: EyeColorEnum.Brown,
        bald: false,
        images: [],
    });

    const { getToken } = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.images || formData.images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        setLoading(true);
        try {
            // 1. Create a ZIP file with all images
            const zip = new JSZip();
            formData.images.forEach((image, index) => {
                zip.file(`image_${index + 1}.${image.name.split(".").pop()}`, image);
            });

            const zipBlob = await zip.generateAsync({ type: "blob" });
            // 2. Get the presigned URL from the backend for the ZIP file
            const { data } = await axios.get(`${BACKEND_URL}/presigned-url`);
            //console.log(data)
            if (!data.url || !data.key) {
                throw new Error("Failed to get pre-signed URL");
            }

            //3. Upload the ZIP file to S3 using the pre-signed URL
            await axios.put(data.url, zipBlob, {
                headers: { "Content-Type": "application/zip" },
            });
            //alert("Images uplaoded succesfully");


            // 4. Send form data with the ZIP file URL considering the imp point of mathcing the spellings of data with the backend
            const uploadData = {
                name: formData.name,
                type: formData.type,
                age: formData.age,
                ethinicity: formData.ethinicity,
                eyeColor: formData.eyeColor,
                bald: formData.bald,
                zipUrl: data.url, // Store the ZIP file's S3 URL
            };

            //console.log(uploadData);
            const token = await getToken();
            await axios.post(`${BACKEND_URL}/ai/training`, uploadData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            //after successfull compeltion of the code
            toast.success("Data uploaded successfully for Training Model");
            handleClearForm();
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload training data. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files as FileList);

            setFormData((prev) => {
                // Create a Set of existing file names to avoid duplicates
                const existingFileNames = new Set(prev.images.map(file => file.name + file.size + file.lastModified));

                // Filter out duplicate files
                const uniqueNewFiles = newFiles.filter(file =>
                    !existingFileNames.has(file.name + file.size + file.lastModified)
                );

                return {
                    ...prev,
                    images: [...prev.images, ...uniqueNewFiles],
                };
            });
        }
        // Reset the input value to allow selecting the same files again if needed
        e.target.value = '';
    };

    const handleClearForm = () => {
        setFormData({
            name: '',
            type: ModelTypeEnum.Man,
            age: 0,
            ethinicity: EthenecityEnum.White,
            eyeColor: EyeColorEnum.Brown,
            bald: false,
            images: [],
        });
    };

    const handleDeleteImage = (indexToDelete: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToDelete),
        }));
    };

    const handleClearAllImages = () => {
        setFormData((prev) => ({
            ...prev,
            images: [],
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-[#222222] mb-2">Train AI Model</h2>
                    <p className="text-[#666666]">Create a custom AI model with your photos</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8"
                >
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-[#222222] border-b border-gray-200 pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#222222]">Model Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200"
                                    placeholder="Enter model name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#222222]">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value as ModelTypeEnum })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    {Object.values(ModelTypeEnum).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#222222]">Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200"
                                    min="0"
                                    placeholder="Enter age"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#222222]">Ethnicity</label>
                                <select
                                    value={formData.ethinicity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ethinicity: e.target.value as EthenecityEnum })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    {Object.values(EthenecityEnum).map((ethinicity) => (
                                        <option key={ethinicity} value={ethinicity}>
                                            {ethinicity.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#222222]">Eye Color</label>
                                <select
                                    value={formData.eyeColor}
                                    onChange={(e) =>
                                        setFormData({ ...formData, eyeColor: e.target.value as EyeColorEnum })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBA87C] focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    {Object.values(EyeColorEnum).map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.bald}
                                    onChange={(e) => setFormData({ ...formData, bald: e.target.checked })}
                                    className="h-5 w-5 text-[#FBA87C] border-gray-300 rounded focus:ring-[#FBA87C]"
                                />
                                <label className="text-sm font-medium text-[#222222]">Is Bald</label>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-[#222222] border-b border-gray-200 pb-2">Training Images</h3>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-[#222222]">Upload Images (More images leads to better results)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FBA87C] transition-colors duration-200">
                                <input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-[#FBA87C] rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-[#666666] font-medium">Click to upload images</p>
                                    <p className="text-sm text-[#666666] mt-1">Select multiple photos • PNG, JPG, JPEG up to 10MB each</p>
                                    <p className="text-xs text-[#999999] mt-1">You can add more photos anytime</p>
                                </label>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium text-[#222222]">
                                            {formData.images.length} file{formData.images.length > 1 ? 's' : ''} selected:
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleClearAllImages}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.images.map((file, index) => (
                                            <div key={`${file.name}-${file.size}-${file.lastModified}`} className="bg-white px-3 py-2 rounded-lg text-sm text-[#666666] border flex items-center gap-2 shadow-sm">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-medium">{file.name}</div>
                                                        <div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 flex-shrink-0 p-1 rounded hover:bg-red-50"
                                                    title="Delete image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <motion.button
                            type="button"
                            onClick={handleClearForm}
                            className="px-6 py-3 border border-gray-300 text-[#666666] font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Clear Form
                        </motion.button>

                        <motion.button
                            type="submit"
                            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-400 to-[#FBA87C] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            )}
                            {loading ? "Training Model..." : "Create Model"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
