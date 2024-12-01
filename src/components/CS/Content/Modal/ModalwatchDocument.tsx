"use client";
import React, { Fragment, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

//store
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

import {
  changeFormeditPurchase,
  openModaldocument,
  purchaseData,
  setModalAdddo,
} from "@/stores/purchase";

import { sentrequestFile, setModalWatchDocument } from "@/stores/document";

import DocumentUplaodComponent from "@/components/Uploadimage/document/DocumentUploadcomponent";
import Lucide from "@/components/Base/Lucide";
import ModalPreviewImage from "@/components/CS/Content/Prepurchase/upload/ModalPreview";
import classNames from "classnames";
import ViewImageComponent from "@/components/Content/StatusPurchase/Modalstatus/ViewImagecomponent";

const ModalwatchDocument = ({
  document,
  purchase_id,
}: {
  document: any;
  purchase_id: string;
}) => {
  const [selectIndex, setSelectedImageIndex] = useState<any>(null);
  const [selectDocument, setSelectDocument] = useState<any>(null);
  const [modalImage, setModalImage] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    console.log("dddd", document);
  }, [document]);
  const dispatch = useAppDispatch();
  const methods = useForm();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;

  const { purchase, formEditPrepurchase, modalDocument } =
    useAppSelector(purchaseData);

  //function
  const onClose = () => {
    dispatch(openModaldocument(false)); //ปิดModal
  };

  const setFunction = async (value: any, index: number, num: number) => {
    console.log("setFunction", value);
    setSelectDocument(index);
    setSelectedImageIndex(num);
    setModalImage(true);
  };

  const onSubmit = (data: any) => {
    try {
      let dataRequest = data;
      dataRequest.purchase_id = purchase_id;
      console.log("dataRequest", dataRequest);
      dispatch(sentrequestFile(dataRequest));
      onClose();

      router.push("/purchase");
    } catch (error: any) {
      throw error;
    }
  };

  function setModalPreview(value: boolean) {
    console.log("dsfdfd");
    dispatch(setModalWatchDocument(value));
  }

  useEffect(() => {
    console.log("selectIndex", selectIndex);
    console.log("selectDocument", selectDocument);
  }, [selectIndex, selectDocument]);

  return (
    <>
       <div className="text-black  bg-opacity-60 bg-black  opacity-100 justify-center items-center flex  fixed inset-0 z-50 outline-none focus:outline-none">
       <div className="relative w-full my-6 mx-auto max-w-5xl  max-h-[700px]  overflow-scroll">
        <div className="border-2 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative max-w-5xl w-full  bg-white rounded-lg p-4 ">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {document?.length > 0 ? (
              <div className="p-1">
                <h1 className="mb-5   text-2xl">เอกสารเพิ่มเติม</h1>
                <div className="grid md:grid-cols-2  grid-cols-1 gap-4">
                  {document.map((item: any, index: number) => (
                    <Fragment key={index}>
                      <div key={index} className="border p-5">
                        <h1 className="text-xl">{item.d_document_name}</h1>
                        <label className="block mb-2 text-gray-700  text-sm font-semibold">
                          รูปภาพ / ไฟล์เอกสาร
                        </label>
                        <div className="w-ful">
                          {item.d_document_file.map(
                                (images: any, index: number) => {

                                    const isExcel =
                                      images.file_name?.endsWith(".xlsx") ||
                                      images.file_name?.endsWith(".xls") ||
                                      images.file_name?.endsWith(".csv");
                                    const isPdf = images.file_name?.endsWith(".pdf");
                                    const isImage = images.file_name?.endsWith('.jpg') || images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                                    const url =
                                      process.env.NEXT_PUBLIC_URL_API +
                                      images.file_path;
            
                                    return(
                                    <>
                                      <ViewImageComponent
                                        isExcel={isExcel}
                                        isPdf={isPdf}
                                        isImage={isImage}
                                        url={url}
                                        images={images}
                                        index={index}
                                      ></ViewImageComponent>
                                      <div className="flex flex-col mt-2 ">
                                  {item.d_document_key === "document_etc" && (
                                    <>
                                      <label className="block mb-2 text-gray-700  text-sm font-bold">
                                       <b style={{color: '#6C9AB5'}}> หมายเหตุเอกสาร</b>
                                        <span className="text-red-500">*</span>{" "}
                                      </label>
                                      {item.d_document_etc}
                                    </>
                                      )}
                                    </div>
                                     
                                    </>)
                                  }
                            )
                        }
                        </div>
                      </div>
                    </Fragment>
                  ))}
                  {setModalPreview &&
                    selectIndex !== null &&
                    selectDocument !== null && (
                      <>
                        {selectIndex}
                        <ModalPreviewImage
                          isOpen={modalImage}
                          onClose={() => setModalPreview(false)}
                          startIndex={selectIndex}
                          images={document[selectDocument].d_document_file}
                        />
                      </>
                    )}
                </div>
              </div>
            ) : (
                <>
              <div className="p-1">
                <h1 className="mb-5 text-center border-b-2 border-gray-200 pb-2  text-2xl">เอกสารเพิ่มเติม</h1>
              </div>

              <div className="flex justify-center items-center">
                <p className="text-gray-500 flex items-center gap-2">
                    
                  <Lucide icon="File" className="w-5 h-5" />
                  <span>ไม่มีเอกสารเพิ่มเติม</span>
                </p>
              </div>
            </>
            )}
          </div>
        </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default ModalwatchDocument;
