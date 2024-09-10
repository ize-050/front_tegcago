"use client";
import { View } from 'lucide-react';
import React, { Fragment, useState, useCallback, useEffect, use } from 'react';
import { url } from 'inspector';
import Lucide from '@/components/Base/Lucide';
import Image from 'next/image';
import { purchaseData, setModalImage } from '@/stores/purchase';
import ModalPreviewImage from "@/components/Content/Prepurchase/ModelviewImage";
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import ModalViewmage from './ModalViewImage';

const ViewImageComponent = ({
    isExcel,
    isPdf,
    isImage,
    url,
    images,
    index
}:any) => {
    const { modalImage } = useAppSelector(purchaseData);
    const dispatch = useAppDispatch();
    const [selectIndex, setSelectedImageIndex] = useState<number>(0);
    const openModal = (index: number) => {
        console.log("dd",index)
        setSelectedImageIndex(index);
        dispatch(setModalImage(true))
      };
    return (

        
        
        <Fragment>
             <div
                            key={index}
                            className="relative w-32 h-32 m-2 basis-1/4 overflow-hidden"
                          >
                            {isPdf && (
                              <>
                                <div className="relative w-full h-full   overflow-hidden">
                                  <object
                                    data={url}
                                    type="application/pdf"
                                    height={"100%"}
                                    width={"100%"}
                                  >
                                    <div className="flex items-center justify-center h-full">
                                      <p className="text-gray-500">
                                        PDF Viewer not available
                                      </p>
                                    </div>
                                  </object>
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white text-lg font-medium">
                                      PDF
                                    </span>
                                  </div>

                                  <div className="absolute bottom-1 right-0 flex gap-2">
                                    <button
                                      onClick={() => {
                                        window.open(url);
                                      }}
                                      type="button"
                                      className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                                    >
                                      <Lucide
                                        color="#6C9AB5"
                                        icon="Eye"
                                        className="w-5 h-5 m-auto"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}

                            {isImage && (
                              <>
                                <div className="relative w-full h-full   overflow-hidden">
                                  <Image
                                    src={url}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      // Placeholder or error message on image load failure
                                      e.currentTarget.src =
                                        "/images/placeholder.jpg";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white text-lg font-medium">
                                      image
                                    </span>
                                  </div>
                                  <div className="absolute bottom-1 right-0 flex gap-2">
                                    <button
                                    onClick={() => openModal(index)}
                                      type="button"
                                      className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                                    >
                                      <Lucide
                                        color="#6C9AB5"
                                        icon="Eye"
                                        className="w-5 h-5 m-auto"
                                      />
                                    </button>
                                  </div>
                                  {/* Pass data or URL to the ModalPreviewImage component */}
                                  {/* <ModalPreviewImage ... /> */}
                                </div>
                                {modalImage && selectIndex === index && (
                                  <ModalViewmage
                                    isOpen={modalImage}
                                    onClose={() =>
                                      dispatch(setModalImage(false))
                                    }
                                    images={url}
                                  />
                                )}
                              </>
                            )}

                            {isExcel && (
                              <div>
                                <div className="relative w-full h-32  border-2   overflow-hidden">
                                  <Lucide
                                    icon="Sheet"
                                    className="absolute top-10 left-6 w-8 h-8 mx-auto text-green-500"
                                  />
                                  <h3 className="text-sm font-semibold mb-2">
                                    {images.picture_name}
                                  </h3>
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white text-lg font-medium">
                                      Excel
                                    </span>
                                  </div>
                                  <div className="absolute bottom-1 right-0 flex gap-2">
                                    <button
                                      onClick={() => {
                                        window.open(url);
                                      }}
                                      type="button"
                                      className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                                    >
                                      <Lucide
                                        color="#6C9AB5"
                                        icon="Eye"
                                        className="w-5 h-5 m-auto"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
        </Fragment>
    )
}

export default ViewImageComponent;