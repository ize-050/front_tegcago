
"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { setOpenToast} from "@/stores/util";

//service
import { getEtc, createEtc } from "@/services/statusOrder";

const EtcComponent = ({ purchase, setModalstatus }: { purchase: any, setModalstatus: (index: string) => void }) => {
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

  const fetchData = async (id: any) => {
    try {
      const response: any = await getEtc(id);
      setData(response);
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const checkCreate = dataCspurchase.find((status: any) => {
      return status.status_key === "Etc";
    });
    if (checkCreate?.status_key == "Etc") {
      fetchData(checkCreate.id);
      dispatch(
        setForm({
          id: "12",
          tabName: "หมายเหตุ",
          tabKey: "Etc",
          active: true,
          type: "view",
        })
      );
    } else {
      dispatch(
        setForm({
          id: "12",
          tabName: "หมายเหตุ",
          tabKey: "Etc",
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
      //   if (dataStatus.type === "create") {
      const response: any = await createEtc(formData);
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
      //   }
    } catch (err: any) {
      console.log(err);
      dispatch(
        setOpenToast({
          type: "error",
          message: err.message,
        })
      );
      //   location.reload();
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
    <div className="modal-overlay"></div>
      <div className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                กำลังส่งไปยังปลายทาง
              </h3>
          </div>
        

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex p-5">
              <div className="w-1/2 pr-5">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  หมายเหตุ
                </label>

                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="etc"
                      control={control}
                      defaultValue={data?.etc}
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
                                              errors.etc
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.etc && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.etc}</p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                  วันที่บันทึก
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="date_etc"
                      control={control}
                      defaultValue={data?.date_etc}
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
                                              errors.date_etc
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                        />
                      )}
                    />
                    {errors.date_etc && (
                      <p className="text-red-500">กรุณากรอกข้อมูล.</p>
                    )}
                  </>
                ) : (
                  <p>{data?.date_etc}</p>
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

export default EtcComponent;
