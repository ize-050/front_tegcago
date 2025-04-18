"use client";

import React, { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Lucide from '@/components/Base/Lucide';

import { purchaseData, setModalImage } from '@/stores/purchase'

import { Document, Page } from 'react-pdf';

//component

import ModalPreviewImage from '@/components/Content/Prepurchase/upload/ModalPreview'
import { set } from 'lodash';


interface FileData {
    url: string;
    type: string;
    name: string;
  }

const EdituploadComponent = ({ setValue, control ,image}: {
    setValue: any,
    control: any
    image:any[]
}) => {
    const [files, setFiles] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const [selectIndex, setSelectedImageIndex] = useState<number>(0);
    const { modalImage } = useAppSelector(purchaseData)
    const [previewUrls, setPreviewUrls] = useState<any[]>([]);
    // useEffect(() => {

    //     const urls = files.map((file) => {
    //         let Datafile: Partial<any> = {}
    //         if (file.type === 'application/pdf') {
    //             console.log('urlrlrl', URL.createObjectURL(file))
    //             Datafile = {
    //                 url: URL.createObjectURL(file),
    //                 type: file.type,
    //                 name: file.name
    //             }
    //         }
    //         else if (file.type === 'image/jpeg' || file.type === 'image/png') {
    //             Datafile = {
    //                 url: URL.createObjectURL(file),
    //                 type: file.type,
    //                 name: file.name
    //             }
    //         }
    //         else {
    //             Datafile = {
    //                 url: URL.createObjectURL(file),
    //                 type: file.type,
    //                 name: file.name
    //             }
    //         }

    //         return Datafile

    //     });
    //     console.log('urls', urls)
    //     setPreviewUrls(urls);
    //     setValue('files', files);
    // }, [files]);

    useEffect(() => {
        const urls = files.map((file: any) => {
          if (
            file.type === 'application/pdf' ||
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'   
      
          ) {
            
            let status;
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const originalIndex = image.findIndex((img) => img.id === file.id);
                if (originalIndex !== -1 && !file.originalFile) {
                  status = 'unchanged';
                } else if (originalIndex !== -1) {
                  status = 'edited';
                } else {
                  status = 'added';
                }
              } else {
                status = file.id ? (file.originalFile ? 'edited' : 'unchanged') : 'added';
              }
              
            return {
              url: file.url,
              type: file.type,
              name: file.name,
              status: status, // Add status property
            } as FileData;
          } else {
            // Handle unsupported file types (optional)
            console.error('Unsupported file type:', file.type);
            return null; // Or throw an error if you want to stop the process
          }
        }).filter(Boolean) as FileData[]; // Filter out null values (if any)
        console.log("urls",urls)
        setPreviewUrls(urls);
        setValue('files', files);
      }, [files]);

      useEffect(() => {
        if (image) {
          const newFiles = image.map((file: any) => {
            if (file instanceof File) { // Check if file is a File object
              return {
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name,
                status: 'added', // New file from upload
              } as FileData;
            } else {
              return {
                id: file.id,
                url: file.url,
                type: "image/png", // Adjust if needed
                name: file.d_product_image_name,
                status: 'unchanged', // Existing file from database
              } as FileData;
            }
          });
      
          setPreviewUrls([...previewUrls, ...newFiles]);
          setFiles([...files, ...newFiles]); // Update files state
        }
      }, [image]);


      const onDrop = useCallback((acceptedFiles: any) => {
        const newFiles = acceptedFiles.map((file: any) => ({
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
          originalFile: file,
          status: 'added', // New file from dropzone
        }));
      
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }, []);

    useEffect(() => {
        console.log("setPreviewUrls",previewUrls)
    },[previewUrls])


    const DeleteImage = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    }


 
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            {files.length < 1 ? (
                <div className="flex flex-col flex-wrap items-center justify-center
                 
                  ">
                    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                        <input {...getInputProps()} />
                        <button type="button" className="btn ">Add File</button>
                        <p className="text-[#767676]">Drag and drop files</p>
                    </div>
                </div>
            ) :
                <div className="flex flex-wrap">
                    {/* Display Existing Images */}
                    {previewUrls.map((data, index) => {
                        const isExcel = data.name?.endsWith('.xlsx') || data.name?.endsWith('.xls') || data.name?.endsWith('.csv');
                        const isPdf = data.name?.endsWith('.pdf');
                        const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                        const url = data.url;

                        return (
                            <div key={index} className="relative w-32 h-32 m-2 basis-1/4 overflow-hidden">
                                {isPdf && (
                                    <>
                                        <div className="relative w-full h-full   overflow-hidden">
                                            <object data={url} type="application/pdf" width="100%" height="100%">
                                                <div className="flex items-center justify-center h-full">
                                                    <p className="text-gray-500">PDF Viewer not available</p>
                                                </div>

                                            </object>
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-lg font-medium">PDF</span>
                                            </div>

                                            <div className="absolute bottom-1 right-0 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => DeleteImage(index)}
                                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg "
                                                >
                                                    <Lucide
                                                        color="#6C9AB5"
                                                        icon="Trash"
                                                        className="w-5 h-5 m-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        window.open(data.url);
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
                                                    e.currentTarget.src = '/images/placeholder.jpg';
                                                }}
                                            />
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-lg font-medium">image</span>
                                            </div>
                                            <div className="absolute bottom-1 right-0 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => DeleteImage(index)}
                                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg "
                                                >
                                                    <Lucide
                                                        color="#6C9AB5"
                                                        icon="Trash"
                                                        className="w-5 h-5 m-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        dispatch(setModalImage(true))
                                                        setSelectedImageIndex(index);
                                                    }} // Consider passing the image data (url, index, etc.)
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
                                            <ModalPreviewImage isOpen={modalImage}
                                                onClose={() => dispatch(setModalImage(false))}
                                                startIndex={index}
                                                images={url} />
                                        )}
                                    </>
                                )}

                                {isExcel && (
                                    <div>
                                        <div className="relative w-full h-32  border-2   overflow-hidden">
                                            <Lucide icon="Sheet" className="absolute top-10 left-6 w-8 h-8 mx-auto text-green-500" />
                                            <h3 className="text-sm font-semibold mb-2">{data.name}</h3>
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-lg font-medium">Excel</span>
                                            </div>
                                            <div className="absolute bottom-1 right-0 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => DeleteImage(index)}
                                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg "
                                                >
                                                    <Lucide
                                                        color="#6C9AB5"
                                                        icon="Trash"
                                                        className="w-5 h-5 m-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        window.open(data.url);
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
                        );
                    })}
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? "active" : ""
                            } w-32 h-32  m-2 relative
                              border-dashed border-1 border-[#C8D9E3] rounded-lg
                              basis-1/4`} // Optional: Add aspect ratio control
                    >
                        <input {...getInputProps()} />
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center"> {/* Add absolute position to inner div */}
                            <button type="button">
                                <Lucide
                                    color="#6C9AB5"
                                    icon="FolderClosed"
                                ></Lucide>
                            </button>
                            <p className="text-[#767676]">เพิ่มไฟล์</p>
                        </div>
                    </div>
                </div>


            }

        </>
    )
}


export default EdituploadComponent