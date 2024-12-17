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

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

//service
import { getReceive } from "@/services/statusOrder";

//store
import { purchaseData, setModalImage } from "@/stores/purchase";
import {
  statusOrderData,
  setEditForm,
  createReceive,
  setForm,
} from "@/stores/statusOrder";

import ModalPreviewImage from "../../Prepurchase/upload/ModalPreview";
import { setOpenToast } from "@/stores/util";
import ViewImageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";

interface ModalReceiveProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ModalReceiveComponent: React.FC<ModalReceiveProps> = ({
  purchase,
  setModalstatus,
}) => {
  const methods = useForm();

  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const { modalImage } = useAppSelector(purchaseData);
  const [selectIndex, setSelectedImageIndex] = useState<number>(0);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
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

  const fetchData = useCallback(
    async (id_get: string) => {
      try {
        const response = await getReceive(id_get);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    },
    [dataCspurchase]
  );

  useEffect(() => {
    const checkCreate = dataCspurchase?.find((status: any) => {
      return status.status_key === "Receive";
    });
    if (checkCreate?.status_key == "Receive") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "2",
          tabName: "รับตู้",
          tabKey: "Receive",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "2",
          tabName: "รับตู้",
          tabKey: "Receive",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data);
      const formData = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      if (status.type === "create") {
        dispatch(createReceive(formData)).then((response: any) => {
          console.log("response", response);
          if (response.payload.data.statusCode == 200) {
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: response.payload.data.message,
              })
            );
            fetchData(response.payload.data.id);
          }
        });
      } else {
      }
    } catch (err: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      location.reload();
    }
  };

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
                รายละเอียดการรับตู้
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
                      วันที่รับตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_booking"
                          control={control}
                          defaultValue={data?.date_booking}
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
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      S/O NO.
                      <span className="text-red-500">*</span>
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="so_no"
                          control={control}
                          defaultValue={data?.so_no}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input 
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.so_no
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.so_no && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.so_no}</p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Container No.
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="container_no"
                          control={control}
                          defaultValue={data?.container_no}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="กรุณากรอกข้อมูล"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.container_no
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.container_no && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.container_no}</p>
                    )}
                  </div>

                  <div className="w-1/2 p-5">
                    <div className="flex">
                      <div className="w-1/2 ">
                        <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                          เบอร์โทรคนขับรถ
                        </label>

                        {dataStatus.type !== "view" ? (
                          <>
                            <Controller
                              name="phone_no"
                              control={control}
                              defaultValue={data?.phone_no}
                              rules={{ required: true }}
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <input
                                  placeholder="กรุณากรอกข้อมูล"
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  type="text"
                                  className={`
                                            ${
                                              errors.phone_no
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                                />
                              )}
                            />
                            {errors.phone_no && (
                              <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                            )}
                          </>
                        ) : (
                          <p>{data?.phone_no}</p>
                        )}
                      </div>

                      <div className="w-1/2">
                        <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                          เลขทะเบียนรถ
                        </label>

                        {dataStatus.type !== "view" ? (
                          <>
                            <Controller
                              name="license_plate"
                              control={control}
                              defaultValue={data?.phone_no}
                              rules={{ required: true }}
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <input
                                  placeholder="กรุณากรอกข้อมูล"
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  type="text"
                                  className={`
                                            ${
                                              errors.license_plate
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                                />
                              )}
                            />
                            {errors.license_plate && (
                              <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                            )}
                          </>
                        ) : (
                          <p>{data?.license_plate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      แนบรูปการตรวจตู้
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
                        <div className="flex    flex-wrap ">
                    {data?.receive_picture?.map((images: any, index: number) => {
                      const isExcel =
                        images.picture_name?.endsWith(".xlsx") ||
                        images.picture_name?.endsWith(".xls") ||
                        images.picture_name?.endsWith(".csv");
                      const isPdf = images.picture_name?.endsWith(".pdf");
                      const isImage = images.picture_name?.endsWith('.jpg') ||images.picture_name?.endsWith('.png') || images.picture_name?.endsWith('.jpeg') || images.picture_name?.endsWith('.webp');
                      const url =
                        process.env.NEXT_PUBLIC_URL_API + images.picture_path;

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

                <div className="flex items-center justify-end  rounded-b">
                  <button
                    style={{
                      border: "1px solid #417CA0",
                      color: "#305D79",
                      marginRight: "10px",
                    }}
                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setModalstatus("close")}
                  >
                    ปิด
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalReceiveComponent;
