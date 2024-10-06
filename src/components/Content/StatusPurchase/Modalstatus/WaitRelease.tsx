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
import { getWaitrelease, CreateWaitrelease } from "@/services/statusOrder";

import ViewImageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";

interface ModalReceiveProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ReleaseComponent: React.FC<ModalReceiveProps> = ({
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
      const res = await getWaitrelease(id);
      setData(res);
    } catch (err: any) {
    } finally {
    }
  };

  useEffect(() => {
    setStatus(status);
  }, [status]);

  useEffect(() => {
    console.log("datadata", data);
  }, [data]);

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "WaitRelease";
    });
    if (checkCreate?.status_key == "WaitRelease") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "7",
          tabName: "รอตรวจปล่อย",
          tabKey: "WaitRelease",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "7",
          tabName: "รอตรวจปล่อย",
          tabKey: "WaitRelease",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data);
      const requeset = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
        const response: any = await CreateWaitrelease(requeset);
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
      }
    } catch (err) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด",
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
              รายละเอียด การตรวจปล่อย
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
                    Demurrage (DEM) Free time{" "}
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="dem_free_time"
                        control={control}
                        defaultValue={data?.dem_free_time}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="0 Days"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              data.dem_free_time
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {data.dem_free_time && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.dem_free_time}</p>
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    Demurrage (DEM) Date
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="demurrage_dem_date"
                        control={control}
                        defaultValue={data?.demurrage_dem_date}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="เลือก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="date"
                            className={`
                                            ${
                                              data.demurrage_dem_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {data.demurrage_dem_date && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.demurrage_dem_date}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    Detention (DET) Free time{" "}
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="det_free_time"
                        control={control}
                        defaultValue={data?.det_free_time}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="0 Days"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.det_free_time
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.det_free_time && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.det_free_time}</p>
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    Detention (DET) Date{" "}
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="detention_det_date"
                        control={control}
                        defaultValue={data?.detention_det_date}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="เลือก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="date"
                            className={`
                                            ${
                                              errors.detention_det_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.detention_det_date && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.detention_det_date}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    Terminal ท่าปล่อยตรวจ
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="terminal_release"
                        control={control}
                        defaultValue={data?.terminal_release}
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
                                              errors.terminal_release
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.terminal_release && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.terminal_release}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    วันที่จะตรวจปล่อย (Planing){" "}
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="date_planing"
                        control={control}
                        defaultValue={data?.date_planing}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="0 Days"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="date"
                            className={`
                                            ${
                                              errors.booking_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.date_planing && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.date_planing}</p>
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    วันที่รับตู้ออกจากท่าเรือ (Planing){" "}
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="date_receive"
                        control={control}
                        defaultValue={data?.date_receive}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="เลือก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="date"
                            className={`
                                            ${
                                              errors.date_receive
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.date_receive && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.date_receive}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    บริษัทรถ
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="company_car"
                        control={control}
                        defaultValue={data?.company_car}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="เลือก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.company_car
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.company_car && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.company_car}</p>
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    ประเภทรถ{" "}
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="type_car"
                        control={control}
                        defaultValue={data?.type_car}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <select
                            onChange={onChange}
                            value={value}
                            className="border w-full border-gray-200 p-2 rounded-md"
                          >
                            <option value="">เลือก</option>
                            <option value="รถยนต์">รถยนต์</option>
                            <option value="รถตู้">รถตู้</option>
                            <option value="รถบรรทุก">รถบรรทุก</option>
                            <option value="เรือ">เรือ</option>
                          </select>
                        )}
                      />
                      {data.type_car && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.type_car}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    ป้ายทะเบียน
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="license_plate"
                        control={control}
                        defaultValue={data?.license_plate}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                        ${
                                          data.license_plate
                                            ? "border-red-500"
                                            : "border-gray-200"
                                        }
                                        px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {data.license_plate && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.license_plate}</p>
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    เบอร์โทรศัพท์{" "}
                  </label>

                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="phone_number"
                        control={control}
                        defaultValue={data?.phone_number}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                        ${
                                          data.phone_number
                                            ? "border-red-500"
                                            : "border-gray-200"
                                        }
                                        px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {data.phone_number && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.phone_number}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    สถานที่แลกการ์ดรับตู้
                  </label>
                  {dataStatus.type !== "view" ? (
                    <>
                      <Controller
                        name="location_exchange"
                        control={control}
                        defaultValue={data?.location_exchange}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              data.location_exchange
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {data.location_exchange && (
                        <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                      )}
                    </>
                  ) : (
                    <p>{data?.location_exchange}</p>
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
                          setValue={setValue}
                          control={control}
                        ></UploadImageComponent>
                      </>
                    ) : (
                      <>
                        <div className="flex  flex-wrap ">
                          {data?.waitrelease_file?.map(
                            (images: any, index: number) => {
                              const isExcel =
                                images.file_name?.endsWith(".xlsx") ||
                                images.file_name?.endsWith(".xls") ||
                                images.file_name?.endsWith(".csv");
                              const isPdf = images.file_name?.endsWith(".pdf");
                              const isImage =
                                images.file_name?.endsWith(".jpg") ||
                                images.file_name?.endsWith(".png");
                              const url =
                                process.env.NEXT_PUBLIC_URL_API +
                                images.file_path;

                              return (
                                <ViewImageComponent
                                  isExcel={isExcel}
                                  isPdf={isPdf}
                                  isImage={isImage}
                                  url={url}
                                  images={images}
                                  index={index}
                                ></ViewImageComponent>
                              );
                            }
                          )}
                        </div>
                      </>
                    )}
                  </div>
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

export default ReleaseComponent;
