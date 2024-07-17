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
import AddPurchase from './add/AddPurchase';
import { View } from 'lucide-react';
import ViewPrePurchase from './viewPurchase';
import Lucide from '@/components/Base/Lucide';

const PrePurchase = () => {

    const { customer_detail } = useAppSelector(customerData)
    const dispatch = useAppDispatch()
    const { purchase } = useAppSelector(purchaseData)


    const router = useRouter();



    useEffect(()=>{
        console.log('purchase',purchase)
    },[purchase])



    return (
        <div className="p-5 mx-auto  text-black">
            <div className="flex">
                <div className="flex-1 w-50">
                    <h1 className="mb-5  text-2xl">ข้อมูล Estimate : ตีราคา</h1>
                </div>

                <div className="flex-1 w-50 justify-end right-0 flex space-x-4">
                    <button
                        // onClick={() => changeEdit(!formEditcustomer)}
                        style={{
                            background: "#C8D9E3",
                            color: "#417CA0",
                            width: "119px",
                            height: "36px"
                        }}
                        className="flex hover:bg-blue-700   mr-1"
                    >
                        <Lucide
                            color="#6C9AB5"
                            icon="Pencil"
                            className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
                        ></Lucide>
                        <p
                            className="text-[#417CA0]
                        text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"
                        >
                            แก้ไขข้อมูล
                        </p>
                    </button>

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

            {purchase?.d_status != "Prepurchase" ?
                <AddPurchase purchase={purchase}></AddPurchase> : <ViewPrePurchase purchase={purchase} ></ViewPrePurchase>
            }



        </div>

    )
}

export default PrePurchase