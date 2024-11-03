"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm, setForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { setOpenToast } from "@/stores/util";

//service
import { getEtc  ,createEtc} from "@/services/statusOrder";
import ViewImageComponent from "../Image/ViewImageComponent";

const EtcComponent = ({ purchase }: { purchase: any }) => {
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
      <div>
        <div className="mx-auto text-black">
          <div className="flex bg-gray-50">
            <div className=" flex-1 w-50  px-5  rounded-md">
              <h1 className="mb-5  text-1xl font-semibold">หมายเหตุ</h1>
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

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
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

export default EtcComponent;
