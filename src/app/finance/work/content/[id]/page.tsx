"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";

import { useState, useEffect, useCallback } from "react";
import { Clock, CircleUserRound } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

//services

import {getPurchaseByid, getWorkByid} from "@/services/finance"
//store

import {
  setCustomerDetail,
  resetStore,
} from "@/stores/customer";

//component
import Button from "@/components/Base/Button";


import DetailCustomer from "@/components/Content/DetailCustomer/DetailCustomer";
import ViewCustomer from "@/components/Content/DetailCustomer/ViewCustomer";
import PurchaseComponent from "@/components/Content/Purchase/purchase"
import PrePurchase from "@/components/Content/Prepurchase/add/Addprepurchase";

//store
import { customerData, ChangeFormEdit } from '@/stores/customer'
import { purchaseData, setPurchaseData } from "@/stores/purchase";

import { setPurchaseFinanceDetail ,setPurchaseFinanceData } from "@/stores/finance"

import { setOpenToast } from "@/stores/util"
import FormFinanceComponent from "@/components/finance/work/FormpaymentComponent";



function Addfinance() {
  const router = useRouter()
  const {id} = useParams()
  const dispatch = useAppDispatch();
  const { purchase } = useAppSelector(purchaseData)
  const [activeTab, setActiveTab] = useState('Prepurchase');
  const [BookingId , setBookingId] = useState<string>('')

  const handleTabClick = useCallback((tabName: any) => {
    if (tabName === 'purchase') {
      if (purchase?.d_status == 'Prepurchase') {
        setActiveTab(tabName);
      }
      else {
        dispatch(setOpenToast({
          type: 'info',
          message: 'ไม่สามารถเข้าถึงข้อมูลได้ กรุณาตีราคาให้สำเร็จก่อน'
        }))
      }
    }
    else {
      setActiveTab(tabName);
    }

  }, [purchase, activeTab])




 

  useEffect(()=>{

    console.log("purchaseId",id)
    const getPurchase = async () => {
      const  purchase_by_id : any =  await getPurchaseByid(id as string)  
      if(purchase_by_id){
        dispatch(setPurchaseFinanceDetail(purchase_by_id.cs_purchase))
        dispatch(setPurchaseFinanceData(purchase_by_id))
      }
    }

    const getWork = async () => {
      const  work_by_id : any =  await getWorkByid(id as string);
      
      console.log("work_by_id",work_by_id)
      if(work_by_id !=null){
          
      }
    }

    getPurchase()
    getWork()
  },[id])



  return (
    <>
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="ml-1">ข้อมูลการจองตู้-การชำระเงิน</span>
            </a>
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
      </div>


      <div className="container mx-auto px-5 ">
        <div
          className="bg-white  rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <div className="text-sm flex flex-wrap  justify-between  font-medium text-center text-gray-500 border-b border-gray-200">
            <ul className="flex  flex-wrap  -mb-px">
              <li className="me-2">
                <a
                  onClick={() => handleTabClick('Prepurchase')}
                  href="#"
                  className={`
                                 flex inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'Prepurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >ข้อมูลทางการเงิน
                  {purchase?.d_status === "Prepurchase" ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.0606 9.06055L14.0606 9.06061L14.0666 9.05436C14.3399 8.77145 14.4911 8.39255 14.4877 7.99925C14.4842 7.60596 14.3265 7.22974 14.0484 6.95163C13.7703 6.67352 13.394 6.51576 13.0007 6.51234C12.6074 6.50893 12.2285 6.66012 11.9456 6.93336L11.9456 6.9333L11.9394 6.93945L9 9.87889L8.06055 8.93945L8.06061 8.93939L8.05436 8.93336C7.77145 8.66012 7.39255 8.50893 6.99925 8.51235C6.60596 8.51576 6.22974 8.67352 5.95163 8.95163C5.67352 9.22974 5.51576 9.60596 5.51234 9.99925C5.50893 10.3926 5.66012 10.7715 5.93336 11.0544L5.9333 11.0544L5.93945 11.0606L7.93945 13.0606L7.9395 13.0606C8.22079 13.3418 8.60225 13.4998 9 13.4998C9.39775 13.4998 9.77921 13.3418 10.0605 13.0606L10.0606 13.0606L14.0606 9.06055ZM15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5C8.01088 17.5 6.10322 16.7098 4.6967 15.3033C3.29018 13.8968 2.5 11.9891 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033Z" fill="#10A697" stroke="#10A697" />
                    </svg>
                    : ''}
                </a>
              </li>
            </ul>
          </div>

          <FormFinanceComponent></FormFinanceComponent>


        </div>
        
        </div>

    </>
  );
}

export default Addfinance;
