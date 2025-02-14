"use client"
import React, { Fragment ,useEffect,useState} from "react";

import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";


//service
import { getPurchase } from "@/services/finance";

//component recode_money
import TableComponent from "@/components/finance/data/record_chinese/TableComponent";
import Button from "@/components/Base/Button";

export default  function WorkPage() {
  

  const [purchase, setPurchase] = useState<any>()

  useEffect(() => {
    const getData = async () => {

      const data_params ={
        page:1,
      }

      const finance_purchase : any = await getPurchase(data_params);
      setPurchase(finance_purchase)
    }
    getData()
  }, [])


  
  return (
    <Fragment>
   

      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
             บันทึกข้อมูลรายจ่ายฝั่งจีน
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

     

          <TableComponent purchase={purchase} />
      </div>
      </div>


    </Fragment>
  );
}
