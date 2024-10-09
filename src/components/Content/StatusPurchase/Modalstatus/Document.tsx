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

// viewImage
//import ViewImageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";

import ViewImageComponent from "./ViewImagecomponent";

//service
import {
  createDocumentStatus,
  getDocumentStatus,
} from "@/services/statusOrder";
import { setOpenToast } from "@/stores/util";

interface ModalDocumentProps {
  purchase: any;
  setModalstatus: (index: string) => void;
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = ({
  purchase,
  setModalstatus,
}) => {
  const methods = useForm();
  const [data, setData] = useState<any>({});
  const { status, dataCspurchase } = useAppSelector(statusOrderData);

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

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      if (dataStatus.type === "create") {
        const res: any = await createDocumentStatus(formData);
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
    } catch (err: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      location.reload();
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
      <div className="modal-overlay"></div>
      <div className="text-black pt-16 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[80vh] overflow-y-auto">
            {/* <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5 bg-gray-50  text-1xl font-semibold">
                รายละเอียดจัดทำเอกสาร
              </h1>
            </div> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายละเอียดจัดทำเอกสาร
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
                      วันที่ Invoice Doc
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="document_invoice_date"
                          control={control}
                          defaultValue={data?.document_invoice_date}
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

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="document_file_invoice"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <>
                          <div className="flex  flex-wrap ">
                            {data?.Cs_document_file?.filter(
                              (res: { key: string }) => {
                                return res.key === "document_file_invoice";
                              }
                            )?.map((images: any, index: number) => {
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
                          defaultValue={data?.booking_date}
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
                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="document_file_packing"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.Cs_document_file?.filter(
                            (res: { key: string }) => {
                              return res.key === "document_file_packing";
                            }
                          )?.map((images: any, index: number) => {
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
                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="document_FE"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.Cs_document_file?.filter(
                            (res: { key: string }) => {
                              return res.key === "document_FE";
                            }
                          )?.map((images: any, index: number) => {
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

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="document_file_etc"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.Cs_document_file?.filter(
                            (res: { key: string }) => {
                              return res.key === "document_file_etc";
                            }
                          )?.map((images: any, index: number) => {
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

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="file_draft_invoice"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.Cs_document_file?.filter(
                            (res: { key: string }) => {
                              return res.key === "file_draft_invoice";
                            }
                          )?.map((images: any, index: number) => {
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

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            name="document_BL"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <div className="flex  flex-wrap ">
                          {data?.Cs_document_file?.filter(
                            (res: { key: string }) => {
                              return res.key === "document_BL";
                            }
                          )?.map((images: any, index: number) => {
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
                      วันที่ Master B/L
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="document_master_bl"
                          control={control}
                          defaultValue={data?.document_master_bl}
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

                      <div className="flex  flex-wrap ">
                        {data?.Cs_document_file?.filter(
                          (res: { key: string }) => {
                            return res.key === "document_file_master_BL";
                          }
                        )?.map((images: any, index: number) => {
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
                    </div>
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
                    onClick={() => {
                      setModalstatus("");
                    }}
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

export default ModalDocumentComponent;
