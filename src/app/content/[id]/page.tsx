"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";

import { useState, useEffect, useCallback, createRef, useMemo } from "react";
import { CirclePlus, ArrowUpFromLine } from 'lucide-react';
import { useRouter,useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import Lucide from "@/components/Base/Lucide";

import clsx from "clsx";

import _ from "lodash";

//services
import { getCustomer } from "@/services/customer";

//store

import {
    setCustomerDetail ,

} from "@/stores/customer";

//component
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import ModalCreateCustomer from "@/components/Sale/Customer/ModalAddcustomer";
import DetailCustomer from "@/components/Content/DetailCustomer/DetailCustomer";
import {customerData} from '@/stores/customer'


//service

import {getCustomerDetail} from  '@/services/customer' 

function Content() {


    const [tooltipOpen, setTooltipOpen] = useState(null);
    const router = useRouter()
    const dispatch = useAppDispatch();
    const { customer_detail } =  useAppSelector(customerData)
    const {id} :{
        id:string
    } = useParams();


    const getCustomerDetailByid = async(id: string ) =>{
        const customer_detail =  await getCustomerDetail(id)
        dispatch(setCustomerDetail(customer_detail))
    }
    
    useEffect(()=>{
      getCustomerDetailByid(id)
    },[id])


    useEffect(()=>{

    },[customer_detail])


    return (
        <>
            <nav aria-label="Breadcrumb" className="p-5">
                <ol className="flex items-center space-x-2">
                    <li className="flex items-center">
                        <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span className="ml-1">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="text-gray-500">/</span>
                            <a href="#"
                                onClick={() => {
                                    router.replace('/customer')
                                 
                                }}
                                className="ml-1 text-gray-500 hover:text-gray-700">ข้อมูลลูกค้า</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="text-gray-500">/</span>
                            <span className="ml-1 text-gray-700">รายละเอียด</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="lg:flex md:flex ">
                <div className="flex-1 p-5">
                    <p className="text-black text-xl font-bold">
                        รายละเอียด
                    </p>
                </div>
                <div className="justify-end p-5">
                    <Button className="border-blue-500 mr-5"
                        style={{
                            color: "#305D79"
                        }}
                    >
                        <ArrowUpFromLine
                            color="#305D79"

                            className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
                        ></ArrowUpFromLine>
                        Upload file
                    </Button>
                    <Button className="text-white  border-blue-800"


                        style={{
                            background: "#273A6F"
                        }}
                    >
                        <CirclePlus
                            color="#ffffff"

                            className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
                        ></CirclePlus>

                        สร้างข้อมูลลูกค้า
                    </Button>
                </div>
            </div>


            <div className="container mx-auto px-5 ">
                <div
                    className="bg-white  rounded-lg "
                    style={{
                        border: "1px solid #D2D6E1",
                    }}
                >
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px">
                            <li className="me-2">
                                <a href="#" className="inline-block p-4 border-b-2   rounded-t-lg text-blue-600 border-blue-600 rounded-t-lg active hover:text-gray-600 hover:border-gray-300">ข้อมูลลูกค้า</a>
                            </li>
                            <li className="me-2">
                                <a href="#" className="inline-block p-4 text-blue-600 border-b-2 rounded-t-lg" >ตีราคา</a>
                            </li>
                            <li className="me-2">
                                <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">ใบเสนอราคา</a>
                            </li>
                            <li className="me-2">
                                <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">อนุมัติราคา</a>
                            </li>
                            <li>
                                <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">อัพเดดสถานะ</a>
                            </li>
                        </ul>
                    </div>

              {customer_detail.updated_at ==null ?
                <DetailCustomer></DetailCustomer> :''
              }
              


                </div></div>

        </>
    );
}

export default Content;
