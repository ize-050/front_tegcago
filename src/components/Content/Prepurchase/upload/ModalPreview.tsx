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
    const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
    console.log('imageerwss',images)
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



    if (!isOpen) return null;

    return (
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
                     src={images[currentIndex].url}
                    alt={'Image'}
                    width={800}
                    height={600}
                    className="w-full  object-contain"></Image>



                {/* Image Navigation */}
                {/*<div className="flex w-full">*/}
                {/*    <div className="mt-4 flex-1 justify-start">*/}
                {/*        <button  type="button" onClick={handlePrev} className="mr-4 px-4 py-2 bg-gray-200 rounded flex-grow-0"> /!* Add flex-grow-0 *!/*/}
                {/*            <Lucide icon="ArrowLeft" />*/}
                {/*        </button>*/}
                {/*    </div>*/}

                {/*    <div className="mt-4 flex-1 justify-end">*/}
                {/*        <button type="button" onClick={handleNext} className="float-right px-4 py-2 bg-gray-200 rounded flex-grow-0"> /!* Add flex-grow-0 *!/*/}
                {/*            <Lucide icon="ArrowRight" />*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}

export default ModalPreviewImage