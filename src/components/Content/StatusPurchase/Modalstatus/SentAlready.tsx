"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { setOpenToast } from "@/stores/util";

//service
import { getSendsuccess, createSendSuccess } from "@/services/statusOrder";

//components
import ViewImageComponent from "./ViewImagecomponent";

interface ModalSentAlreadyProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ModalSentAlreadyComponent: React.FC<ModalSentAlreadyProps> = ({
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
      const response: any = await getSendsuccess(id);
      setData(response);
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "SentSuccess";
    });
    if (checkCreate?.status_key == "SentSuccess") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "10",
          tabName: "ส่งเรียบร้อย",
          tabKey: "SentSuccess",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "10",
          tabName: "ส่งเรียบร้อย",
          tabKey: "SentSuccess",
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
      const response: any = await createSendSuccess(formData);
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
      console.log(err);
      dispatch(
        setOpenToast({
          type: "error",
          message: err.message,
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
      <div className="modal-overlay"></div>
      <div className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายละเอียดการส่งเรียบร้อย
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
                      วันที่จัดส่งเรียบร้อย
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_out_arrival"
                          control={control}
                          defaultValue={data?.date_out_arrival}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="date"
                              className={`
                                            ${errors.date_out_arrival
                                  ? "border-red-500"
                                  : "border-gray-200"
                                }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_out_arrival && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_out_arrival}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        แนบรูปรถถึงปลายทาง
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_already_sent_file?.map(
                            (images: any, index: number) => {
                              const isExcel =
                                images.file_name?.endsWith(".xlsx") ||
                                images.file_name?.endsWith(".xls") ||
                                images.file_name?.endsWith(".csv");
                              const isPdf = images.file_name?.endsWith(".pdf");
                              const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
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
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      หมายเหตุ
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="etc"
                          control={control}
                          defaultValue={data?.etc}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${errors.etc
                                  ? "border-red-500"
                                  : "border-gray-200"
                                }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.etc && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.etc}</p>
                    )}
                  </div>
                </div>


              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalSentAlreadyComponent;
