import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setOpenToast } from '@/stores/util';
import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"
import { signIn } from 'next-auth/react';

import { getPurchaseById } from '@/services/purchase'

import { customerData } from '@/stores/customer'


import {
    setPurchaseData,
    submitPrePurchase,
    purchaseData
} from '@/stores/purchase'

//interface

import {
    RouteData,
    TermData,
    TransportData,
} from './prepurchase.interface'
import { Route } from 'react-router-dom';

const ViewPrePurchase = ({ purchase }: any) => {

    const { customer_detail } = useAppSelector(customerData)
    const dispatch = useAppDispatch()
    const [data, setData] = useState<Partial<any>>({})
    const methods = useForm()
    const router = useRouter();




    useEffect(() => {
        setData(purchase)
    }, [purchase])


    return (
        <>
            <div className=" flex  flex-col  md:flex-row  mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">เลขตีราคา</label>
                    <p>{data?.book_number}</p>
                </div>
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ชื่อเซลล์</label>
                    <p>{customer_detail.customer_emp[0].user.fullname}</p>
                </div>
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">วันที่/เวลา</label>
                    <p>{customer_detail.cus_sex}</p>
                </div>
            </div>


            <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2  text-gray-500  text-sm">รหัสลูกค้า</label>
                    <p>{data?.customer_number}</p>
                </div>
            </div>



            <hr className="mb-5"></hr>
            <h1 className="mb-5  text-2xl">ข้อมูลขนส่ง</h1>
            <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Route</label>
                    <p>{data?.d_route}</p>
                </div>
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ขนส่ง</label>
                    <p>{data?.d_transport}</p>
                </div>
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Term</label>
                    <p>{data?.d_term}</p>
                </div>
            </div>


            <hr className="mb-5 mt-5"></hr>
            <h1 className="mb-5  text-2xl">ข้อมูลสินค้า</h1>
            <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold"> </label>
                    <p>{data?.d_product?.d_product_name}</p>
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">เพิ่มรูปภาพ</label>
                    <p>{customer_detail.cus_line}</p>
                </div>
            </div>



            <hr className="mb-5 mt-5"></hr>
                    <h2 className="mb-5  text-2xl">ข้อมูลการขนส่ง</h2>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Port ต้นทาง</label>
                            <p>{data?.d_origin}</p>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Port ปลายทาง</label>
                           <p>{data?.d_destination}</p>
                        </div>

                    </div>

                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-2/4 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ขนาดตู้</label>
                                <p>{data?.d_size}</p>
                            </div>
                            <div className="w-full md:w-2/4  flex flex-col">
                                <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">น้ำหนัก</label>
                               <p>{data?.d_weight}</p>
                            </div>

                        </div>
                        <div className="w-full md:w-1/2  flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">บริการหัวรถลาก</label>
                                <p>{data?.d_truck}</p>
                        </div>
                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ที่อยู่ต้นทาง</label>
                                <p>{data?.d_address_origin}</p>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ที่อยู่ปลายทาง </label>
                            <p>{data?.d_address_destination}</p>
                        </div>
                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Refund Tax ต้นทาง</label>
                            <p>{data?.d_refund_tag}</p>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">หมายเหตุ </label>
                            
                            <p>{data?.d_etc}</p>
                        </div>
                    </div>

                 

        </>

    )
}

export default ViewPrePurchase