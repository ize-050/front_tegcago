"use client";

import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";
import { CirclePlus } from "lucide-react";
import Table from "@/components/Base/Table";

//service
import { getContain } from "@/services/statusOrder";

//store
import {
  statusOrderData,
  setEditForm,
  setForm,
  createContain,
} from "@/stores/statusOrder";
import { setOpenToast } from "@/stores/util";
import ViewImageComponent from "./ViewImagecomponent";

interface ModalContainProps {
  purchase: any;
  setModalstatus: any;
}
const ModalContainComponent: React.FC<ModalContainProps> = ({
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
    type: "create",
  });

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setStatus(status);
  }, [status]);

  const fetchData = useCallback(
    async (id_get: string) => {
      try {
        const response = await getContain(id_get);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    },
    [dataCspurchase]
  );

  useEffect(() => {
    const checkCreate = dataCspurchase?.find((status: any) => {
      return status.status_key === "Contain";
    });
    if (checkCreate?.status_key == "Contain") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "3",
          tabName: "บรรจุตู้",
          tabKey: "Contain",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "3",
          tabName: "บรรจุตู้",
          tabKey: "Contain",
          active: true,
          type: "create",
        })
      );
    }
  }, [dataCspurchase]);

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data);
      const formData = {
        ...data,
        d_purchase_id: purchase?.id,
      };
      if (status.type === "create") {
        dispatch(createContain(formData)).then((response: any) => {
          if (response.payload.data.statusCode == 200) {
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: response.payload.message,
              })
            );
            fetchData(response.payload.data.id);
          }
        });
      } else {
      }
    } catch (err: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      location.reload();
      console.log("errr", err);
    } finally {
      //   setTimeout(() => {
      //       location.reload()
      //   }, 2000)
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    append({ product_name: "", product_hscode: "" });
  }, []);

  const changeEdit = (value: boolean) => {
    if (value) {
      dispatch(setEditForm("edit"));
    } else {
      dispatch(setEditForm("view"));
    }
  };

  const handleAddRow = () => {
    append({ product_name: "", product_hscode: "" });
  };

  const TablePlus: React.FC = () => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

    const handleDeleteRow = (index: number) => {
      remove(index);
    };

    return (
      <div className="w-full">
        <Table className="w-full">
          <Table.Tr>
            <Table.Th>สินค้า</Table.Th>
            <Table.Th>H.s.Code</Table.Th>
            <Table.Th></Table.Th> {/* Empty header for the delete button */}
          </Table.Tr>

          {fields.map((field: any, index: number) => (
            <Table.Tr key={field.id}>
              <Table.Td>
                <Controller
                  name={`items.${index}.product_name`}
                  control={control}
                  defaultValue={""}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <input
                      {...field}
                      placeholder="กรอก"
                      type="text"
                      className={`
                        border-${fieldState.invalid ? "red-500" : "gray-200"}
                        px-4 py-2 outline-none rounded-md w-full`}
                    />
                  )}
                />
                {Array.isArray(errors.items) &&
                  errors.items[index]?.product_name && (
                    <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                  )}
              </Table.Td>
              <Table.Td>
                <Controller
                  name={`items.${index}.product_hscode`}
                  control={control}
                  defaultValue={""}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <input
                      {...field}
                      placeholder="กรอก"
                      type="text"
                      className={`
                        border-${fieldState.invalid ? "red-500" : "gray-200"}
                        px-4 py-2 outline-none rounded-md w-full`}
                    />
                  )}
                />
                {Array.isArray(errors.items) &&
                  errors.items[index]?.product_hscode && (
                    <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                  )}
              </Table.Td>

              <Table.Td>
                <button
                  type="button"
                  onClick={() => handleDeleteRow(index)}
                  className="bg-red-300  hover:bg-red-700 w-8 h-8 rounded-lg"
                >
                  <Lucide
                    color="#FF5C5C"
                    icon="Trash"
                    className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                  ></Lucide>
                </button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    );
  };

  const TableView: React.FC = () => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

    const handleDeleteRow = (index: number) => {
      remove(index);
    };

    return (
      <div className="w-full">
        <Table className="w-full">
          <Table.Tr>
            <Table.Th>สินค้า</Table.Th>
            <Table.Th>H.s.Code</Table.Th>
          </Table.Tr>

          {data?.Contain_product?.map((field: any, index: number) => (
            <Table.Tr key={field.id}>
              <Table.Td>{field.product_name}</Table.Td>
              <Table.Td>{field.product_hscode}</Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    );
  };

  return (
    <Fragment>
     <div className="modal-overlay"></div>
      <div className="text-black pt-16  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายละเอียดบรรจุตู้
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
                      วันที่บรรจุตู้
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="date_booking"
                          control={control}
                          defaultValue={data?.date_booking}
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
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      Cartons Total
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="carbon_total"
                          control={control}
                          defaultValue={data?.carbon_total}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="0.0"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.carbon_total
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.carbon_total && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.carbon_total}</p>
                    )}
                  </div>

                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      CBM Total
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="cmb_total"
                          control={control}
                          defaultValue={dataStatus?.cmb_total}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="0.0"
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
                        {errors.cmb_total && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.cmb_total}</p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      N.W. Total
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="nw_total"
                          control={control}
                          defaultValue={dataStatus?.nw_total}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="0.0"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.nw_total
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.nw_total && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.nw_total}</p>
                    )}
                  </div>

                  <div className="w-1/2 p-5">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      G.W. Total
                    </label>
                    {dataStatus.type !== "view" ? (
                      <>
                        <Controller
                          name="gw_total"
                          control={control}
                          defaultValue={dataStatus?.gw_total}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              placeholder="0.0"
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              type="text"
                              className={`
                                            ${
                                              errors.gw_total
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                            />
                          )}
                        />
                        {errors.gw_total && (
                          <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                        )}
                      </>
                    ) : (
                      <p>{data?.gw_total} KG.</p>
                    )}
                  </div>
                </div>

                <div className="mx-auto text-black">
                  <div className="flex">
                    <div className=" flex-1 w-50  px-5  rounded-md">
                      <h1 className="mb-5  text-1xl font-semibold">
                        สินค้าทั้งหมด
                      </h1>
                    </div>

                    {dataStatus.type !== "view" ? (
                      <div className="flex-end justify-center mt-1">
                        <Button
                          type="button"
                          onClick={handleAddRow}
                          className="flex items-center px-4 py-2 space-x-2 bg-[#273A6F]    text-white rounded-lg hover:bg-blue-600"
                        >
                          <CirclePlus size={20} />
                          <span>เพิ่มข้อมูล</span>
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {dataStatus.type == "view" && (
                    <div className="flex mb-5">
                      <TableView></TableView>
                    </div>
                  )}

                  {dataStatus.type == "create" && (
                    <div className="flex mb-5">
                      <TablePlus></TablePlus>
                    </div>
                  )}
                </div>

                <div className="flex">
                  <div className=" flex-1 w-50  px-5  rounded-md">
                    <h1 className="mb-5  text-1xl font-semibold">
                      รูปภาพบรรจุตู้
                    </h1>
                  </div>
                </div>

                <div className="flex ">
                  <div className="p-5 w-1/2">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      รูปการตรวจตู้
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <div className="">
                          <UploadImageComponent
                            name="cabinet"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </div>
                      </>
                    ) : (
                      <div className="flex">
                        {data?.Contain_picture?.filter(
                          (res: { key: string }) => {
                            return res.key === "cabinet";
                          }
                        )?.map((images: any, index: number) => {
                          const isExcel =
                            images.picture_name?.endsWith(".xlsx") ||
                            images.picture_name?.endsWith(".xls") ||
                            images.picture_name?.endsWith(".csv");
                          const isPdf = images.picture_name?.endsWith(".pdf");
                          const isImage =
                            images.picture_name?.endsWith(".jpg") ||
                            images.picture_name?.endsWith(".png");
                          const url =
                            process.env.NEXT_PUBLIC_URL_API +
                            images.picture_path;

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

                  <div className="p-5 w-1/2">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      รูปสินค้า
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <div className="">
                          <UploadImageComponent
                            name="product"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </div>
                      </>
                    ) : (
                      <div className="flex  flex-wrap ">
                        {data?.Contain_picture?.filter(
                          (res: { key: string }) => {
                            return res.key === "purchase_file";
                          }
                        )?.map((images: any, index: number) => {
                          const isExcel =
                            images.picture_name?.endsWith(".xlsx") ||
                            images.picture_name?.endsWith(".xls") ||
                            images.picture_name?.endsWith(".csv");
                          const isPdf = images.picture_name?.endsWith(".pdf");
                          const isImage =
                            images.picture_name?.endsWith(".jpg") ||
                            images.picture_name?.endsWith(".png");
                          const url =
                            process.env.NEXT_PUBLIC_URL_API +
                            images.picture_path;

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

                <div className="flex ">
                  <div className="p-5 w-1/2">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      รูปปิดตู้
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <div className="">
                          <UploadImageComponent
                            name="close_cabinet"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </div>
                      </>
                    ) : (
                      <div className="flex  flex-wrap ">
                        {data?.Contain_picture?.filter(
                          (res: { key: string }) => {
                            return res.key === "close_cabinet";
                          }
                        )?.map((images: any, index: number) => {
                          const isExcel =
                            images.picture_name?.endsWith(".xlsx") ||
                            images.picture_name?.endsWith(".xls") ||
                            images.picture_name?.endsWith(".csv");
                          const isPdf = images.picture_name?.endsWith(".pdf");
                          const isImage =
                            images.picture_name?.endsWith(".jpg") ||
                            images.picture_name?.endsWith(".png");
                          const url =
                            process.env.NEXT_PUBLIC_URL_API +
                            images.picture_path;

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

                  <div className="p-5 w-1/2">
                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                      รูปอื่นๆ
                    </label>

                    {dataStatus.type !== "view" ? (
                      <>
                        <div className="">
                          <UploadImageComponent
                            name="etc"
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </div>
                      </>
                    ) : (
                      <div className="flex  flex-wrap ">
                        {data?.Contain_picture?.filter(
                          (res: { key: string }) => {
                            return res.key === "etc";
                          }
                        )?.map((images: any, index: number) => {
                          const isExcel =
                            images.picture_name?.endsWith(".xlsx") ||
                            images.picture_name?.endsWith(".xls") ||
                            images.picture_name?.endsWith(".csv");
                          const isPdf = images.picture_name?.endsWith(".pdf");
                          const isImage =
                            images.picture_name?.endsWith(".jpg") ||
                            images.picture_name?.endsWith(".png");
                          const url =
                            process.env.NEXT_PUBLIC_URL_API +
                            images.picture_path;

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

export default ModalContainComponent;
