'use client';
import React, { useState } from 'react';
import { ModelTypeEnum, EthenecityEnum, EyeColorEnum } from '@prisma/client';
import axios from 'axios';
import JSZip from "jszip";
import { BACKEND_URL } from '../config';
interface TrainingData {
    name: string;
    type: ModelTypeEnum;
    age: number;
    ethinicity: EthenecityEnum;
    eyeColor: EyeColorEnum;
    bald: boolean;
    images: File[];
}

import { TrainModelInput } from "common/infered"
import { useAuth } from '@clerk/nextjs';
export default function Train() {
    const [formData, setFormData] = useState<TrainingData>({
        name: '',
        type: ModelTypeEnum.Man,
        age: 0,
        ethinicity: EthenecityEnum.White,
        eyeColor: EyeColorEnum.Brown,
        bald: false,
        images: [],
    });

    const {getToken}=useAuth(); 


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.images || formData.images.length === 0) {
            alert("Please upload at least one image.");
            return;
        }
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
            alert("Images uplaoded succesfully");
            

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
            const token=await getToken();
            const response=await axios.post(`${BACKEND_URL}/ai/training`, uploadData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            //console.log(response)

            //after successfull compeltion of the code
            alert("Training data uploaded successfully");
            handleClearForm();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload training data. Please try again.");
        }
    };



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({
                ...prev,
                images: Array.from(e.target.files),
            }));
        }
        //console.log(e.target.files);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Create Model</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value as ModelTypeEnum })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">ethinicity</label>
                        <select
                            value={formData.ethinicity}
                            onChange={(e) =>
                                setFormData({ ...formData, ethinicity: e.target.value as EthenecityEnum })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700">Eye Color</label>
                        <select
                            value={formData.eyeColor}
                            onChange={(e) =>
                                setFormData({ ...formData, eyeColor: e.target.value as EyeColorEnum })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {Object.values(EyeColorEnum).map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.bald}
                            onChange={(e) => setFormData({ ...formData, bald: e.target.checked })}
                            className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Is Bald</label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.images.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                            {formData.images.length} file(s) selected: {formData.images.map((file) => file.name).join(', ')}
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handleClearForm}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Model
                    </button>
                </div>
            </form>
        </div>
    );
}
