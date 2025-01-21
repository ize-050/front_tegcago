"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import {
  customerData,
  setFormAddCustomer,
  submitFormAddcustomer,
} from "@/stores/customer";
import { Controller, useForm } from "react-hook-form";

const ModalCreateCustomer = () => {
  const dispatch = useAppDispatch();
  const { ModalCreate, formAddcustomer } = useAppSelector(customerData);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cus_code: "",
      cus_fullname: "",
      cus_line: "",
      cus_website: "",
      cus_etc: "",
      cd_company: "",
      cus_status: "",
      cus_phone: "",
    },
  });

  const setShowModal = (data: boolean) => {
    dispatch(setFormAddCustomer(data));
  };

  useEffect(() => {
    console.log("ModalCreate", ModalCreate);
  }, [ModalCreate]);

  useEffect(() => {
    console.log("formAddcustomer", formAddcustomer);
    if (formAddcustomer) {
      reset();
    }
  }, [formAddcustomer]);

  const onSubmit = (data: any) => {
    dispatch(submitFormAddcustomer(data));
  };
  return (
    <>
      {ModalCreate ? (
        <>
          <div className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-1xl font-semibold">
                    สร้างข้อมูลลูกค้าเบื้องต้น
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-5">
                      <label className="flex mb-1 text-gray-600 font-semibold">
                        รหัสลูกค้า
                        <div className="text-red-500">*</div>
                      </label>
                      <Controller
                        name="cus_code"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรุณากรอกรหัสลูกค้า"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cus_code
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cus_code && (
                        <p className="text-red-500">กรุณากรอกรหัสลูกค้า.</p>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="block flex mb-1 text-gray-600 font-semibold">
                        ชื่อบริษัท
                        <div className="text-red-500">*</div>
                      </label>
                      <Controller
                        name="cd_company"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอกชื่อบริษัท ถ้าไม่มีใส่ -"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cd_company
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cd_company && (
                        <p className="text-red-500">กรุณากรอกชื่อบริษัท.</p>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="block flex mb-1 text-gray-600 font-semibold">
                        ชื่อลูกค้า
                        <div className="text-red-500">*</div>
                      </label>
                      <Controller
                        name="cus_fullname"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอกชื่อลูกค้า"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cus_fullname
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cus_fullname && (
                        <p className="text-red-500">กรุณากรอก ชื่อ-นามสกุล.</p>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="block mb-1 text-gray-600 font-semibold">
                        เบอร์โทรศัพท์
                      </label>
                      <Controller
                        name="cus_phone"
                        control={control}
                        rules={{ required: true, maxLength: 10 }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอกเบอร์โทรศัพท์"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cus_phone
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cus_phone && (
                        <p className="text-red-500">กรุณากรอกเบอร์โทรศัพท์.</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block mb-1 text-gray-600 font-semibold">
                        ID Line
                      </label>
                      <Controller
                        name="cus_line"
                        control={control}
                        rules={{ required: true, maxLength: 10 }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="กรอก"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cus_line
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cus_line && (
                        <p className="text-red-500">กรุณากรอกID Line.</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block mb-1 text-gray-600 font-semibold">
                        Website
                      </label>
                      <Controller
                        name="cus_website"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <input
                            placeholder="www."
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            type="text"
                            className={`
                                            ${
                                              errors.cus_website
                                                ? "border-red-500"
                                                : "border-gray-200"
                                            }
                                            px-4 py-2 outline-none rounded-md w-full`}
                          />
                        )}
                      />
                      {errors.cus_website && (
                        <p className="text-red-500">กรุณากรอกID Line.</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block mb-1 text-gray-600 font-semibold">
                        ความสนใจ
                      </label>
                      <Controller
                        name="cus_status"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <select
                            onChange={onChange}
                            value={value}
                            id="countries"
                            className=" border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option selected>เลือก</option>
                            <option value="สนใจ">สนใจ</option>
                            <option value="ไม่สนใจ">ไม่สนใจ</option>
                            <option value="ติดตามต่อ">ติดตามต่อ</option>
                            <option value="ติดต่อไม่ได้">ติดต่อไม่ได้</option>
                            <option value="ปิดการขาย">ปิดการขาย</option>
                          </select>
                        )}
                      />
                      {errors.cus_status && (
                        <p className="text-red-500">กรุณาเลือกข้อมูล.</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block mb-1 text-gray-600 font-semibold">
                        ช่องทางการติดต่อ
                      </label>
                      <Controller
                        name="cus_etc"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <select
                            onChange={onChange}
                            value={value}
                            id="countries"
                            className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option selected>เลือก</option>
                            <option value="โทร">โทร</option>
                            <option value="ทัก">ทัก</option>
                            <option value="Walk-in">Walk-in</option>
                            <option value="ออกบูธ">ออกบูธ</option>
                          </select>
                        )}
                      />
                      {errors.cus_etc && (
                        <p className="text-red-500">กรุณาเลือก.</p>
                      )}
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end  rounded-b">
                    <button
                      style={{
                        border: "1px solid #417CA0",
                        color: "#305D79",
                        marginRight: "5px",
                      }}
                      className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      ยกเลิก
                    </button>
                    <button
                      className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                      // onClick={() => setShowModal(false)}
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ModalCreateCustomer;
