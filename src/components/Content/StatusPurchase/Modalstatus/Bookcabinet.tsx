"use client";

import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import Image from "next/image";
import {
  statusOrderData,
  setEditForm,
  setStoreTabActive,
} from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

//store
import { createBookcabinet, setForm } from "@/stores/statusOrder";
import { setOpenToast } from "@/stores/util";
import { purchaseData } from "@/stores/purchase";

//service
import { getBookcabinet } from "@/services/statusOrder";
import { setModalImage } from "@/stores/purchase";
import ModalPreviewImage from "../../Prepurchase/upload/ModalPreview";
import moment from "moment";

interface ModalBookcabinetProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ModalBookcabinet: React.FC<ModalBookcabinetProps> = ({
  purchase,
  setModalstatus,
}) => {
  const methods = useForm();
  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const { modalImage } = useAppSelector(purchaseData);
  const {
    formState: { errors },
    setValue,
    control,
  } = methods;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectIndex, setSelectedImageIndex] = useState<number>(0);
  const [dataStatus, setStatus] = useState<Partial<any>>({});

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setStatus(status);
  }, [status]);

  const fetchData = useCallback(async (id_get: string) => {
    try {
      const response = await getBookcabinet(id_get);
      setData(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "Bookcabinet";
    });
    if (checkCreate?.status_key == "Bookcabinet") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "1",
          tabName: "จองตู้",
          tabKey: "Bookcabinet",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "1",
          tabName: "จองตู้",
          tabKey: "Bookcabinet",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const PurchaseData = useMemo(() => {
    return purchase;
  }, [purchase]);

  const changeEdit = (value: boolean) => {
    if (value) {
      dispatch(setEditForm("edit"));
    } else {
      dispatch(setEditForm("view"));
    }
  };

  return (
    <Fragment>
      <div className="modal-overlay"></div>
      <div className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className=" text-black">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  รายละเอียดการจองตู้
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setModalstatus("");
                  }}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  วันที่รับเรื่อง
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_receiving"
                      control={control}
                      defaultValue={data?.date_receiving}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`
                                            ${
                                              errors.date_receiving
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_receiving && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_receiving}</p>
                )}
              </div>
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  วันที่ Booking
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_booking"
                      control={control}
                      defaultValue={data?.date_booking}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`
                                            ${
                                              errors.date_booking
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_booking && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_booking}</p>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  Agency
                </label>
                <p className="text-black">
                  {
                    PurchaseData?.d_sale_agentcy[0]?.d_agentcy?.agentcy
                      .agent_name
                  }
                </p>
              </div>
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  สายเรือ
                </label>
                <p className="text-black">
                  {PurchaseData?.d_sale_agentcy[0]?.d_agentcy?.agent_boat}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  วันที่เข้าบรรจุตู้
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_entering"
                      control={control}
                      defaultValue={data.date_entering}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`
                                            ${
                                              errors.date_entering
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_entering && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_entering}</p>
                )}
              </div>

              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  เวลาจองตู้
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="time_entering"
                      control={control}
                      defaultValue={data.time_entering}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="time"
                          className={`
                                            ${
                                              errors.time_entering
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.time_entering && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.time_entering}</p>
                )}
              </div>
            </div>

            <div className="">
              <div className="p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  รูปภาพ
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <div className="w-1/2">
                      <UploadImageComponent
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : (
                  <>
                   <div className="flex">
                    {data?.bookcabinet_picture?.map(
                      (images: any, index: number) => {
                        const isExcel =
                          images.picture_name?.endsWith(".xlsx") ||
                          images.picture_name?.endsWith(".xls") ||
                          images.picture_name?.endsWith(".csv");
                        const isPdf = images.picture_name?.endsWith(".pdf");
                        const isImage = images.picture_name?.endsWith('.jpg') || images.picture_name?.endsWith('.png') || images.picture_name?.endsWith('.jpeg') || images.picture_name?.endsWith('.webp');;
                        const url =
                          process.env.NEXT_PUBLIC_URL_API +
                          "/" +
                          images.picture_path;

                        console.log("url", url);
                        return (
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
                                      onClick={() => {
                                        dispatch(setModalImage(true));
                                        setSelectedImageIndex(index);
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
                                {modalImage && selectIndex === index && (
                                  <ModalPreviewImage
                                    isOpen={modalImage}
                                    onClose={() =>
                                      dispatch(setModalImage(false))
                                    }
                                    startIndex={index}
                                    images={data?.bookcabinet_picture}
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
                        );
                      }
                    )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end  rounded-b">
              <button
                onClick={() => {
                  setModalstatus("close");
                }}
                style={{
                  border: "1px solid #417CA0",
                  color: "#305D79",
                  marginRight: "10px",
                }}
                className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalBookcabinet;
