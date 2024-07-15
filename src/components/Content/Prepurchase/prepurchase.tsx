import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAppDispatch,useAppSelector } from '@/stores/hooks';
import { setOpenToast } from '@/stores/util';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signIn } from 'next-auth/react';

import { customerData } from '@/stores/customer'
import Lucide from '@/components/Base/Lucide';

const PrePurchase = () => {

    const {customer_detail} = useAppSelector(customerData)
    


    return(
        <div className="p-5 mx-auto  text-black">
        <div className="flex">
            <div className="flex-1 w-50">
                <h1 className="mb-5  text-2xl">ข้อมูล Estimate : ตีราคา</h1>
            </div>

        
        </div>

        <div className=" h-auto w-full ">
            <div
                className="bg-[#D2D6E1] bg-opacity-30 p-2  flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
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
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เลขตีราคา</label>
                <p>{customer_detail.cd_department}</p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ชื่อเซลล์</label>
                <p>{customer_detail.cus_international}</p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">วันที่/เวลา</label>
                <p>{customer_detail.cus_sex}</p>
            </div>
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2  text-gray-700  text-sm">รหัสลูกค้า</label>
             
            </div>
        </div>


        <hr className="mb-5"></hr>
        <h1 className="mb-5  text-1xl">ข้อมูลขนส่ง</h1>
        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Route</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ขนส่ง</label>
                <p>{customer_detail.cus_line}</p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Term</label>
                <p>{customer_detail.cus_facebook}</p>
            </div>
        </div>



        <hr className="mb-5"></hr>
        <h1 className="mb-5  text-1xl">ข้อมูลสินค้า</h1>
        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ชื่อสินค้า</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เพิ่มรูปภาพ</label>
                <p>{customer_detail.cus_line}</p>
            </div>
        </div>


        <hr className="mb-5"></hr>
        <h1 className="mb-5  text-1xl">ข้อมูลการขนส่ง</h1>
        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Port ต้นทาง</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Port ปลายทาง</label>
                <p>{customer_detail.cus_line}</p>
            </div>
            
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className ="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-2/4 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ขนาดตู้</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-2/4  flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">น้ำหนัก</label>
                <p>{customer_detail.cus_line}</p>
            </div>

            </div>
            <div className="w-full md:w-1/2  flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">บริการหัวรถลาก</label>
                <p>{customer_detail.cus_line}</p>
            </div>
        </div>


        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่อยู่ต้นทาง</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่อยู่ปลายทาง </label>
                <p>{customer_detail.cus_line}</p>
            </div>
        </div>


        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Refund Tax ต้นทาง</label>
                <p>{customer_detail.cus_website}</p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">หมายเหตุ </label>
                <p>{customer_detail.cus_line}</p>
            </div>
        </div>


    </div>
    )
}

export default PrePurchase