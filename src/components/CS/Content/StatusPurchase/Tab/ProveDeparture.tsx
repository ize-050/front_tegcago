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
import {
  CreateDeparture,
  getDeparture,
  UpdateDeparture,
} from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";

const ProveDepartureComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const [data, setData] = useState<any>({});
  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const [departureId, setDepartureId] = useState<string>();

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
    type: "create",
  });

  const fetchData = async (id: any) => {
    try {
      const response: any = await getDeparture(id);
      setData(response);
    } catch (err: any) { }
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
      setDepartureId(checkCreate.id);
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

  const onSubmit = async (dataForm: any) => {
    try {
      let requeset = {
        ...dataForm,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
        const response: any = await CreateDeparture(requeset);
        if (response.statusCode == 200) {
          await fetchData(response.id);
          setDepartureId(response.id);
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: response.message,
            })
          );
        }
      } else if (dataStatus.type === "edit") {
        requeset.id = data.id;
        const response: any = await UpdateDeparture(requeset);
        if (response.statusCode == 200) {
          await fetchData(departureId);
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: response.message,
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      //   location.reload();
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
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดการยืนยันวันออกเดินทาง
              </h1>
            </div>
            <div className="flex-end justify-center mt-1">
              {dataStatus.type === "view" ? (
                <>
                  <Button
                    onClick={() => changeEdit(true)}
                    // onClick={() => changeEdit(!formEditcustomer)}
                    style={{
                      background: "#C8D9E3",
                      color: "#417CA0",
                      width: "119px",
                      height: "36px",
                    }}
                    className="flex hover:bg-blue-700   mr-1"
                  >
                    <Lucide
                      color="#6C9AB5"
                      icon="Pencil"
                      className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
                    ></Lucide>
                    <p className="text-[#417CA0] text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1">
                      แก้ไขข้อมูล
                    </p>
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`
                                            ${errors.date_etd
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`
                                            ${errors.date_eta
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                            ${errors.post_origin
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                            ${errors.post_destination
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                                    ${errors.vessel_name
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


              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  BL NO *
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="bl_no"
                      control={control}
                      defaultValue={data?.bl_no}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                                    ${errors.bl_no
                              ? "border-red-500"
                              : "border-gray-200"
                            }
                                                     px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.bl_no && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.bl_no}</p>
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
    </Fragment>
  );
};

export default ProveDepartureComponent;
