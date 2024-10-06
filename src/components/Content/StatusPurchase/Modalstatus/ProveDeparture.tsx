"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

//service
import { CreateDeparture, getDeparture } from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";

interface ModalDepartureProps {
    purchase: any;
    setModalstatus: any;
  }
  const ModalProveDepartureComponent: React.FC<ModalDepartureProps> = ({
    purchase,
    setModalstatus,
  }) => {
  const methods = useForm();

  const [data, setData] = useState<any>({});
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

  const fetchData = async (id: any) => {
    try {
      const response: any = await getDeparture(id);
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
      return status.status_key === "Departure";
    });
    if (checkCreate?.status_key == "Departure") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "5",
          tabName: "ยืนยันวันออกเดินทาง",
          tabKey: "Departure",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "5",
          tabName: "ยืนยันวันออกเดินทาง",
          tabKey: "Departure",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (data: any) => {
    try {
      const requeset = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
        const response: any = await CreateDeparture(requeset);
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
      <div className="modal-overlay"></div>
      <div className="text-black pt-16  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
               ยืนยันวันออกเดินทาง
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
                      วันที่ ETD *
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_etd"
                          control={control}
                          defaultValue={data?.date_etd}
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
                                              errors.date_etd
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_etd && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_etd}</p>
                    )}
                  </div>
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่ ETA
                      <span className="text-red-500">*</span>
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_eta"
                          control={control}
                          defaultValue={data?.date_eta}
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
                                              errors.date_eta
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_eta && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_eta}</p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Port ต้นทาง.
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="post_origin"
                          control={control}
                          defaultValue={data?.post_origin}
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
                                              errors.post_origin
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.post_origin && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.post_origin}</p>
                    )}
                  </div>

                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Port ปลายทาง.
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="post_destination"
                          control={control}
                          defaultValue={data?.post_destination}
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
                                              errors.post_destination
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.post_destination && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.post_destination}</p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Vessel's Name *
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="vessel_name"
                          control={control}
                          defaultValue={data?.vessel_name}
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
                                                      errors.vessel_name
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                    }
                                                     px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.vessel_name && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.vessel_name}</p>
                    )}
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

export default ModalProveDepartureComponent;
