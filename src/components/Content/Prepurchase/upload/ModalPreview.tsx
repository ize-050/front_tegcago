"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Lucide from "@/components/Base/Lucide";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: any;
  startIndex?: number; // Optional: Index of the initial image to display
}

function ModalViewmage({
  isOpen,
  onClose,
  images,
  startIndex = 0,
}: PreviewModalProps) {

  // Add a click handler for the background
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the background (not on its children)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white rounded-lg p-4 ">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-[10000]"
          onClick={onClose}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Display */}
        {/* {images.length === 0 && <p className="text-center text-gray-500">No images to display</p>} */}
        <img
          src={images}
          alt="Image"
          className="object-contain"
          style={{
            maxHeight: "80vh", // Limit the height to 80% of the viewport
            maxWidth: "80vw", // Limit the width to 80% of the viewport
            width: "auto",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}

export default ModalViewmage;
