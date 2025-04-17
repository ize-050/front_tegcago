"use client";

import React, { Fragment, useEffect, useState } from "react";

import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";

//store
import { financeData, setModalRecordMoney } from "@/stores/finance";

//component recode_money

import { useAppDispatch } from "@/stores/hooks";

//Modal
// import TableComponent from "@/components/finance/data/record_money/TableComponent";
import TableComponent from "@/components/finance/data/record_money/index";
import ModalRecordMoney from "@/components/finance/data/record_money/ModalComponent";

export default function WorkPage() {
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(setModalRecordMoney(true));
  };

  return (
    <div className="w-full h-full">
      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
             บันทึกข้อมูลฝากสั่งและชำระ
          </p>
        </div>
       
        <div className="flex-none p-5 flex gap-2">
          {/* <button
            className="bg-blue-950 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg mr-1 mb-1"
            onClick={() => {
              // Handle export functionality
              console.log("Export");
            }}
            type="button"
          >
            ส่งออก Excel
          </button> */}
        </div>  
      </div>

      <div className="container mx-auto px-5">
        <div
          className="bg-white rounded-lg"
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <TableComponent />
          <ModalRecordMoney />
        </div>
      </div>
    </div>
  );
}
