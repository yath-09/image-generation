'use client';
import React, { useState } from 'react';
import { ModelTypeEnum, EthenecityEnum, EyeColorEnum } from '@prisma/client';

interface TrainingData {
  name: string;
  type: ModelTypeEnum;
  age: number;
  ethnicity: EthenecityEnum;
  eyeColor: EyeColorEnum;
  isBald: boolean;
  images: File[];
}

export default function Train() {
  const [formData, setFormData] = useState<TrainingData>({
    name: '',
    type: ModelTypeEnum.Man,
    age: 0,
    ethnicity: EthenecityEnum.White,
    eyeColor: EyeColorEnum.Brown,
    isBald: false,
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('type', formData.type);
    uploadData.append('age', formData.age.toString());
    uploadData.append('ethnicity', formData.ethnicity);
    uploadData.append('eyeColor', formData.eyeColor);
    uploadData.append('isBald', formData.isBald.toString());

    formData.images.forEach((image) => {
      uploadData.append('images', image);
    });

    console.log('Submitting FormData:', uploadData.keys);
    alert('Training data uploaded successfully');
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

  const handleCancel = () => {
    setFormData({
      name: '',
      type: ModelTypeEnum.Man,
      age: 25,
      ethnicity: EthenecityEnum.White,
      eyeColor: EyeColorEnum.Brown,
      isBald: false,
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
            <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
            <select
              value={formData.ethnicity}
              onChange={(e) =>
                setFormData({ ...formData, ethnicity: e.target.value as EthenecityEnum })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.values(EthenecityEnum).map((ethnicity) => (
                <option key={ethnicity} value={ethnicity}>
                  {ethnicity.replace(/_/g, ' ')}
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
              checked={formData.isBald}
              onChange={(e) => setFormData({ ...formData, isBald: e.target.checked })}
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
            onClick={handleCancel}
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
