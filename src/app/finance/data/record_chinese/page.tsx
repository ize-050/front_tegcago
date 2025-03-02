"use client"
import React, { Fragment ,useEffect,useState} from "react";

import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";

//store
import { financeData, setModalRecordMoney } from "@/stores/finance";

//component recode_money
import TableComponent from "@/components/finance/data/record_chinese/TableComponent";
import { useAppDispatch } from "@/stores/hooks";


//Modal
import ModalRecordMoney from "@/components/finance/data/record_chinese/ModalComponent";

export default  function WorkPage() {
  const dispatch = useAppDispatch();
  

 const handleAdd = () => {
    dispatch(setModalRecordMoney(true))
 }

  
  return (
    <Fragment>
   

      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
             บันทึกรับ-รายจ่ายฝั่งจีน คาร์โก้
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

        <div className="justify-between flex items-center p-5">
          <button
          className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg   mr-1 mb-1 
          "
          onClick={handleAdd}
          type="button"
          >+ เพิ่มข้อมูลการโอนเงิน</button>

        </div>  

          <TableComponent  />

          <ModalRecordMoney/>
      </div>
      </div>

      


    </Fragment>
  );
}
