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
  updateReceive,
} from "@/stores/statusOrder";

import ModalPreviewImage from "../../Prepurchase/upload/ModalPreview";
import { setOpenToast } from "@/stores/util";
import EdituploadComponent from "./Image/EditImageNotkeyComponent";
import ViewImageComponent from "../Image/ViewImageComponent";

const ReceiveComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const [ReceiveId, setReceiveId] = useState<any>("");
  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const { modalImage } = useAppSelector(purchaseData);
  const [selectIndex, setSelectedImageIndex] = useState<number>(0);

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
      setReceiveId(checkCreate.id);
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

  const onSubmit = async (dataForm: any) => {
    try {
      console.log("data", dataForm);
      const formData = {
        ...dataForm,
        id:data.id,
        d_purchase_id: purchase?.id,
      };
      if (status.type === "create") {
        delete formData.id;
        dispatch(createReceive(formData)).then(async (response: any) => {
          console.log("response", response);
          if (response.payload.data.statusCode == 200) {
            await fetchData(response.payload.data.id);
            setReceiveId(response.payload.data.id)
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: response.payload.data.message,
              })
            );
           
          }
        });
      } else if(status.type === "edit") {
        console.log("editna")
        dispatch(updateReceive(formData)).then(async (response: any) => {
          if (response.payload.data.statusCode == 200) {
            await fetchData(ReceiveId);
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: "บันทึกข้อมูลเรียบร้อย",
              })
            );
            fetchData(ReceiveId);
          }
        });
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
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดการรับตู้
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
                  วันที่รับตู้
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
              <div className="p-5 w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  แนบรูปการตรวจตู้
                </label>

                {dataStatus.type == "create" ? (
                  <>
                    <div className="">
                    <UploadImageComponent
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : dataStatus.type == "edit" ? (
                  <>
                    <div className="">
                      <EdituploadComponent
                        name="files"
                        setValue={setValue}
                        image={data?.receive_picture}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
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

export default ReceiveComponent;
