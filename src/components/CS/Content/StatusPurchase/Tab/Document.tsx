"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";

//formcreateImage
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";
// import EditImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/EditImageComponent";
import EditImageComponent from "@/components/Content/ApprovePurchase/EditImagecomponent";

// viewImage
import ViewImageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";

//service
import {
  createDocumentStatus,
  editDocumentStatus,
  getDocumentStatus,
} from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";

const DocumentComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();
  const [data, setData] = useState<any>({});
  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const [document_id, setDocumentId] = useState<any>(null);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = methods;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dataStatus, setStatus] = useState<Partial<any>>({
    type: "create",
  });

  const fetchData = async (id: any) => {
    try {
      const response: any = await getDocumentStatus(id);
      setData(response);
    } catch (err: any) {
      console.log("err", err);
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
      return status.status_key === "Document";
    });
    if (checkCreate?.status_key == "Document") {
      fetchData(checkCreate.id);
      setDocumentId(checkCreate.id);
      dispatch(
        setForm({
          id: "4",
          tabName: "จัดทำเอกสาร",
          tabKey: "Document",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "4",
          tabName: "จัดทำเอกสาร",
          tabKey: "Document",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (dataForm: any) => {
    try {
      const formData = {
        ...dataForm,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
        const res: any = await createDocumentStatus(formData);
        if (res.statusCode === 200) {
          await fetchData(res.id);
          setDocumentId(res.id);
          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: res.message,
            })
          );
        }
      } else {
        formData.id = data.id;
        const res: any = await editDocumentStatus(formData);
        if (res.statusCode === 200) {
          await fetchData(document_id);

          dispatch(setEditForm("view"));
          dispatch(
            setOpenToast({
              type: "success",
              message: "แก้ไขข้อมูลสำเร็จ",
            })
          );
        }
      }
    } catch (err: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      // location.reload();
      dispatch(setEditForm("view"));
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
                รายละเอียดจัดทำเอกสาร
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
                  วันที่ Invoice Doc
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_invoice_date"
                      control={control}
                      defaultValue={data?.document_invoice_date}
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
                                              errors.document_invoice_date
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_invoice_date && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_invoice_date}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Invoice Doc
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_file_invoice"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_file_invoice"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <>
                      <div className="flex  flex-wrap ">
                        {data?.cs_document_file
                          ?.filter((res: { key: string }) => {
                            return res.key === "document_file_invoice";
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
                            console.log("url", url);
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
                  วันที่ Packing list Doc
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_packinglist"
                      control={control}
                      defaultValue={data?.document_packinglist}
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
                                              errors.document_packinglist
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_packinglist && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_packinglist}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Packing list Doc
                  </label>
                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_file_packing"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_file_packing"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "document_file_packing";
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
                  วันที่ Draft F/E
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_draft"
                      control={control}
                      defaultValue={data?.document_draft}
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
                                              errors.document_draft
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_draft && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_draft}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Draft F/E
                  </label>
                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_FE"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_FE"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "document_FE";
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
                  วันที่ ใบอนุญาตอื่นๆ
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_etc"
                      control={control}
                      defaultValue={data?.document_etc}
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
                                              errors.document_etc
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_etc && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_etc}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร ใบอนุญาตอื่นๆ
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_file_etc"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_file_etc"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "document_file_etc";
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
                  วันที่ Draft Invoice Doc
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_draft_invoice"
                      control={control}
                      defaultValue={data?.document_draft_invoice}
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
                                              errors.document_draft_invoice
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_draft_invoice && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_draft_invoice}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Draft Invoice Doc
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="file_draft_invoice"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="file_draft_invoice"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "file_draft_invoice";
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
                  วันที่ Draft B/L
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_draft_bl"
                      control={control}
                      defaultValue={data?.document_draft_bl}
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
                                              errors.document_draft_bl
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_draft_bl && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_draft_bl}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Draft B/L
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_BL"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_BL"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "document_BL";
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
                  เอกสารอื่นๆ
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="document_master_bl"
                      control={control}
                      defaultValue={data?.document_master_bl}
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
                                              errors.document_master_bl
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.document_master_bl && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.document_master_bl}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    อัพโหลดเอกสาร Master B/L
                  </label>

                  {dataStatus.type == "create" ? (
                    <>
                      <UploadImageComponent
                        name="document_file_master_BL"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </>
                  ) : dataStatus.type == "edit" ? (
                    <>
                      <EditImageComponent
                        setValue={setValue}
                        name="document_file_master_BL"
                        control={control}
                        image={data?.cs_document_file}
                        item={data?.cs_document_file}
                      ></EditImageComponent>
                    </>
                  ) : (
                    <div className="flex  flex-wrap ">
                      {data?.cs_document_file
                        ?.filter((res: { key: string }) => {
                          return res.key === "document_file_master_BL";
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

export default DocumentComponent;
