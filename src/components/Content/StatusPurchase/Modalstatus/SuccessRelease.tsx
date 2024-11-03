"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";

//service
import {
  createSuccessRelease,
  getSuccessRelease,
} from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";
import ViewImageComponent from "./ViewImagecomponent";

interface ModalSuccessReleaseProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ModalSuccessReleaseComponent: React.FC<ModalSuccessReleaseProps> = ({
  purchase,
  setModalstatus,
}) => {
  const methods = useForm();

  const { status, dataCspurchase } = useAppSelector(statusOrderData);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    getFieldState,
    setError,
    control,
    watch,
  } = methods;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dataStatus, setStatus] = useState<Partial<any>>({
    type: "view",
  });

  const [data, setData] = useState<any>({});

  const fetchData = async (id: any) => {
    try {
      const response: any = await getSuccessRelease(id);
      setData(response);
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    setStatus(status);
  }, [status]);

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "Released";
    });
    if (checkCreate?.status_key == "Released") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "8",
          tabName: "ตรวจปล่อยเรียบร้อย",
          tabKey: "Released",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "8",
          tabName: "ตรวจปล่อยเรียบร้อย",
          tabKey: "Released",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      //   if (dataStatus.type === "create") {
      const response: any = await createSuccessRelease(formData);
      if (response.statusCode == 200) {
        dispatch(setEditForm("view"));
        dispatch(
          setOpenToast({
            type: "success",
            message: response.message,
          })
        );
        fetchData(response.id);
      }
      //   }
    } catch (err: any) {
      console.log("err", err);
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      location.reload();
    }
  };

  useEffect(() => {
    console.log("purchasesss", purchase);
  }, [purchase]);

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
      รายละเอียดการตรวจปล่อยเรียบร้อย
      <div className="modal-overlay"></div>
      <div className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายละเอียดการตรวจปล่อยเรียบร้อย
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

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      ชื่อ Shipping ผู้ดูแล
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="shipping"
                          control={control}
                          defaultValue={data?.shipping}
                          rules={{ required: false }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรอก"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.shipping
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.shipping && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.shipping}</p>
                    )}
                  </div>
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันตรวจปล่อย
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_release"
                          control={control}
                          defaultValue={data?.date_release}
                          rules={{ required: false }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรอก"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="date"
                              className={`
                                            ${
                                              errors.date_release
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_release && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_release}</p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่แลก D/0
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_do"
                          control={control}
                          defaultValue={data?.date_do}
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
                                              data.date_do
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {data.date_do && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_do}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์แนบแลก D/0
                      </label>
                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="file_do"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <>
                          <div className="flex  flex-wrap ">
                            {data?.cs_inspection_file
                              ?.filter((res: { key: string }) => {
                                return res.key === "file_do";
                              })
                              ?.map((images: any, index: number) => {
                                const isExcel =
                                  images.file_name?.endsWith(".xlsx") ||
                                  images.file_name?.endsWith(".xls") ||
                                  images.file_name?.endsWith(".csv");
                                const isPdf =
                                  images.file_name?.endsWith(".pdf");
                                const isImage = images.file_name?.endsWith('.jpg') || images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                                const url =
                                  process.env.NEXT_PUBLIC_URL_API +
                                  images.file_path;

                                return (
                                  <>
                                    <ViewImageComponent
                                      isExcel={isExcel}
                                      isPdf={isPdf}
                                      isImage={isImage}
                                      url={url}
                                      images={images}
                                      index={index}
                                    ></ViewImageComponent>
                                  </>
                                );
                              })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่แลกการ์ดรับตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_card"
                          control={control}
                          defaultValue={data?.date_card}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="date"
                              className={`
                                            ${
                                              data.date_card
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {data.date_card && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_card}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์แนบแลกการ์ดรับตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="file_card"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_inspection_file
                            ?.filter((res: { key: string }) => {
                              return res.key === "file_card";
                            })
                            ?.map((images: any, index: number) => {
                              const isExcel =
                                images.file_name?.endsWith(".xlsx") ||
                                images.file_name?.endsWith(".xls") ||
                                images.file_name?.endsWith(".csv");
                              const isPdf = images.file_name?.endsWith(".pdf");
                              const isImage = images.file_name?.endsWith('.jpg') || images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                              const url =
                                process.env.NEXT_PUBLIC_URL_API +
                                images.file_path;

                              return (
                                <>
                                  <ViewImageComponent
                                    isExcel={isExcel}
                                    isPdf={isPdf}
                                    isImage={isImage}
                                    url={url}
                                    images={images}
                                    index={index}
                                  ></ViewImageComponent>
                                </>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่รับเอกสารคืนตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_return_document"
                          control={control}
                          defaultValue={data?.date_return_document}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="date"
                              className={`
                                            ${
                                              data.date_return_document
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {data.date_return_document && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_return_document}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์แนบเอกสารคืนตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="file_return_document"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_inspection_file
                            ?.filter((res: { key: string }) => {
                              return res.key === "file_return_document";
                            })
                            ?.map((images: any, index: number) => {
                              const isExcel =
                                images.file_name?.endsWith(".xlsx") ||
                                images.file_name?.endsWith(".xls") ||
                                images.file_name?.endsWith(".csv");
                              const isPdf = images.file_name?.endsWith(".pdf");
                              const isImage = images.file_name?.endsWith('.jpg') || images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                              const url =
                                process.env.NEXT_PUBLIC_URL_API +
                                images.file_path;

                              return (
                                <>
                                  <ViewImageComponent
                                    isExcel={isExcel}
                                    isPdf={isPdf}
                                    isImage={isImage}
                                    url={url}
                                    images={images}
                                    index={index}
                                  ></ViewImageComponent>
                                </>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>

            <div className="flex items-center justify-end  rounded-b">
                  <button
                    style={{
                      border: "1px solid #417CA0",
                      color: "#305D79",
                      marginRight: "10px",
                    }}
                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setModalstatus("");
                    }}
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

export default ModalSuccessReleaseComponent;
