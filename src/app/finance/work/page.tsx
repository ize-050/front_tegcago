"use client"
import React, { Fragment ,useEffect,useState} from "react";

import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";


//service
import { getPurchase } from "@/services/finance";

//component
import TableComponent from "@/components/finance/work/TableComponent";

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
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a
              href="#"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
            </svg>
              <span className="ml-1">Home</span>
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <span className="ml-1 text-gray-700">Work</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
            ข้อมูลจองตู้ใบงาน
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
