"use client";
import React, { useEffect, useState } from 'react';

//interface

import AddPurchase from './add/AddPurchase';

import CSViewPurchaseComponents from '@/components/CS/Content/Prepurchase/CsviewPurchase';
import { useRouter } from 'next/router';
import {purchaseData} from "@/stores/purchase";

//store
import {useAppSelector} from "@/stores/hooks";

const PrePurchase = () => {


  return (
    <>
    <div className="p-5 mx-auto  text-black">
      <div className="flex">
        <div className="flex-1 w-50">
          <h1 className="mb-5  text-2xl">ข้อมูล Estimate : ตีราคา</h1>
        </div>

        <div className="flex-1 w-50 justify-end right-0 flex space-x-4">
          {/*<button*/}
          {/*    // onClick={() => changeEdit(!formEditcustomer)}*/}
          {/*    style={{*/}
          {/*        background: "#C8D9E3",*/}
          {/*        color: "#417CA0",*/}
          {/*        width: "119px",*/}
          {/*        height: "36px"*/}
          {/*    }}*/}
          {/*    className="flex hover:bg-blue-700   mr-1"*/}
          {/*>*/}
          {/*    <Lucide*/}
          {/*        color="#6C9AB5"*/}
          {/*        icon="Pencil"*/}
          {/*        className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"*/}
          {/*    ></Lucide>*/}
          {/*    <p*/}
          {/*        className="text-[#417CA0]*/}
          {/*    text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"*/}
          {/*    >*/}
          {/*        แก้ไขข้อมูล*/}
          {/*    </p>*/}
          {/*</button>*/}

        </div>
      </div>
      <CSViewPurchaseComponents/>
      {/*<AddPurchase BookingId={BookingId}></AddPurchase>*/}
    </div>

      </>

  )
}

export default PrePurchase