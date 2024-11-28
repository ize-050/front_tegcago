"use client";

import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";

import { useState, useEffect, useCallback } from "react";
import { Clock, CircleUserRound } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

//services
import { getPurchaseById } from "@/services/purchase";

//store

import {
  resetStore,
} from "@/stores/customer";

//component
import Button from "@/components/Base/Button";
import DetailCustomer from "@/components/Content/DetailCustomer/DetailCustomer";
import ViewCustomer from "@/components/Content/DetailCustomer/ViewCustomer";
import PurchaseComponent from "@/components/Content/Purchase/purchase"

import ApprovePurchase from "@/components/Content/ApprovePurchase/ApproveComponent";
import StatusPurchase from "@/components/Content/StatusPurchase/Statuspurchase";

//store
import { customerData, ChangeFormEdit } from '@/stores/customer'
import { purchaseData, setPurchaseData } from "@/stores/purchase";

import { setOpenToast } from "@/stores/util"
import Prepurchase from "@/components/Content/Prepurchase/prepurchase";
import Link from "next/link";
import App from "next/app";
import purchase from '../../../../stores/purchase';
import { useSession } from "next-auth/react";




function Addpurchase() {
  const router = useRouter()
  const { data: session }:any = useSession();
  const dispatch = useAppDispatch();
  const { customer_detail, formEditcustomer } = useAppSelector(customerData)
  const { purchase } = useAppSelector(purchaseData)
  const [activeTab, setActiveTab] = useState('Prepurchase');
  const { id }: {
    id: string
  } = useParams();


  useEffect(() => {
    if(session?.role == 'Cs'){
      router.push(`/cs/purchase/content/${id}`);
    }
  }, [session]);

  const handleTabClick = useCallback((tabName: any) => {
    if (tabName === 'purchase') {
      setActiveTab(tabName);
    }
    else {
      setActiveTab(tabName);
    }

  }, [purchase, activeTab])



  useEffect(() => {
    const getPurchase = async () => {
      const purchase = await getPurchaseById(id)
      
      dispatch(setPurchaseData(purchase))

    }
    // fetchCustomerDetail()
    getPurchase()
    dispatch(resetStore())
  }, [id])


  useEffect(() => {
    if (customer_detail.status_update == true) {
      dispatch(ChangeFormEdit(true));
    }

  }, [customer_detail])





  return (
    <>
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="ml-1">Dashboard</span>
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <Link
                href="/purchase"
                className="ml-1 text-gray-500 hover:text-gray-700">ข้อมูลใบจอง</Link>

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
          {/* <Button className="border-[#417CA0] bg-[#C8D9E3] mr-5"
            style={{
              color: "#305D79"
            }}
          >
            <CircleUserRound
              color="#273A6F"

              className="inset-y-0 bg-secondary-400  mr-2  justify-center m-auto   w-5 h-5  text-slate-500"
            ></CircleUserRound>
            ส่งมอบงาน :
          </Button> */}
          {/* <Button className="text-[#417CA0]  border-[#417CA0] bg-[#FFFFFF]

                    hover:bg-blue-200 hover:text-white"
            style={{
              background: "#fffff"
            }}
          >
            <Clock
              color="#417CA0"
              className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
            ></Clock>

            Activity Log
          </Button> */}
        </div>
      </div>


      <div className="container mx-auto px-5 ">
        <div
          className="bg-white  rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <div
            className="text-sm flex flex-wrap  justify-between  font-medium text-center text-gray-500 border-b border-gray-200">
            <ul className="flex  flex-wrap  -mb-px">
              <li className="me-2">
                <a
                  onClick={() => handleTabClick('Prepurchase')}
                  href="#"
                  className={`
                                 flex  p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'Prepurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >ตีราคา
                  {purchase?.d_status === "Prepurchase" ?
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14.0606 9.06055L14.0606 9.06061L14.0666 9.05436C14.3399 8.77145 14.4911 8.39255 14.4877 7.99925C14.4842 7.60596 14.3265 7.22974 14.0484 6.95163C13.7703 6.67352 13.394 6.51576 13.0007 6.51234C12.6074 6.50893 12.2285 6.66012 11.9456 6.93336L11.9456 6.9333L11.9394 6.93945L9 9.87889L8.06055 8.93945L8.06061 8.93939L8.05436 8.93336C7.77145 8.66012 7.39255 8.50893 6.99925 8.51235C6.60596 8.51576 6.22974 8.67352 5.95163 8.95163C5.67352 9.22974 5.51576 9.60596 5.51234 9.99925C5.50893 10.3926 5.66012 10.7715 5.93336 11.0544L5.9333 11.0544L5.93945 11.0606L7.93945 13.0606L7.9395 13.0606C8.22079 13.3418 8.60225 13.4998 9 13.4998C9.39775 13.4998 9.77921 13.3418 10.0605 13.0606L10.0606 13.0606L14.0606 9.06055ZM15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5C8.01088 17.5 6.10322 16.7098 4.6967 15.3033C3.29018 13.8968 2.5 11.9891 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033Z"
                        fill="#10A697" stroke="#10A697" />
                    </svg>
                    : ''}
                </a>
              </li>
              <li className="me-2">
                <a href="#"
                  onClick={() => handleTabClick('purchase')}
                  className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'purchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >ใบเสนอราคา</a>
              </li>
              <li className="me-2">
                <a href="#"
                  onClick={() => handleTabClick('ApprovePurchase')}
                  className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'ApprovePurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >อนุมัติราคา</a>
              </li>
              <li>
                <a href="#"
                 onClick={() => handleTabClick('StatusPurchase')}
                  className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'StatusPurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >อัพเดดสถานะ</a>
              </li>


            </ul>
            <p className="inline-block p-4   rounded-t-lg  justify-end  text-black">
              <button
                className={`badge ${purchase?.color}   w-25 text-white   p-1 rounded-md`}
              >
                {purchase?.d_status}
              </button>
            </p>

          </div>

          {activeTab === "Prepurchase" ?
              <Prepurchase></Prepurchase>
            :
           activeTab === "purchase" ?
              <PurchaseComponent></PurchaseComponent>
              :
           activeTab === 'ApprovePurchase' ?
              <ApprovePurchase></ApprovePurchase>
                : 
           activeTab === 'StatusPurchase' && purchase ?
              <StatusPurchase purchase={purchase}></StatusPurchase>
              : null
          }
        </div>
      </div>

    </>
  );
}

export default Addpurchase;
