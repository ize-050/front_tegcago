import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';


import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"


import Image from 'next/image'
import { customerData } from '@/stores/customer'


import {
    setPurchaseData,
    submitPrePurchase,
    purchaseData,
    setModalImage
    
} from '@/stores/purchase'

//interface

import {
    RouteData,
    TermData,
    TransportData,
} from './prepurchase.interface'
import { Route } from 'react-router-dom';
import Lucide from '@/components/Base/Lucide';
import ModalPreviewImageView from './ModelviewImage';

const ViewPrePurchase = ({ purchase }: any) => {

    const { customer_detail } = useAppSelector(customerData)
    const { modalImage } = useAppSelector(purchaseData)
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
                    <label className="block mb-2  text-gray-500  text-sm">invoice & Packinglist No.</label>
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
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ชื่อสินค้า</label>
                    <p>{data?.d_product?.d_product_name}</p>
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">รูปภาพ</label>
                    <div className="flex flex-row">
                    {data?.d_product?.d_product_image.map((image:Partial<any>, index:number) => (
                       
                        <div key={index} className="relative rounded-lg w-32 h-32 m-2 ">
                            <Image
                                src={image.url}
                                alt="preview"
                                fill // Fill the container
                                className="object-cover rounded"
                            />
                         
                            <div className="absolute bottom-1 right-0 flex gap-2">
                          
                                <button
                                    onClick={() => {
                                         dispatch(setModalImage(true))
                                    }}
                                    type="button"
                                    className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1">
                                    <Lucide
                                        color="#6C9AB5"
                                        icon="Eye"
                                        className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                    ></Lucide>
                                </button>
                            </div>
                        </div>
                        
                    ))}
                    </div>
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

                 
                    <ModalPreviewImageView isOpen={modalImage} onClose={() => dispatch(setModalImage(false))} images={data?.d_product?.d_product_image} />      
        </>

    )
}

export default ViewPrePurchase