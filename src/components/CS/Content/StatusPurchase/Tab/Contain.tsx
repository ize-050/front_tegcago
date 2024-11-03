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
  editContain,
} from "@/stores/statusOrder";
import { setOpenToast } from "@/stores/util";

//image
import ViewImageComponent from "../Image/ViewImageComponent";
import EdituploadComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/EditImageComponent";
import { set } from "lodash";

const ContainComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const { status, dataCspurchase } = useAppSelector(statusOrderData);
  const [id_contains, setIdContains] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
        let response: any = await getContain(id_get);
        const Formdata = response;
        setData(Formdata);

        // delete response["Contain_picture"];
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
      setIdContains(checkCreate.id);
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

  const onSubmit = async (form: any) => {
    try {
      let formData = {
        ...form,
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
        console.log("data.id", data.id);
        formData.id = data.id;
        dispatch(editContain(formData)).then((response: any) => {
          console.log("responseedit", response);
          if (response.payload.data.statusCode == 200) {
            dispatch(setEditForm("view"));
            dispatch(
              setOpenToast({
                type: "success",
                message: "แก้ไขข้อมูลสำเร็จ",
              })
            );
            fetchData(id_contains);
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

  const TablePlus: React.FC = () => {
    const handleAddRow = () => {
      append({ product_name: "", product_hscode: "" });
    };

    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

    const handleDeleteRow = (index: number) => {
      remove(index);
    };

    return (
      <div className="w-full">
        <div className="flex flex-end justify-end mt-1 mr-5">
          <Button
            type="button"
            onClick={handleAddRow}
            className="flex items-center px-4 py-2 space-x-2 bg-[#273A6F]    text-white rounded-lg hover:bg-blue-600"
          >
            <CirclePlus size={20} />
            <span>เพิ่มข้อมูล</span>
          </Button>
        </div>
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

          {data?.contain_product?.map((field: any, index: number) => (
            <Table.Tr key={field.id}>
              <Table.Td>{field.product_name}</Table.Td>
              <Table.Td>{field.product_hscode}</Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    );
  };

  const TableEdit: React.FC = () => {
    const handleAddRow = () => {
      append({ product_name: "", product_hscode: "" });
    };

    const {
      control,
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

    useEffect(() => {
      data.Contain_product.forEach((item: any) => append(item));
    }, [append]);

    const handleDeleteRow = (index: number) => {
      remove(index);
    };

    return (
      <div className="w-full">
        <div className="flex flex-end justify-end mt-1 mr-5">
          <Button
            type="button"
            onClick={handleAddRow}
            className="flex items-center px-4 py-2 space-x-2 bg-[#273A6F]    text-white rounded-lg hover:bg-blue-600"
          >
            <CirclePlus size={20} />
            <span>เพิ่มข้อมูล</span>
          </Button>
        </div>
        <form>
          {" "}
          {/* เพิ่ม tag <form> */}
          <Table className="w-full">
            <Table.Tr>
              <Table.Th>สินค้า</Table.Th>
              <Table.Th>H.s.Code</Table.Th>
            </Table.Tr>

            {fields.map((field: any, index: number) => (
              <Table.Tr key={field.id}>
                <Table.Td>
                  <Controller
                    name={`items.${index}.product_name`}
                    control={control}
                    defaultValue={field.product_name} // ใช้ defaultValue จาก field
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
                    defaultValue={field.product_hscode} // ใช้ defaultValue จาก field
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
        </form>{" "}
        {/* ปิด tag <form> */}
      </div>
    );
  };

  return (
    <Fragment>
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดบรรจุตู้
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
                  วันที่บรรจุตู้
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
                  SHIPMENT
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="type_contain"
                      control={control}
                      defaultValue={data?.type_contain}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <select
                          onChange={onChange}
                          value={value}
                          className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">กรุณาเลือกข้อมูล</option>
                          <option value="SEA">SEA</option>
                          <option value="CLG">CLG</option>
                          <option value="MG">MG</option>
                          <option value="LCL">LCL</option>
                          <option value="AW">AW</option>
                        </select>
                      )}
                    />
                    {errors.type_contain && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.type_contain}</p>
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
                      rules={{ required: false }}
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
                      defaultValue={data?.cmb_total}
                      rules={{ required: false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <input
                          placeholder="0.0"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text"
                          className={`
                                            ${
                                              errors.cmb_total
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
                      defaultValue={data?.nw_total}
                      rules={{ required: false }}
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
                      defaultValue={data?.gw_total}
                      rules={{ required: false }}
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

              {dataStatus.type == "edit" && (
                <div className="flex mb-5">
                  <TableEdit></TableEdit>
                </div>
              )}
            </div>

            <div className="flex">
              <div className=" flex-1 w-50  px-5  rounded-md">
                <h1 className="mb-5  text-1xl font-semibold">รูปภาพบรรจุตู้</h1>
              </div>
            </div>

            <div className="flex ">
              <div className="p-5 w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  แนบรูปการตรวจตู้
                </label>

                {dataStatus.type == "create" ? (
                  <>
                    <div className="">
                      <UploadImageComponent
                        name="cabinet"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : dataStatus.type == "edit" ? (
                  <>
                    <div className="">
                      <EdituploadComponent
                        name="cabinet"
                        setValue={setValue}
                        image={data.contain_picture}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
                  <div className="flex  flex-wrap ">
                    {data?.contain_picture?.filter((res: { key: string }) => {
                      return res.key === "cabinet";
                    })?.map((images: any, index: number) => {
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

              <div className="p-5 w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  แนบรูปสินค้า
                </label>

                {dataStatus.type == "create" ? (
                  <>
                    <div className="">
                      <UploadImageComponent
                        name="purchase_file"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : dataStatus.type == "edit" ? (
                  <>
                    <div className="">
                      <EdituploadComponent
                        name="purchase_file"
                        setValue={setValue}
                        image={data.contain_picture}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
                  <div className="flex  flex-wrap ">
                    {data?.contain_picture?.filter((res: { key: string }) => {
                      return res.key === "purchase_file";
                    })?.map((images: any, index: number) => {
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

            <div className="flex ">
              <div className="p-5 w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  แนบรูปปิดตู้
                </label>

                {dataStatus.type == "create" ? (
                  <>
                    <div className="">
                      <UploadImageComponent
                        name="close_cabinet"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : dataStatus.type == "edit" ? (
                  <>
                    <div className="">
                      <EdituploadComponent
                        name="close_cabinet"
                        setValue={setValue}
                        image={data.contain_picture}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
                  <div className="flex  flex-wrap ">
                    {data?.contain_picture?.filter((res: { key: string }) => {
                      return res.key === "close_cabinet";
                    })?.map((images: any, index: number) => {
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

              <div className="p-5 w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  แนบรูปอื่นๆ
                </label>

                {dataStatus.type == "create" ? (
                  <>
                    <div className="">
                      <UploadImageComponent
                        name="etc"
                        setValue={setValue}
                        control={control}
                      ></UploadImageComponent>
                    </div>
                  </>
                ) : dataStatus.type == "edit" ? (
                  <>
                    <div className="">
                      <EdituploadComponent
                        name="etc"
                        setValue={setValue}
                        image={data.contain_picture}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
                  <div className="flex  flex-wrap ">
                    {data?.contain_picture?.filter((res: { key: string }) => {
                      return res.key === "etc";
                    })?.map((images: any, index: number) => {
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

export default ContainComponent;
