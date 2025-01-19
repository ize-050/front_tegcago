"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";

import { setOpenToast } from "@/stores/util";
import { createLeave, editLeave, getLeave } from "@/services/statusOrder";
import ViewImageComponent from "../Image/ViewImageComponent";

import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";
import EditImageComponent from '@/components/CS/Content/StatusPurchase/Tab/Image/EditImageComponent'

const DepartureComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const [isChecked, setIsChecked] = useState(false);
  const [departureId, setDepartureId] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    setStatus(status);
  }, [status]);

  const fetchData = async (id: any) => {
    try {
      const response: any = await getLeave(id);
      if(response?.check_price_deposit){
       setIsChecked(response?.check_price_deposit)
      }
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
      setDepartureId(checkCreate.id)
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onSubmit = async (dataForm: any) => {
    if (isLoading) return; 
    setIsLoading(true);
    try {
      dataForm.check_price_deposit =   isChecked;

      let formData = {
        ...dataForm,
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
      else if(dataStatus.type === "edit"){
        let id = departureId
        formData.id = data.id
        const res: any = await editLeave(formData);
        if (res.statusCode === 200) {
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: res.message,
            })
          );
          fetchData(id);
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
    finally {
      setIsLoading(false);
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
                รายละเอียดการออกเดินทาง
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
                  วันที่ H B/L *
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_hbl"
                      control={control}
                      defaultValue={data?.date_hbl}
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_hbl"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit"? (
                    <>
                     <EditImageComponent
                         setValue={setValue}
                         name="file_hbl"
                         control={control}
                         image={data?.leavefile}
                       ></EditImageComponent>

                       
                    </>
                   ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_hbl";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_original_fe"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                   ) : dataStatus.type == "edit"? (
                    <>
                     <EditImageComponent
                         setValue={setValue}
                         name="file_original_fe"
                         control={control}
                         image={data?.leavefile}
                       ></EditImageComponent>

                       
                    </>
                   ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_original_fe";
                        })?.map((images: any, index: number) => {
                          console.log("imagesfile_original_fe", images)
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;
                          console.log("url", url)
                              return (
                                <ViewImageComponent
                                  isExcel={isExcel}
                                  isPdf={isPdf}
                                  isImage={isImage}
                                  url={url}
                                  images={images}
                                  index={index}
                                />
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_surrender"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit"? (
                    <>
                     <EditImageComponent
                         setValue={setValue}
                         name="file_surrender"
                         control={control}
                         image={data?.leavefile}
                       ></EditImageComponent>

                       
                    </>
                   ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_surrender";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_enter_doc"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit"? (
                    <>
                     <EditImageComponent
                         setValue={setValue}
                         name="file_enter_doc"
                         control={control}
                         image={data?.leavefile}
                       ></EditImageComponent>

                       
                    </>
                   ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_enter_doc";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="กรุณากรอกข้อมูล"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date"
                          className={`border-gray-200  px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
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

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_payment_do"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit"? (
                    <>
                     <EditImageComponent
                         setValue={setValue}
                         name="file_payment_do"
                         control={control}
                         image={data?.leavefile}
                       ></EditImageComponent>

                       
                    </>
                   ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_payment_do";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
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
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="0.00"
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
                  <p>{data?.amount_payment_do}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    ไฟล์แนบสลิป
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_amount_payment_do"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                 ) : dataStatus.type == "edit"? (
                  <>
                   <EditImageComponent
                       setValue={setValue}
                       name="file_amount_payment_do"
                       control={control}
                       image={data?.leavefile}
                     ></EditImageComponent>

                     
                  </>
                 ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "file_amount_payment_do";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

                          return (
                            <>
                              <ViewImageComponent
                                key="file_amount_payment_do"
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
              <div className="w-1/2 p-5 flex">
                <label className="block mb-2 text-lg text-gray-500  mr-5 sm:text-sm font-semibold">
                  มัดจำตู้
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    className="peer"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <div
                    className={`relative   
 w-11 h-6 bg-gray-200  rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white    
 after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all   
  peer-checked:bg-[#262C47]`}
                  ></div>
                </label>
              </div>
            </div>

            {isChecked && (
              <>
                <div className="flex">

                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่ Payment *
                    </label>


                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="payment_date"
                          control={control}
                          defaultValue={data?.payment_date}
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
                                              errors.payment_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                      </>
                    ) : (
                      <p>{data?.payment_date}</p>
                    )}
                  </div>


                  <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    ไฟล์แนบสลิป
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="payment_date_file"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                 ) : dataStatus.type == "edit"? (
                  <>
                   <EditImageComponent
                       setValue={setValue}
                       name="payment_date_file"
                       control={control}
                       image={data?.leavefile}
                     ></EditImageComponent>

                     
                  </>
                 ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.leavefile?.filter((res: { key: string }) => {
                          return res.key === "payment_date_file";
                        })?.map((images: any, index: number) => {
                          const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage = images.file_name?.endsWith('.jpg') ||images.file_name?.endsWith('.png') || images.file_name?.endsWith('.jpeg') || images.file_name?.endsWith('.webp');
                          const url =
                            process.env.NEXT_PUBLIC_URL_API + images.file_path;

                          return (
                            <>
                              <ViewImageComponent
                                key={index}                              
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
                      ราคามัดจำตู้ *
                    </label>


                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="price_deposit"
                          control={control}
                          defaultValue={data?.price_deposit}
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
                                              errors.booking_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.booking_date && (
                          <p className="text-red-500">กรุณากรอกข้อมูล</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.price_deposit}</p>
                    )}
                  </div>
                </div>
              </>
            )}

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
                  disabled={isLoading}
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

export default DepartureComponent;
