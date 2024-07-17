import React, { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Lucide from '@/components/Base/Lucide';

import { purchaseData, setModalImage } from '@/stores/purchase'



//component

import ModalPreviewImage from '@/components/Content/Prepurchase/upload/ModalPreview'

const UploadImageComponent = ({setValue,control}:any) => {
    const [files, setFiles] = useState<File[]>([]);
    const dispatch = useAppDispatch();

    const { modalImage } = useAppSelector(purchaseData)


    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
        setValue('files', files); 
    }, [files]);


    const DeleteImage = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    }


    const onDrop = useCallback((acceptedFiles: any) => {
        console.log(acceptedFiles);
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
       
    }, []);
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
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative w-32 h-32 m-2 basis-1/4">
                            <Image
                                src={url}
                                alt="preview"
                                fill // Fill the container
                                className="object-cover rounded"
                            />
                            <div className="absolute bottom-1 right-0 flex gap-2">
                                <button
                                    type="button"
                                     onClick={() => DeleteImage(index)}
                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg "
                                >
                                    <Lucide
                                        color="#6C9AB5"
                                        icon="Trash"
                                        className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                    ></Lucide>
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(setModalImage(true))
                                    }}
                                    type="button"
                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1">
                                    <Lucide
                                        color="#6C9AB5"
                                        icon="Eye"
                                        className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                    ></Lucide>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? "active" : ""
                            } w-32 h-32  m-2 relative
                            border-dashed border-1 border-[#C8D9E3] rounded-lg
                            basis-1/4`} // Optional: Add aspect ratio control
                    >
                        <input {...getInputProps()} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center"> {/* Add absolute position to inner div */}
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
            <ModalPreviewImage isOpen={modalImage} onClose={() => dispatch(setModalImage(false))} images={previewUrls} />
        </>
    )
}

export default UploadImageComponent;