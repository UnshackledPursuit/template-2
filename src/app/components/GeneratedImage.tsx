"use client";

import { Copy, Download } from "lucide-react";
import { useState } from "react";

interface GeneratedImageProps {
  imageUrl: string;
  index: number;
}

export default function GeneratedImage({ imageUrl, index }: GeneratedImageProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // For modern browsers
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
      } catch (err) {
        // Fallback for browsers that don't support clipboard.write
        const img = document.createElement('img');
        img.src = imageUrl;
        document.body.appendChild(img);
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(img);
        selection?.removeAllRanges();
        selection?.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(img);
      }
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    } catch (err) {
      console.error("Failed to copy image:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-landform-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 1000);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  return (
    <div className="aspect-square rounded-2xl bg-black/80 border border-[#4a7a4a] p-2 hover:border-[#90c890] transition-all duration-300 overflow-hidden group hover:shadow-[0_0_20px_rgba(144,200,144,0.15)] relative">
      <img
        src={imageUrl}
        alt={`Generated landform ${index + 1}`}
        className="w-full h-full object-cover rounded-xl"
      />
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className={`p-2 bg-black/80 rounded-lg hover:bg-black transition-all ${
            copySuccess ? "scale-110" : ""
          }`}
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4 text-[#90c890]" />
        </button>
        <button
          onClick={handleDownload}
          className={`p-2 bg-black/80 rounded-lg hover:bg-black transition-all ${
            downloadSuccess ? "scale-110" : ""
          }`}
          title="Download image"
        >
          <Download className="w-4 h-4 text-[#90c890]" />
        </button>
      </div>
    </div>
  );
} 