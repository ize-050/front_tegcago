"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import Table from "@/components/Base/Table";
import { setOpenToast } from "@/stores/util";

//service
import { createDestination, getDestination, updateDestination } from "@/services/statusOrder";
import ViewImageComponent from "../Image/ViewImageComponent";
import EdituploadComponent from "./Image/EditImageNotkeyComponent";

const DestinationComponent = ({ purchase }: { purchase: any }) => {
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
    type: "view",
  });

  const [data, setData] = useState<any>({});
  const [des_id, setdesId] = useState<any>("")
 
  const fetchData = async (id: any) => {
    try {
      const response: any = await getDestination(id);
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
      return status.status_key === "Destination";
    });
    if (checkCreate?.status_key == "Destination") {
      fetchData(checkCreate.id);
      setdesId(checkCreate.id)
      dispatch(
        setForm({
          id: "9",
          tabName: "จัดส่งปลายทาง",
          tabKey: "Destination",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "9",
          tabName: "จัดส่งปลายทาง",
          tabKey: "Destination",
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
        id: data.id,
        d_purchase_id: purchase?.id,
      };
       if (dataStatus.type === "create") {
        delete formData.id;
      const response: any = await createDestination(formData);
      if (response.statusCode == 200) {
        await fetchData(response.id);
        dispatch(setEditForm("view"));
        dispatch(
          setOpenToast({
            type: "success",
            message: response.message,
          })
        );
       
      }
     }
     else if(dataStatus.type == "edit") {
      const response: any = await updateDestination(formData);
      if (response.statusCode == 200) {
       await  fetchData(des_id)
        dispatch(setEditForm("view"));
        dispatch(
          setOpenToast({
            type: "success",
            message: response.message,
          })
        );
       
      }
     }
    } catch (err: any) {
      console.log(err);
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      // location.reload()
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

  const TablePlus = () => {
    return (
      <Table>
        <Table.Tr>
          <Table.Th>No</Table.Th>
          <Table.Th>บริษัทรถ</Table.Th>
          <Table.Th>ประเภทรถ</Table.Th>
          <Table.Th>ป้ายทะเบียน</Table.Th>
          <Table.Th>พนักงานขับรถ</Table.Th>
          <Table.Th>เบอร์โทรศัพท์คนขับ</Table.Th>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>1</Table.Td>
          <Table.Td>{data?.waitrelease?.company_car}</Table.Td>
          <Table.Td>{data?.waitrelease?.type_car}</Table.Td>
          <Table.Td>{data?.waitrelease?.license_plate}</Table.Td>
          <Table.Td>{data?.waitrelease?.employee_driver}</Table.Td>
          <Table.Td>{data?.waitrelease?.phone_number}</Table.Td>
        </Table.Tr>
      </Table>
    );
  };

  return (
    <Fragment>
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">
                รายละเอียดกำลังไปส่งยังปลายทาง
              </h1>
            </div>
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
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
              <div className="w-1/2 p-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  วันที่จัดส่ง
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_receiving_cabinet"
                      control={control}
                      defaultValue={data?.date_receiving_cabinet}
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
                                              errors.date_receiving_cabinet
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_receiving_cabinet && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_receiving_cabinet}</p>
                )}
              </div>
              <div className="w-1/2">
                <div className="p-5">
                  <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                    แนบรูปรับตู้ออกจากท่าเรือ
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
                        image={data.cs_wait_destination_file}
                        control={control}
                      ></EdituploadComponent>
                    </div>
                  </>
                ) : (
                  <div className="flex  flex-wrap ">
                    {data?.cs_wait_destination_file?.map((images: any, index: number) => {
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
                )}

                </div>
              </div>
            </div>

            <div className="flex">
              <TablePlus></TablePlus>
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

export default DestinationComponent;
