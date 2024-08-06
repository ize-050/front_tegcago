"use client";
import { Fragment } from 'react';
import React, { useState, useEffect } from 'react';


//store
import { useAppDispatch,useAppSelector } from '@/stores/hooks';
import {
    purchaseData,
    setModalViewAgentCy,
    setAgentCyDetail
} from '@/stores/purchase'

const ApproveComponent = () => {
    
    const dispatch = useAppDispatch()

    const { purchase } = useAppSelector(purchaseData)

    const [data, setData] = useState<Partial<any>>({})
    useEffect(() => {
        setData(purchase)
    }, [purchase])
    return (
        <Fragment>
            <div className="p-5 mx-auto  text-black">
                <div className="flex">
                    <div className="flex-1 w-50">
                        <h1 className="mb-5  text-2xl">ข้อมูล ใบเสนอราคา</h1>
                    </div>
                    
                </div>

                <div className=" flex  flex-col  md:flex-row  mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">เลขตีราคา</label>
                        <p>{data?.book_number}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">ชื่อเซลล์</label>
                        {data.d_purchase_emp?.length > 0 &&
                            <p>{data.d_purchase_emp[0].user.fullname}</p>
                        }

                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">วันที่/เวลา</label>
                        <p>{data.createdAt} </p>
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


            </div>
        </Fragment>
    )
}

export default ApproveComponent