"use client";

import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import GeneratedImage from "./components/GeneratedImage";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt) {
      setError('Please enter a description of what you want to generate');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating image for prompt:', prompt);
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (!data.imageUrls || data.imageUrls.length < 2) {
        throw new Error('No image URLs in response');
      }

      console.log('Generated image URLs:', data.imageUrls);
      setImages(prev => [...prev, ...data.imageUrls].slice(-8));
    } catch (error: any) {
      console.error('Error generating image:', error);
      setError(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a2e1a] to-black text-[#e8f5e8] p-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-16 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#90c890] via-[#b8e4b8] to-[#90c890] mb-8">
          Geography Landform Explorer
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Describe a geographic feature (e.g., 'cross section of Earth's layers with detailed labels')"
            className="w-full px-6 py-4 bg-black/80 border border-[#4a7a4a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#90c890] text-lg shadow-[0_0_15px_rgba(144,200,144,0.1)]"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                generateImage();
              }
            }}
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[#90c890] to-[#68a468] rounded-lg hover:shadow-[0_0_15px_rgba(144,200,144,0.3)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            onClick={generateImage}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
        
        {error && (
          <div className="text-red-400 text-center mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-8">
        {images.length > 0 ? (
          images.map((imageUrl, index) => (
            <GeneratedImage
              key={index}
              imageUrl={imageUrl}
              index={index}
            />
          ))
        ) : (
          [...Array(2)].map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-2xl bg-black/80 border border-[#4a7a4a] p-2 hover:border-[#90c890] transition-all duration-300 cursor-pointer overflow-hidden group hover:shadow-[0_0_20px_rgba(144,200,144,0.15)]"
            >
              <div className="w-full h-full rounded-xl bg-[#1a2e1a]/50 flex items-center justify-center">
                <span className="text-[#4a7a4a] group-hover:text-[#90c890] transition-colors">
                  {isLoading ? "Generating images..." : "Enter a prompt to generate images"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Icon */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <InformationCircleIcon
            className="w-8 h-8 text-[#90c890] cursor-pointer hover:text-[#b8e4b8] transition-colors"
            onClick={() => setShowTooltip(!showTooltip)}
          />
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 w-96 p-6 bg-black/90 border border-[#4a7a4a] rounded-xl shadow-lg">
              <h3 className="font-semibold mb-3 text-[#90c890]">How to Use</h3>
              <p className="text-sm text-[#e8f5e8] leading-relaxed">
                Enter a description of the geographic feature you want to visualize. Try prompts like "cross section of Earth's layers", "ocean floor features with depth zones", or "mountain formation process with labels".
              </p>
              <button 
                className="absolute top-3 right-3 text-[#4a7a4a] hover:text-[#90c890]"
                onClick={() => setShowTooltip(false)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
