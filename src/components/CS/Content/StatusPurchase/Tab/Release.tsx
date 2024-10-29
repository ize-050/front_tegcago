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
import {
  getWaitrelease,
  CreateWaitrelease,
  EditWaitrelease,
} from "@/services/statusOrder";
import { View } from "lucide-react";
import ViewImageComponent from "../Image/ViewImageComponent";
import EditImageComponent from "./Image/EditImageNotkeyComponent";
const ReleaseComponent = ({ purchase }: { purchase: any }) => {
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
  const [releaseId, setReleaseId] = useState<any>(null);
  const [dataStatus, setStatus] = useState<Partial<any>>({
    type: "create",
  });

  const [data, setData] = useState<any>({});

  const fetchData = async (id: any) => {
    try {
      const res  :any = await getWaitrelease(id);
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
      setReleaseId(checkCreate.id);
     
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

  const onSubmit = async (dataForm: any) => {
    try {
      console.log("data", dataForm);
      let requeset = {
        ...dataForm,
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
      } else if (dataStatus.type === "edit") {
        requeset.id = data.id;
        const response: any = await EditWaitrelease(requeset);
        if (response.statusCode == 200) {
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: response.message,
            })
          );
          fetchData(releaseId);
        }
      }
    } catch (err) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      // location.reload();
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
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดการรอตรวจปล่อย
              </h1>
            </div>
            <div className="flex-end justify-center mt-1">
              {dataStatus.type !== "edit" && dataStatus.type !== "create" && (
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
              )}
              </div>
          </div>
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="0 Days"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                          border-gray-200    px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                   
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="เลือก"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`border-gray-200
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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
                      rules={{ required: false }}
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
                      rules={{ required: false }}
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
                      rules={{ required: false }}
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

              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  สถานที่แลก D/0
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="location_do"
                      control={control}
                      defaultValue={data?.location_exchange}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                            ${
                                              errors.location_exchange
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.location_exchange && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.location_exchange}</p>
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
                      rules={{ required: false }}
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
                      rules={{ required: false }}
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
                      rules={{ required: false }}
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <select
                          onChange={onChange}
                          value={value}
                          className="border w-full border-gray-200 p-2 rounded-md"
                        >
                          <option value="">เลือก</option>
                          <option value="รถกระบะ4ล้อ">รถกระบะ4ล้อ</option>
                          <option value="รถกระบะตู้ทึบ">รถกระบะตู้ทึบ</option>
                          <option value="รถ6ล้อ">รถ6ล้อ</option>
                          <option value="รถ6ล้อตู้ทึบ">รถ6ล้อตู้ทึบ</option>
                          <option value="รถ10ล้อ">รถ10ล้อ</option>
                          <option value="รถ10ล้อตู้ทึบ">รถ10ล้อตู้ทึบ</option>
                          <option value="รถหัวลาก">รถหัวลาก</option>
                        </select>
                      )}
                    />
                 
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรอก"
                          value={value}
                        
                          onChange={onChange}
                          type="text"
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                   
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรอก"
                          value={value}

                          onChange={onChange}
                          type="text"
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                   
                  </>
                ) : (
                  <p>{data?.phone_number}</p>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  สถานที่เก็บการ์ด
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="location_exchange"
                      control={control}
                      defaultValue={data?.location_exchange}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรอก"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="files"
                        control={control}
                        image={data?.waitrelease_file}
                      ></EditImageComponent>
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
                            const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
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

export default ReleaseComponent;
function setReleaseId(id: any) {
  throw new Error("Function not implemented.");
}

