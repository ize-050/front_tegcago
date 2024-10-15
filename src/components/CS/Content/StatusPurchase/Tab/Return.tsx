"use client";

import React, { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm, editReturn } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
//image
import UploadImageComponent from '@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab'
import EditImageComponent from '@/components/CS/Content/StatusPurchase/Tab/Image/EditImageComponent'
import { setOpenToast } from "@/stores/util";


import { createReturn } from "@/stores/statusOrder";

//service
import { getReturn } from "@/services/statusOrder";
import ViewImageComponent from "../Image/ViewImageComponent";
import { set } from "lodash";

const ReturnComponent = ({ purchase }: { purchase: any }) => {
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
    type: "create",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isChecked_return, setIsChecked_return] = useState(false);
  const [isChecked_cabinet, setIsChecked_cabinet] = useState(false);
  const [id_return, setIdreturn] = useState("");

  const [data, setData] = useState<any>({});

    useEffect(() => {
      setStatus(status);
    }, [status]);

    const fetchData = useCallback(
      async (id_get: string) => {
        try {
          
          const response:any = await getReturn(id_get);
          if(response?.cabinet){
            setIsChecked(true)
          }
          if(response?.request_return){
            setIsChecked_return(true)
          }
          if(response?.return_cabinet){
            setIsChecked_cabinet(true)
          }
          setData(response);
        } catch (error) {
          console.log(error);
        }
      },
      [dataCspurchase]
    );  


    useEffect(()=>{
      setValue("file_request_document_cabinet",[])
      setValue("file_repair_cabinet",[])
      setValue("file_document_cabinet",[])
      setValue("file_price_deposit",[])
      setValue("file_request_deposit_cabinet",[])
      setValue("file_return_deposit_cabinet",[])
    },[])


    useEffect(() => {
      const checkCreate = dataCspurchase?.find((status: any) => {
        return status.status_key === "return_cabinet";
      });
      if (checkCreate?.status_key == "return_cabinet") {
        fetchData(checkCreate.id);
        setIdreturn(checkCreate.id);
        dispatch(
          setForm({
            id: "11",
            tabName: "คืนตู้",
            tabKey: "return_cabinet",
            active: true,
            type: "view",
          })
        );
      } else {
        dispatch(
          setForm({
            id: "11",
            tabName: "คืนตู้",
            tabKey: "return_cabinet",
            active: true,
            type: "create",
          })
        );
      }

    }, [dataCspurchase]);
 
  const onSubmit = async (dataForm: any) => {
    try {
      if(isChecked){
        dataForm.cabinet = true
      }else{
        dataForm.cabinet = false
      }
      if(isChecked_return){
        dataForm.request_return = true
      }else{
        dataForm.request_return = false
      }
      if(isChecked_cabinet){
        dataForm.return_cabinet = true
      }
      else{
        dataForm.return_cabinet = false
      }
      let formData = {
        ...dataForm,
        d_purchase_id: purchase?.id,
      };
      if (status.type === "create") {
        console.log("dddd")
        dispatch(createReturn(formData)).then((response: any) => {
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
        console.log("data.id", data.id);
        formData.id = data.id;
        dispatch(editReturn(formData)).then((response: any) => {
          console.log("responseedit", response);
          if (response.payload.data.statusCode == 200) {
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: "แก้ไขข้อมูลสำเร็จ",
              })
            );
            fetchData(id_return);
          }
        });

      }
    } catch (err: any) {
      console.log("err",err)
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Fragment>
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดการคืนตู้
              </h1>
            </div>
            <div className="flex-end justify-center mt-1">
            {dataStatus.type == "view" && (
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
                  วันที่คืนตู้
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_return_cabinet"
                      control={control}
                      defaultValue={data?.date_return_cabinet}
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
                                              errors.date_return_cabinet
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.booking_date && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_return_cabinet}</p>
                )}
              </div>
            </div>

            <hr></hr>

            <div className="flex">
              <div className="w-1/2 p-5 flex">
                <label className="block mb-2 text-lg text-gray-500  mr-5 sm:text-sm font-semibold">
                  ซ่อมตู้
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    className=" peer"
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
                      วันที่ซ่อมตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_cabinet"
                          control={control}
                          defaultValue={data?.date_cabinet}
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
                                              errors.date_cabinet
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_cabinet && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_cabinet}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสารขอซ่อมตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_document_cabinet"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_document_cabinet"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_document_cabinet";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                              images.file_name?.endsWith(".xlsx") ||
                              images.file_name?.endsWith(".xls") ||
                              images.file_name?.endsWith(".csv");
                            const isPdf = images.file_name?.endsWith(".pdf");
                            const isImage =
                              images.file_name?.endsWith(".jpg") ||
                              images.file_name?.endsWith(".png");
                            const url =
                              process.env.NEXT_PUBLIC_URL_API + images.file_path;

                              console.log("url",url)
      
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
                      ค่าซ่อมตู้ *
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="price_repair_cabinet"
                          control={control}
                          defaultValue={data?.price_repair_cabinet}
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
                                              errors.price_repair_cabinet
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.price_repair_cabinet && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.price_repair_cabinet}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ค่าซ่อมตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_repair_cabinet"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_repair_cabinet"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_repair_cabinet";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png");
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
              </>
            )}

            <div className="flex">
              <div className="w-1/2 p-5 flex">
                <label className="block mb-2 text-lg text-gray-500  mr-5 sm:text-sm font-semibold">
                  ขอคืนมัดจำตู้
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    className=" peer"
                    checked={isChecked_return}
                    onChange={() => {
                      setIsChecked_return(!isChecked_return);
                    }}
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

            {isChecked_return && (
              <>
                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      วันที่คืนมัดจำตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_request_return"
                          control={control}
                          defaultValue={data?.date_request_return}
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
                                              errors.date_request_return
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.date_request_return && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.date_request_return}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสารขอคืนมัดจำตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_request_document_cabinet"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_request_document_cabinet"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_request_document_cabinet";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png");
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
                      ค่าขอมัดจำตู้ *
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="price_request_return"
                          control={control}
                          defaultValue={data?.price_request_return}
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
                                              errors.price_request_return
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.price_request_return && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.price_request_return}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        สลิปค่าขอมัดจำตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_request_deposit_cabinet"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_request_deposit_cabinet"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_request_deposit_cabinet";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                              images.file_name?.endsWith(".xlsx") ||
                              images.file_name?.endsWith(".xls") ||
                              images.file_name?.endsWith(".csv");
                            const isPdf = images.file_name?.endsWith(".pdf");
                            const isImage =
                              images.file_name?.endsWith(".jpg") ||
                              images.file_name?.endsWith(".png");
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
              </>
            )}

            <div className="flex">
              <div className="w-1/2 p-5 flex">
                <label className="block mb-2 text-lg text-gray-500  mr-5 sm:text-sm font-semibold">
                  คืนมัดจำตู้
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    className="peer"
                    checked={isChecked_cabinet}
                    onChange={() => {
                      setIsChecked_cabinet(!isChecked_cabinet);
                    }}
                  />
                  <div
                    className={`relative   
 w-11 h-6 bg-gray-200  rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']   
 after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all   
  peer-checked:bg-[#262C47]`}
                  ></div>
                </label>
              </div>
            </div>

            {isChecked_cabinet && (
              <>
                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Deposit ยอดค่ามัดจำตู้ *
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
                                              errors.price_deposit
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.price_deposit && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.price_deposit}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสาร คืนมัดจำตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_price_deposit"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_price_deposit"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_price_deposit";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png");
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
                      ยอดคืนมัดจำตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="price_return_cabinet"
                          control={control}
                          defaultValue={data?.price_return_cabinet}
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
                                              errors.price_return_cabinet
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.price_return_cabinet && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.price_return_cabinet}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        สลิปยอดคืนมัดจำตู้
                      </label>

                      {dataStatus.type == "create" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            name="file_return_deposit_cabinet"
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : dataStatus.type == "edit"? (
                       <>
                        <EditImageComponent
                            setValue={setValue}
                            name="file_return_deposit_cabinet"
                            control={control}
                            image={data?.cs_return_cabinet_file}
                          ></EditImageComponent>

                          
                       </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.cs_return_cabinet_file?.filter((res: { key: string }) => {
                            return res.key === "file_return_deposit_cabinet";
                          })?.map((images: any, index: number) => {
                            console.log("images", images);
                            const isExcel =
                            images.file_name?.endsWith(".xlsx") ||
                            images.file_name?.endsWith(".xls") ||
                            images.file_name?.endsWith(".csv");
                          const isPdf = images.file_name?.endsWith(".pdf");
                          const isImage =
                            images.file_name?.endsWith(".jpg") ||
                            images.file_name?.endsWith(".png");
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

export default ReturnComponent;
