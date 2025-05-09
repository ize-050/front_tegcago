"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import router from "next/navigation";
import {
  purchaseData,
  setDocument,
  setModalAdddo,
  sentrequestFile,
} from "@/stores/purchase";
import { Controller, useForm } from "react-hook-form";
import moment from "moment/moment";
import { setOpenToast } from "@/stores/util";

//service

const ModalAdddocument = () => {
  const dispatch = useAppDispatch();
  const { purchase, document } = useAppSelector(purchaseData);
  const [document_type, setDocument_type] = useState<any[]>([]);
  const [etc, setEtc] = useState<boolean>(false);
  const [inputEtc, setInputEtc] = useState<string>("");
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      d_num_date: "",
      d_end_date: "",
      document_type: [],
    },
  });

  const setShowModal = (data: boolean) => {
    dispatch(setModalAdddo(data));
  };

  const CheckboxChange = (data: any) => {
    let document = document_type;
    if (document.includes(data)) {
      document = document.filter((item) => item.key !== data.key);

      if (data.key === "document_etc") {
        setEtc(false);
        setInputEtc("");
      }

      setDocument_type(document);
    } else {
      setDocument_type([...document_type, data]);

      if (data.key === "document_etc") {
        setEtc(true);
      }
    }
  };

  const onSubmit = (data: any) => {
    let data_send: Partial<any> = {
      d_purchase_id: purchase.id,
      d_num_date: data.d_num_date,
      d_end_date: data.d_end_date,
      document_type: document_type,
      input_etc: inputEtc,
    };

    dispatch(sentrequestFile(data_send)).then((res: any) => {
      console.log("res", res);
      if (res.payload.status === 200) {
        setShowModal(false);
      } else {
        setOpenToast({
          type: "error",
          message: "ส่งคำร้องเอกสารไม่สำเร็จ",
        });
      }
    });
  };

  return (
    <>
       <div className="text-black    bg-opacity-60 bg-black  opacity-100 justify-center items-center flex  fixed inset-0 z-50 outline-none focus:outline-none">
       <div className="relative w-full my-6 mx-auto max-w-5xl  max-h-[700px]  overflow-scroll">
        <div className="border-2 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*content*/}
          <div className="relative max-w-5xl w-full  bg-white rounded-lg p-4 ">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-1xl font-semibold">ร้องขอเอกสาร</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {}}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={"p-6"}>
                <div className="bg-gray-200 p-2 rounded-md flex-col  md:flex-row  mb-5 mt-5">
                  <div className="w-full">
                    <label className="block mb-2 text-lg text-gray-500   font-semibold">
                      ใบเสนอราคา
                    </label>
                    <p>{purchase?.book_number}</p>
                  </div>

                  <div className="flex flex-row">
                    <div className="w-full  w-1/2 flex flex-col">
                      <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">
                        ชื่อเซลล์
                      </label>
                      {purchase?.d_purchase_emp?.length > 0 && (
                        <p>{purchase?.d_purchase_emp[0].user?.fullname}</p>
                      )}

                      {/*<p>{customer_detail.customer_emp[0].user.fullname}</p>*/}
                    </div>
                    <div className="w-full   w-1/2 flex flex-col">
                      <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">
                        วันที่/เวลา
                      </label>
                      {moment(purchase?.created_at).format("DD/MM/YYYY HH:mm")}
                      {/*<p>{customer_detail.cus_sex}</p>*/}
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h2>เอกสารที่ต้องใช้</h2>
                </div>

                <div className="flex flex-row flex-wrap">
                  {document.length > 0 ? (
                    document.map((res: Partial<any>, index: number) => (
                      <div key={index} className="w-1/2 flex-shrink-0 p-4">
                        <div className="max-w-full">
                          {res.value ? ( // Check if res.value is defined
                            <>
                              <div className="flex">
                                {/* <Controller
                                name="document_type"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { onChange, onBlur, value } }) => ( */}
                                <input
                                  type="checkbox"
                                  onChange={() => {
                                    CheckboxChange(res);
                                  }}
                                  className="mr-5"
                                ></input>
                                {/* )} */}
                                {/* /> */}
                                {res.value}
                              </div>

                              <div>
                                {etc && res.key === "document_etc" && (
                                  <input
                                    type="text"
                                    className="w-full"
                                    onChange={(e) => {
                                      setInputEtc(e.target.value);
                                    }}
                                  />
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500">
                              No content available
                            </p> // Display a message if not
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No documents yet</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end  rounded-b">
                <button
                  style={{
                    border: "1px solid #417CA0",
                    color: "#305D79",
                    marginRight: "5px",
                  }}
                  className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                  // onClick={() => setShowModal(false)}
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalAdddocument;
