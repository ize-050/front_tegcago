"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import {
    useForm,
    Controller,
    SubmitHandler,
    FormProvider,
} from "react-hook-form";
import SocialMedia from "./SocialMedia";
import CompanyComponent from "./Company";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { customerData, ChangeFormEdit } from "@/stores/customer";
import Lucide from "@/components/Base/Lucide";

const ViewCustomer = () => {
    const dispatch = useAppDispatch();
    const [groupCustomer,setCustomerGroup] = useState<string>('')
    const { customer_detail, formEditcustomer,customerGroup } = useAppSelector(customerData);
    const methods = useForm();
    const router = useRouter();

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

    const changeEdit =  (data: boolean) => {
            dispatch(ChangeFormEdit(data));
        };
       
    useEffect(() => {
        Object.keys(customer_detail).forEach((field) => {
            setValue(field, customer_detail[field]);
        });

        const customer_group =     customerGroup.find(item=>item.id === customer_detail.cd_group_id)
        setCustomerGroup(customer_group?.group_name)
    }, [customer_detail]);

    return (
        <>
            <div className="p-5 mx-auto  text-black">
                <div className="flex">
                    <div className="flex-1 w-50">
                        <h1 className="mb-5  text-2xl">ข้อมูลลูกค้า</h1>
                    </div>

                    <div className="flex-1 w-50 justify-end right-0 flex space-x-4">
                        <button
                          onClick={() => changeEdit(!formEditcustomer)}
                          style={{
                              background: "#C8D9E3",
                          }}
                          className=" hover:bg-blue-500 w-8 h-8 rounded-lg mr-1"
                        >
                            <Lucide
                              color="#6C9AB5"
                              icon="Pencil"
                              className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                            ></Lucide>
                        </button>
                        <button className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg">
                            <Lucide
                              color="#FF5C5C"
                              icon="Trash"
                              className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                            ></Lucide>
                        </button>
                    </div>
                </div>

                <div className=" h-auto w-full ">
                    <div
                      className="bg-[#D2D6E1] bg-opacity-30 p-2  flex items-center">
                        <div
                          className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                            W
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">{customer_detail.cd_company}</h2>
                            <p className="text-sm text-gray-600">ชื่อลูกค้า: {customer_detail.cus_fullname}</p>
                            <p className="text-sm text-gray-600">เบอร์โทรศัพท์: {customer_detail.cus_phone}</p>
                        </div>
                    </div>
                </div>
                {/* <div className="container  mx-auto"> */}
                <div className=" flex  flex-col  md:flex-row  mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ตำแหน่งผู้ติดต่อ</label>
                        <p>{customer_detail.cd_department}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">สัญชาติ</label>
                        <p>{customer_detail.cus_international}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เพศ</label>
                        <p>{customer_detail.cus_sex}</p>
                    </div>


                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2  text-gray-700  text-sm">ความสนใจ</label>
                        <button
                          className={`badge  ${customer_detail.color} max-w-20 text-white  text-center   rounded-md`}
                        >
                            {customer_detail.cus_status}
                        </button>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ช่องทางการติดต่อ</label>
                        <p
                          className={`badge  ${customer_detail?.cus_etc_color} text-center  max-w-20 text-white   rounded-md`}
                        >
                            {customer_detail?.cus_etc}
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">อายุ
                            (โดยประมาณ)</label>
                        <p>{customer_detail.cus_age}</p>
                    </div>


                </div>

                <div className="w-full md:w-1/3 flex flex-col mb-5">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">กลุ่มลูกค้า</label>
                    <p>
                        {groupCustomer}</p>
                </div>


                <hr className="mb-5"></hr>
                <h1 className="mb-5  text-1xl">Social Media</h1>
                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Website</label>
                        <p>{customer_detail.cus_website}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ID Line</label>
                        <p>{customer_detail.cus_line}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Facebook</label>
                        <p>{customer_detail.cus_facebook}</p>
                    </div>
                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">


                </div>


                <hr className="mb-5"></hr>
                <h1 className="mb-5  text-1xl">ข้อมูลบริษัท</h1>
                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ผู้ตัดสินใจ</label>
                        <p>{customer_detail.cd_consider}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ประเภทสินค้านำเข้า-ส่งออก</label>
                        <p>{customer_detail.cd_typeinout}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ประเภทลูกค้า</label>
                        <p>{customer_detail.cd_custype}</p>
                    </div>
                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ประเภทใช้บริการ</label>
                        <p>{customer_detail.cd_cusservice}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ช่องทางการจัดจำหน่าย</label>
                        <p>{customer_detail.cd_typeinout}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">อายุบริษัท</label>
                        <p>{customer_detail.cd_num}</p>
                    </div>
                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ทุนบริษัท</label>
                        <p>฿{customer_detail.cd_capital}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">จำนวนกรรมการบริษัท</label>
                        <p>{customer_detail.cd_emp}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ผู้ถือหุ้น</label>
                        <p>{customer_detail.cd_shareholders}</p>
                    </div>
                </div>


                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่ตั้งสำนักงาน</label>
                        <p>{customer_detail.cd_address}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">จำนวนสาขา</label>
                        <p>{customer_detail.cd_num_saka}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">สิ่งที่กังวล/ให้ความสำคัญ</label>
                        <p>{customer_detail.cd_priority}</p>
                    </div>
                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ความถี่ในการนำเข้า</label>
                        <p>{customer_detail.cd_frequency}</p>
                    </div>


                    <div className="w-full md:w-1/3 flex flex-col">
                        <label
                          className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ขึ้นทะเบียนผู้นำเข้า</label>
                        <p>{customer_detail.cd_leader}</p>
                    </div>

                </div>


            </div>
        </>
    );
};

export default ViewCustomer;
