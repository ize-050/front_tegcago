"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";
import { setOpenToast } from "@/stores/util";
import { createLeave, getLeave } from "@/services/statusOrder";
// viewImage
import ViewImageComponent from "./ViewImagecomponent";

interface ModalDepartureProps {
    purchase: any;
    setModalstatus: any;
  }
const ModalDepartureComponents: React.FC<ModalDepartureProps> = ({
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

  useEffect(() => {
    setStatus(status);
  }, [status]);

  const fetchData = async (id: any) => {
    try {
      const response: any = await getLeave(id);
      setData(response);
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "Leave";
    });
    if (checkCreate?.status_key == "Leave") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "6",
          tabName: "ออกเดินทาง",
          tabKey: "Leave",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "6",
          tabName: "ออกเดินทาง",
          tabKey: "Leave",
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
      if (dataStatus.type === "create") {
        const res: any = await createLeave(formData);
        if (res.statusCode === 200) {
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: res.message,
            })
          );
            fetchData(res.id);
        }
      }
    } catch (err: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      //location.reload();
      //dispatch(setEditForm("view"));
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
      <div className="modal-overlay"></div>
      <div className="text-black pt-16  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
               ออกเดินทาง
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
                  วันที่ H B/L *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_hbl"
                      control={control}
                      defaultValue={data?.date_hbl}
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
                                              errors.date_hbl
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_hbl && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_hbl}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร H B/L
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_hbl"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_hbl";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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
                  วันที่ Original F/E *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_original_fe"
                      control={control}
                      defaultValue={data?.date_original_fe}
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
                                              errors.date_original_fe
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_original_fe && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_original_fe}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Original F/E *
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_original_fe"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                    <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_original_fe";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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
                  วันที่ Surrender *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_surrender"
                      control={control}
                      defaultValue={data?.date_surrender}
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
                                              errors.date_surrender
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_surrender && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_surrender}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Surrender *
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_surrender"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                    <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_surrender";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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
                  วันที่ Enter Doc
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_enter_doc"
                      control={control}
                      defaultValue={data?.date_enter_doc}
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
                                              errors.date_enter_doc
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_enter_doc && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_enter_doc}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Enter Doc
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_enter_doc"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                    <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_enter_doc";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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
                  วันที่ Payment D/O *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_payment_do"
                      control={control}
                      defaultValue={data?.date_payment_do}
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
                                              data.date_payment_do
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {data.date_payment_do && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_payment_do}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Payment D/O *
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_payment_do"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                    <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_payment_do";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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
                  ยอด Payment D/O *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="amount_payment_do"
                      control={control}
                      defaultValue={data?.amount_payment_do}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="0.00"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                            ${
                                              errors.amount_payment_do
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.amount_payment_do && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.amount_payment_do}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    ไฟล์แนบสลิป
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <UploadImageComponent
                        name="file_amount_payment_do"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : (
                    <>
                    <div className="flex  flex-wrap ">
                        {data?.Leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_amount_payment_do";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

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

            {dataStatus.type !== "view" && (
              <div className="flex items-center justify-end  rounded-b">
                <button
                  style={{
                    border: "1px solid #417CA0",
                    color: "#305D79",
                    marginRight: "10px",
                  }}
                  className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => changeEdit(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg   mr-1 mb-1 "
                  type="submit"
                  // onClick={() => setShowModal(false)}
                >
                  บันทึก
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
      </div>
      </div>

    </Fragment>
  );
};

export default ModalDepartureComponents;
