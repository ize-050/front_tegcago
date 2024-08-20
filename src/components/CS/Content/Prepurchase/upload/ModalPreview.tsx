"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Lucide from "@/components/Base/Lucide";


interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: any[];
    startIndex: number; // Optional: Index of the initial image to display
}

function ModalPreviewImage({ isOpen, onClose, images, startIndex  }: PreviewModalProps) {
    const [currentIndex, setCurrentIndex] = useState<any>(null);
    const [preview, setPreview] = useState<any>();
    
    useEffect(() => {
        setCurrentIndex(startIndex); // Reset index when modal opens
    }, [isOpen, startIndex]);

    // const handlePrev = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    // };
    //
    // const handleNext = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    // };

    useEffect(() => {
        setCurrentIndex(startIndex); // Reset index when modal opens

    },[startIndex])
    useEffect(() => {
        
        images = images.map((image:any) => {
            if(image?.file_path){
                return {
                    ...image,
                    url: process.env.NEXT_PUBLIC_URL_API + image.file_path,
                };
            }
            else{
                return {
                    ...image,
                }
            }

        });

        setPreview(images);
        console.log("image1111s",images)
    },[images])


    useEffect(() => {
        // if (currentIndex < 0) {
        //     setCurrentIndex(preview.length - 1);
        // } else if (currentIndex >= preview.length) {
        //     setCurrentIndex(0);
        // }

        console.log("preview",preview)
    },[ preview]);

  
    return (
        <>
        {isOpen  && currentIndex !==null  && (
            <div className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative max-w-lg bg-white rounded-lg p-4 ">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Display */}
                {/*{images.length === 0 && <p className="text-center text-gray-500">No images to display</p>}*/}

                    <Image
                     src={preview[currentIndex]?.url}
                    alt={'Image'}
                    width={800}
                    height={600}
                    className="w-full  object-contain"></Image>

                

              

            </div>
        </div>)
        }
      </> 
    );
}

export default ModalPreviewImage