"use client";
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

//store
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

import {
  changeFormeditPurchase,
  openModaldocument,
  purchaseData,
} from "@/stores/purchase";

import { sentrequestFile } from "@/stores/document";

import DocumentUplaodComponent from "@/components/Uploadimage/document/DocumentUploadcomponent";


const ModalDocument = ({
  document,
  purchase_id,
  input_etc,
}: {
  document: any;
  purchase_id: string;
  input_etc?: string;
}) => {
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

  useEffect(()=>{
      console.log('document',document)
  },[document])

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

  return (
    <>
      <div className="text-black  bg-opacity-60 bg-black  opacity-100 justify-center items-center flex  fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-5xl  max-h-[700px]  overflow-scroll">
          <div className="border-2 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative max-w-5xl w-screen bg-white rounded-lg p-4 ">
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {document?.length > 0 && (
                  <div className="p-1">
                    <h1 className="mb-5  text-2xl">เอกสารเพิ่มเติม</h1>
                    <div className="grid grid-cols-2 gap-4">
                      {document.map((item: any, index: number) => (
                        <Fragment key={index}>
                          <div key={index} className="border p-5">
                            <h1 className="text-xl">{item.d_document_name}</h1>

                            <div className="w-full  flex flex-col">
                              <label className="block mb-2 text-gray-700  text-sm font-semibold">
                                เพิ่มรูปภาพ / ไฟล์
                              </label>
                              <DocumentUplaodComponent
                                setValue={setValue}
                                control={control}
                                name={item.d_document_key}
                                image={item.d_document_file}
                                document_id={item.id}
                              ></DocumentUplaodComponent>
                            </div>
                            <br></br>
                            {item.d_document_key === "document_etc" && (
                              <>
                                <label className="block mb-2 text-gray-700  text-sm font-bold">
                                  หมายเหตุเอกสาร{" "}
                                  <span className="text-red-500">*</span>{" "}
                                </label>
                                {item.d_document_etc}
                              </>
                            )}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end  rounded-b">
                  <button
                    style={{
                      border: "1px solid #417CA0",
                      color: "#305D79",
                      marginRight: "5px",
                    }}
                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onClose()}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDocument;
