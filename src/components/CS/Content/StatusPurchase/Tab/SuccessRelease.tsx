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
  updateSuccessRelease,
} from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";
import ViewImageComponent from "../Image/ViewImageComponent";
import EditImageComponent from "./Image/EditImageComponent";

const SuccessReleaseComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const [isLoading, setIsLoading] = useState(false);
  const [successReleaseId, setSuccessReleaseId] = useState<string>();

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
      setSuccessReleaseId(checkCreate.id);
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

  const onSubmit = async (dataForm: any) => {
    try {
      let formData = {
        ...dataForm,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
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
      } else if (dataStatus.type === "edit") {
        let id = successReleaseId;
        formData.id = data.id;
        const response: any = await updateSuccessRelease(formData);
        if (response.statusCode == 200) {
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: response.message,
            })
          );
          await fetchData(id);
        }
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
      //location.reload();
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
                รายละเอียดการตรวจปล่อยเรียบร้อย
              </h1>
            </div>
            {dataStatus.type == "view" && (
              <div className="flex-end justify-center mt-1">
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
              </div>
            )}
          </div>
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
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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
                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_do"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="file_do"
                        control={control}
                        image={data?.cs_inspection_file}
                      ></EditImageComponent>
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
                            const isPdf = images.file_name?.endsWith(".pdf");
                            const isImage =
                              images.file_name?.endsWith(".jpg") ||
                              images.file_name?.endsWith(".png") ||
                              images.file_name?.endsWith(".jpeg") ||
                              images.file_name?.endsWith(".webp");
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_card"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="file_card"
                        control={control}
                        image={data?.cs_inspection_file}
                      ></EditImageComponent>
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
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png") ||
                            images.file_name?.endsWith(".jpeg") ||
                            images.file_name?.endsWith(".webp");
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`border-gray-200 px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_return_document"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="file_return_document"
                        control={control}
                        image={data?.cs_inspection_file}
                      ></EditImageComponent>
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
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png") ||
                            images.file_name?.endsWith(".jpeg") ||
                            images.file_name?.endsWith(".webp");
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

export default SuccessReleaseComponent;
