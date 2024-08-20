"use client";
import React, { Fragment, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form"
import Image from 'next/image';

//store
import { useAppSelector, useAppDispatch } from "@/stores/hooks";


import {
    changeFormeditPurchase,
    openModaldocument,
    purchaseData,
    setModalAdddo,

} from "@/stores/purchase"

import { sentrequestFile, setModalWatchDocument } from "@/stores/document"


import DocumentUplaodComponent from '@/components/Uploadimage/document/DocumentUploadcomponent';
import Lucide from '@/components/Base/Lucide';
import ModalPreviewImage from '@/components/CS/Content/Prepurchase/upload/ModalPreview';
import classNames from 'classnames';

const ModalwatchDocument = (

    { document,
        purchase_id
    }: {
        document: any,
        purchase_id: string

    }
) => {
    const [selectIndex, setSelectedImageIndex] = useState<any>(null);
    const [selectDocument, setSelectDocument] = useState<any>(null);
    const [modalImage, setModalImage] = useState<boolean>(false);
    const router = useRouter()
    useEffect(() => {
        console.log("dddd", document)

    }, [document])
    const dispatch = useAppDispatch()
    const methods = useForm()
    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
    } = methods;

    const { purchase
        , formEditPrepurchase,
        modalDocument,

    } = useAppSelector(purchaseData)


    //function
    const onClose = () => {
        dispatch(openModaldocument(false)) //ปิดModal
    }


    const setFunction = async (value: any, index: number, num: number) => {
        console.log("setFunction", value)
        setSelectDocument(index)
        setSelectedImageIndex(num);
        setModalImage(true);
    }

    const onSubmit = (data: any) => {
        try {
            let dataRequest = data;
            dataRequest.purchase_id = purchase_id
            console.log('dataRequest', dataRequest)
            dispatch(sentrequestFile(dataRequest))
            onClose()

            router.push('/purchase')
        }
        catch (error: any) {

            throw error
        }
    }


    function setModalPreview(value: boolean) {
        console.log("dsfdfd");
        dispatch(setModalWatchDocument(value))
    }

    useEffect(() => {
        console.log("selectIndex", selectIndex)
        console.log("selectDocument", selectDocument)
    }, [selectIndex, selectDocument])

    return (
        <>
            <div className="fixed inset-0 z-50  text-black overflow-x-auto overflow-y-auto  flex items-center justify-center bg-black bg-opacity-60">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative max-w-5xl w-full   overflow-scroll bg-white rounded-lg p-4 ">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setModalPreview(false)}
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
                        {document?.length > 0 && (
                            <div className="p-1">
                                <h1 className="mb-5  text-2xl">เอกสารเพิ่มเติม</h1>
                                <div className="grid md:grid-cols-2  grid-cols-1 gap-4">
                                    {document.map((item: any, index: number) => (
                                        <Fragment key={index}>

                                            <div key={index} className="border p-5">
                                                <h1 className="text-xl">{item.d_document_name}</h1>
                                                <label
                                                    className="block mb-2 text-gray-700  text-sm font-semibold">รูปภาพ / ไฟล์</label>
                                                <div className="w-full grid md:grid-cols-2 grid-cols-1  gap-1">

                                                    {item.d_document_file.map((file: any, num: number) =>

                                                    (


                                                        <Fragment key={num}>

                                                            <div className=" relative col-span-1  w-[200px]   h-[200px]   overflow-hidden">
                                                                <Image
                                                                    src={process.env.NEXT_PUBLIC_URL_API + file.file_path}
                                                                    alt={`Preview ${num}`}
                                                                    width={200}
                                                                    height={200}

                                                                    className=" object-cover rounded"

                                                                />
                                                                <div
                                                                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <span className="text-white text-lg font-medium">image</span>
                                                                </div>
                                                                <div className="absolute bottom-1 right-0 flex gap-2">

                                                                    <button
                                                                        onClick={() => {
                                                                            setFunction(item.d_document_file[num], index, num)
                                                                        }} // Consider passing the  image (url, index, etc.)
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

                                                        </Fragment>
                                                    ))}


                                                </div>

                                            </div>

                                        </Fragment>

                                    ))}
                                    {setModalPreview && selectIndex !== null && selectDocument !== null && (

                                        <>
                                            {selectIndex}
                                            <ModalPreviewImage isOpen={modalImage}
                                                onClose={() => setModalPreview(false)}
                                                startIndex={selectIndex}
                                                images={document[selectDocument].d_document_file} />
                                        </>
                                    )}

                                </div>
                            </div>
                        )}

                    </div>

                </form>
            </div>
        </>

    )
}

export default ModalwatchDocument;