"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm } from "@/stores/statusOrder";

import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

const ReturnComponent = ({ purchase }: { purchase: any }) => {
  const methods = useForm();

  const { status } = useAppSelector(statusOrderData);

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
    type: "edit",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isChecked_return, setIsChecked_return] = useState(false);
  const [isChecked_cabinet, setIsChecked_cabinet] = useState(false);

  const [data, setData] = useState<any>({});

  //   useEffect(() => {
  //     setStatus(status);
  //   }, [status]);

  const onSubmit = async (data: any) => {
    console.log(data);
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
                  วันที่คืนตู้
                </label>
                {dataStatus.type !== "view" ? (
                  <>
                    <Controller
                      name="booking_date"
                      control={control}
                      defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                  <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสารขอซ่อมตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ค่าซ่อมตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสารขอซ่อมตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        สลิปค่าขอมัดจำตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        ไฟล์เอกสาร คืนมัดจำตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
                          name="booking_date"
                          control={control}
                          defaultValue={dataStatus?.booking_date}
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
                                              errors.booking_date
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
                      <p>{dataStatus?.booking_date}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <div className="p-5">
                      <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                        สลิปยอดคืนมัดจำตู้
                      </label>

                      {dataStatus.type !== "view" ? (
                        <>
                          <UploadImageComponent
                            setValue={setValue}
                            control={control}
                          ></UploadImageComponent>
                        </>
                      ) : (
                        <p>{dataStatus?.booking_date}</p>
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
