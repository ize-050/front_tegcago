'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, SubmitHandler ,FormProvider} from "react-hook-form"
import SocialMedia from './SocialMedia';
import CompanyComponent from './Company';
import { useAppDispatch ,useAppSelector } from '@/stores/hooks';
import {customerData} from '@/stores/customer'

const DetailCustomer = () => {
    const dispatch = useAppDispatch();
    const { customer_detail } =  useAppSelector(customerData)
    const  methods = useForm()

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
    
    


    const onSubmit = (data: any) => {
        console.log('data',data)
    }
    
    useEffect(()=>{
        Object.keys(customer_detail).forEach((field) => {
            setValue(field, customer_detail[field]); 
          });

           
        
    },[customer_detail])

    return (
        <>
            <div className="p-5 text-black">
                <h1 className="mb-5  text-2xl">ข้อมูลลูกค้า</h1>
                <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ชื่อบริษัท</label>
                            <Controller
                                name="cd_company"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}

                            />
                            {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>}
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ชื่อลูกค้า</label>
                            <Controller
                                name="cus_fullname"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}

                            />
                            {errors.cus_fullname && <p className="text-red-500">กรุณากรอกชื่อ-นามสกุล</p>}
                        </div>
                    </div>
                    <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เบอร์โทรศัพท์</label>
                            <Controller
                                name="cus_phone"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}
                            />
                            {errors.cus_phone && <p className="text-red-500">กรุณากรอกอายุ.</p>}
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ตำแหน่งผู้ติดต่อ</label>
                            <Controller
                                name="cd_department"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}

                            />
                            
                        </div>
                    </div>


                    <div className="flex   flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                        <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-1/2 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">สัญชาติ</label>
                                <Controller
                                    name="cus_international"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <select
                                            onChange={onChange}
                                            value={value}
                                            id="countries" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option selected>เลือก</option>
                                            <option value="ไทย">ไทย</option>
                                            <option value="อังกฤษ">อังกฤษ</option>
                                            <option value="จีน">จีน</option>

                                        </select>
                                    )}

                                />
                                {errors.cus_international && <p className="text-red-500">กรุณาเลือก.</p>}
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">เพศ</label>
                                <Controller
                                    name="cus_sex"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <select
                                            onChange={onChange}
                                            value={value}
                                            id="countries" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option selected>เลือก</option>
                                            <option value="ชาย">ชาย</option>
                                            <option value="หญิง">หญิง</option>


                                        </select>
                                    )}

                                />
                                {errors.cus_sex && <p className="text-red-500">กรุณาเลือก.</p>}
                            </div>

                        </div>

                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">อายุ (โดยประมาณ)</label>
                            <Controller
                                name="cus_age"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}

                            />
                            {errors.cus_age && <p className="text-red-500">กรุณากรอกอายุ.</p>}

                        </div>


                    </div>

                    <div className="flex   flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-1/2 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ความสนใจ</label>
                                <Controller
                                    name="cus_status"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <select
                                            onChange={onChange}
                                            value={value}
                                            id="countries" className=" border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option selected>เลือก</option>
                                            <option value="สนใจ">สนใจ</option>
                                            <option value="ไม่สนใจ">ไม่สนใจ</option>
                                            <option value="ติดตามต่อ">ติดตามต่อ</option>
                                            <option value="ติดต่อไม่ได้">ติดต่อไม่ได้</option>
                                            <option value="ปิดการขาย">ปิดการขาย</option>
                                        </select>
                                    )}

                                />
                                {errors.cus_status && <p className="text-red-500">กรุณาเลือกข้อมูล.</p>}
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ช่องทางการติดต่อ</label>
                                <Controller
                                    name="cus_etc"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <select
                                            onChange={onChange}
                                            value={value}
                                            id="countries" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option selected>เลือก</option>
                                            <option value="โทร">โทร</option>
                                            <option value="ทัก">ทัก</option>
                                            <option value="Walk-in">Walk-in</option>
                                            <option value="ออกบูธ">ออกบูธ</option>
                                        </select>
                                    )}

                                />
                                {errors.cus_etc && <p className="text-red-500">กรุณาเลือก.</p>}
                            </div>

                        </div>



                    </div>
                    <hr className="mb-3 mt-5"></hr>
                    <h1 className="mb-5  text-2xl">Social Media</h1>

                    <SocialMedia control={control} errors={errors} />

                    <hr className="mb-3 mt-5"></hr>
                    <h1 className="mb-5  text-2xl">ข้อมูลบริษัท</h1>

                    <CompanyComponent control={control} errors={errors}></CompanyComponent>


                    <div className="flex items-center justify-end  rounded-b">
                        <button
                            style={{
                                border: '1px solid #417CA0',
                                color: "#305D79",
                                marginRight: '10px'
                            }}
                            className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"

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
                </form>
                </FormProvider>

            </div>

        </>
    )
}


export default DetailCustomer