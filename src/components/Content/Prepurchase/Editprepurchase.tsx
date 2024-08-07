"use client";
import React, { Fragment, useEffect, useState } from 'react';
import Lucide from '@/components/Base/Lucide'
import { useForm } from "react-hook-form"
//interface

import AddPurchase from './add/AddPurchase';

import ViewPurchaseComponents from '@/components/Content/Prepurchase/viewPurchase';
import { useRouter } from 'next/router';
import {purchaseData} from "@/stores/purchase";

//store
import {useAppSelector} from "@/stores/hooks";
import UploadImageComponent from '../../Uploadimage/UpdateImageComponent';



const PrePurchase = () => {
  const methods = useForm()
  const {
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      control,
  } = methods;

  const {purchase} = useAppSelector(purchaseData)

  useEffect(() => {

  }, []);

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
       <ViewPurchaseComponents purchase={purchase}/>

       <hr className="mt-5"></hr>
       {purchase?.d_document?.length > 0 && (
        <div className="p-1">
          <h1 className="mb-5  text-2xl">เอกสารเพิ่มเติม</h1>
          <div className="grid grid-cols-2 gap-4">
            {purchase?.d_document.map((item: any, index: number) => (
              <Fragment key={index}>
              <div key={index} className="border p-5">
                <h1 className="text-xl">{item.d_document_name}</h1>
                <div className="w-full  flex flex-col">
                           <label
                             className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เพิ่มรูปภาพ / ไฟล์</label>
                            <UploadImageComponent setValue={setValue} control={'s'}></UploadImageComponent>
                       </div>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
      {/*<AddPurchase BookingId={BookingId}></AddPurchase>*/}
    </div>

  )
}

export default PrePurchase